import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbotId = request.nextUrl.searchParams.get('chatbot_id');

    if (!chatbotId) {
      return NextResponse.json({ error: 'Missing chatbot_id' }, { status: 400 });
    }

    const { data: ownedChatbot } = await supabase
      .from('chatbots')
      .select('id')
      .eq('id', chatbotId)
      .eq('user_id', user.id)
      .single();

    if (!ownedChatbot) {
      return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
    }

    const { data: conversations, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('chatbot_id', chatbotId)
      .order('last_message_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const enriched = await Promise.all(
      (conversations ?? []).map(async (conversation) => {
        const { data: lastMessage } = await supabase
          .from('messages')
          .select('content')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        return {
          ...conversation,
          last_message: lastMessage?.content ?? '',
        };
      })
    );

    return NextResponse.json({ conversations: enriched });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
