export interface Profile {
  id: string;
  email: string;
  plan: 'free' | 'starter' | 'growth' | 'business';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface OpeningHours {
  [day: string]: { open: string; close: string; closed?: boolean };
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
}

export interface Chatbot {
  id: string;
  user_id: string;
  name: string;
  business_name: string;
  business_description: string;
  services: string;
  faqs: FAQ[];
  opening_hours: OpeningHours;
  contact_info: ContactInfo;
  greeting_message: string;
  widget_color: string;
  is_active: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  chatbot_id: string;
  visitor_id: string;
  started_at: string;
  last_message_at: string;
  message_count: number;
  metadata: Record<string, unknown>;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  chatbot_id: string;
  conversation_id?: string;
  visitor_id?: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
}

export interface ConversationWithPreview extends Conversation {
  last_message?: string;
}

export interface DashboardStats {
  total_conversations: number;
  messages_today: number;
  active_chatbots: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      chatbots: {
        Row: Chatbot;
        Insert: Omit<Chatbot, 'id' | 'created_at'>;
        Update: Partial<Omit<Chatbot, 'id' | 'user_id' | 'created_at'>>;
      };
      conversations: {
        Row: Conversation;
        Insert: Omit<Conversation, 'id' | 'started_at'>;
        Update: Partial<Omit<Conversation, 'id' | 'chatbot_id' | 'started_at'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id' | 'created_at'>>;
      };
    };
  };
}
