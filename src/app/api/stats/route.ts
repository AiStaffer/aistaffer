import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: chatbots, error: chatbotsError } = await supabase
      .from('chatbots')
      .select('id, is_active')
      .eq('user_id', user.id);

    if (chatbotsError) {
      return NextResponse.json({ error: chatbotsError.message }, { status: 500 });
    }

    const chatbotIds = (chatbots ?? []).map((chatbot) => chatbot.id);

    if (chatbotIds.length === 0) {
      return NextResponse.json({
        total_conversations: 0,
        messages_today: 0,
        active_chatbots: 0,
      });
    }

    const { count: totalConversations, error: conversationsError } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .in('chatbot_id', chatbotIds);

    if (conversationsError) {
      return NextResponse.json({ error: conversationsError.message }, { status: 500 });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { data: conversationIdsData } = await supabase
      .from('conversations')
      .select('id')
      .in('chatbot_id', chatbotIds);

    const conversationIds = (conversationIdsData ?? []).map((conversation) => conversation.id);

    let messagesToday = 0;
    if (conversationIds.length > 0) {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .gte('created_at', today.toISOString());
      messagesToday = count ?? 0;
    }

    return NextResponse.json({
      total_conversations: totalConversations ?? 0,
      messages_today: messagesToday,
      active_chatbots: (chatbots ?? []).filter((chatbot) => chatbot.is_active).length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
