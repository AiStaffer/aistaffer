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

    const chatbotId = request.nextUrl.searchParams.get('id');

    if (chatbotId) {
      const { data: chatbot, error } = await supabase
        .from('chatbots')
        .select('*')
        .eq('id', chatbotId)
        .eq('user_id', user.id)
        .single();

      if (error || !chatbot) {
        return NextResponse.json({ error: 'Chatbot not found' }, { status: 404 });
      }

      return NextResponse.json({ chatbot });
    }

    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chatbots: chatbots ?? [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string };

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert({
        user_id: user.id,
        name: body.name || 'New Chatbot',
        business_name: '',
        business_description: '',
        services: '',
        faqs: [],
        opening_hours: {},
        contact_info: { phone: '', email: '', address: '' },
        greeting_message: 'Hi there! How can I help you today?',
        widget_color: '#2563eb',
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chatbot }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown> & { id?: string };

    if (!body.id) {
      return NextResponse.json({ error: 'Missing chatbot id' }, { status: 400 });
    }

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .update({
        name: body.name,
        business_name: body.business_name,
        business_description: body.business_description,
        services: body.services,
        faqs: body.faqs,
        opening_hours: body.opening_hours,
        contact_info: body.contact_info,
        greeting_message: body.greeting_message,
        widget_color: body.widget_color,
        is_active: body.is_active,
      })
      .eq('id', body.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ chatbot });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const chatbotId = request.nextUrl.searchParams.get('id');

    if (!chatbotId) {
      return NextResponse.json({ error: 'Missing chatbot id' }, { status: 400 });
    }

    const { error } = await supabase
      .from('chatbots')
      .delete()
      .eq('id', chatbotId)
      .eq('user_id', user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}
