-- AIStaffer Database Schema
-- Run this in the Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- PROFILES (extends auth.users)
-- ============================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'growth', 'business')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS for profiles
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- CHATBOTS
-- ============================================
create table public.chatbots (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null default 'My Chatbot',
  business_name text not null default '',
  business_description text not null default '',
  services text not null default '',
  faqs jsonb not null default '[]'::jsonb,
  opening_hours jsonb not null default '{}'::jsonb,
  contact_info jsonb not null default '{"phone": "", "email": "", "address": ""}'::jsonb,
  greeting_message text not null default 'Hi there! How can I help you today?',
  widget_color text not null default '#2563eb',
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for chatbots
alter table public.chatbots enable row level security;

create policy "Users can view own chatbots"
  on public.chatbots for select
  using (auth.uid() = user_id);

create policy "Users can create chatbots"
  on public.chatbots for insert
  with check (auth.uid() = user_id);

create policy "Users can update own chatbots"
  on public.chatbots for update
  using (auth.uid() = user_id);

create policy "Users can delete own chatbots"
  on public.chatbots for delete
  using (auth.uid() = user_id);

-- ============================================
-- CONVERSATIONS
-- ============================================
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  chatbot_id uuid references public.chatbots(id) on delete cascade not null,
  visitor_id text not null,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  message_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb
);

-- RLS for conversations
alter table public.conversations enable row level security;

create policy "Users can view conversations for own chatbots"
  on public.conversations for select
  using (
    exists (
      select 1 from public.chatbots
      where chatbots.id = conversations.chatbot_id
      and chatbots.user_id = auth.uid()
    )
  );

-- Allow anonymous inserts for the chat widget (via service role)
create policy "Service role can manage conversations"
  on public.conversations for all
  using (true)
  with check (true);

-- ============================================
-- MESSAGES
-- ============================================
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for messages
alter table public.messages enable row level security;

create policy "Users can view messages for own chatbot conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      join public.chatbots on chatbots.id = conversations.chatbot_id
      where conversations.id = messages.conversation_id
      and chatbots.user_id = auth.uid()
    )
  );

-- Allow service role to manage messages
create policy "Service role can manage messages"
  on public.messages for all
  using (true)
  with check (true);

-- ============================================
-- INDEXES
-- ============================================
create index idx_chatbots_user_id on public.chatbots(user_id);
create index idx_conversations_chatbot_id on public.conversations(chatbot_id);
create index idx_conversations_visitor_id on public.conversations(visitor_id);
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_created_at on public.messages(created_at);
