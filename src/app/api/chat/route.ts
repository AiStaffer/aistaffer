import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import type { ChatRequest, Chatbot, FAQ } from '@/lib/types';

function buildSystemPrompt(chatbot: Chatbot) {
  const faqText = (chatbot.faqs || [])
    .map((faq: FAQ) => `Q: ${faq.question}\nA: ${faq.answer}`)
    .join('\n\n');

  const openingHours = JSON.stringify(chatbot.opening_hours || {}, null, 2);
  const contact = chatbot.contact_info || { phone: '', email: '', address: '' };

  return [
    `You are an AI assistant for ${chatbot.business_name || chatbot.name}.`,
    chatbot.business_description || 'Help customers understand the business and its offerings.',
    `You help customers with questions about: ${chatbot.services || 'the business services and products'}.`,
    faqText ? `Here are common FAQs:\n${faqText}` : '',
    `Opening hours: ${openingHours}.`,
    `Contact: phone ${contact.phone || 'not provided'}, email ${contact.email || 'not provided'}, address ${contact.address || 'not provided'}.`,
    'Be friendly, helpful, and concise.',
    "If you don't know something, say so clearly and suggest the customer contacts the business directly.",
    'Never invent opening hours, pricing, policies, or guarantees that were not provided.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;

    if (!body.message || !body.chatbot_id) {
      return NextResponse.json({ error: 'message and chatbot_id are required' }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: chatbot, error: chatbotError } = await admin
      .from('chatbots')
      .select('*')
      .eq('id', body.chatbot_id)
      .eq('is_active', true)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json({ error: 'Chatbot not found or inactive' }, { status: 404 });
    }

    let conversationId = body.conversation_id;
    const visitorId = body.visitor_id || crypto.randomUUID();

    if (conversationId) {
      const { data: existingConversation } = await admin
        .from('conversations')
        .select('id, message_count')
        .eq('id', conversationId)
        .eq('chatbot_id', body.chatbot_id)
        .maybeSingle();

      if (!existingConversation) {
        conversationId = undefined;
      } else if (existingConversation.message_count >= 50) {
        return NextResponse.json({ error: 'Rate limit reached for this conversation' }, { status: 429 });
      }
    }

    if (!conversationId) {
      const { data: newConversation, error: conversationError } = await admin
        .from('conversations')
        .insert({
          chatbot_id: body.chatbot_id,
          visitor_id: visitorId,
          message_count: 0,
          metadata: {},
          last_message_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (conversationError || !newConversation) {
        return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
      }

      conversationId = newConversation.id;
    }

    const { data: recentMessages } = await admin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20);

    await admin.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: body.message,
    });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: buildSystemPrompt(chatbot) },
        ...((recentMessages ?? []).map((message) => ({
          role: message.role,
          content: message.content,
        })) as Array<{ role: 'user' | 'assistant'; content: string }>),
        { role: 'user', content: body.message },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || 'Sorry, I could not generate a response.';

    await admin.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: reply,
    });

    const nextMessageCount = ((recentMessages?.length ?? 0) + 2);
    await admin
      .from('conversations')
      .update({
        last_message_at: new Date().toISOString(),
        message_count: nextMessageCount,
      })
      .eq('id', conversationId);

    return NextResponse.json({
      reply,
      conversation_id: conversationId,
      visitor_id: visitorId,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
