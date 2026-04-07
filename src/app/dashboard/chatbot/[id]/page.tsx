'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import type { Chatbot, ConversationWithPreview, FAQ } from '@/lib/types';

const defaultChatbot: Chatbot = {
  id: '',
  user_id: '',
  name: 'My Chatbot',
  business_name: '',
  business_description: '',
  services: '',
  faqs: [],
  opening_hours: {},
  contact_info: { phone: '', email: '', address: '' },
  greeting_message: 'Hi there! How can I help you today?',
  widget_color: '#2563eb',
  is_active: true,
  created_at: '',
};

export default function ChatbotSetupPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const chatbotId = params.id;
  const [chatbot, setChatbot] = useState<Chatbot>(defaultChatbot);
  const [conversations, setConversations] = useState<ConversationWithPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [chatbotRes, conversationsRes] = await Promise.all([
          fetch(`/api/chatbots?id=${chatbotId}`),
          fetch(`/api/conversations?chatbot_id=${chatbotId}`),
        ]);

        if (chatbotRes.ok) {
          const chatbotData = await chatbotRes.json();
          setChatbot(chatbotData.chatbot);
        }

        if (conversationsRes.ok) {
          const conversationData = await conversationsRes.json();
          setConversations(conversationData.conversations);
        }
      } catch (error) {
        console.error('Failed to load chatbot data:', error);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, [chatbotId]);

  const embedCode = useMemo(
    () => `<script src="https://aistaffer.co.uk/widget.js" data-chatbot-id="${chatbotId}"></script>`,
    [chatbotId]
  );

  const updateField = <K extends keyof Chatbot>(field: K, value: Chatbot[K]) => {
    setChatbot((prev) => ({ ...prev, [field]: value }));
  };

  const updateFAQ = (index: number, key: keyof FAQ, value: string) => {
    const nextFaqs = [...chatbot.faqs];
    nextFaqs[index] = { ...nextFaqs[index], [key]: value };
    updateField('faqs', nextFaqs);
  };

  const addFAQ = () => {
    updateField('faqs', [...chatbot.faqs, { question: '', answer: '' }]);
  };

  const removeFAQ = (index: number) => {
    updateField(
      'faqs',
      chatbot.faqs.filter((_, i) => i !== index)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/chatbots', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(chatbot),
      });

      if (!res.ok) {
        throw new Error('Failed to save chatbot');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this chatbot? This cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/chatbots?id=${chatbotId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Failed to delete chatbot');
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setDeleting(false);
    }
  };

  const copyEmbedCode = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <Link href="/dashboard" className="text-sm text-primary-600 hover:text-primary-700">
              ← Back to dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{chatbot.name}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 text-sm"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chatbot name</label>
                <input
                  value={chatbot.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
                <input
                  value={chatbot.business_name}
                  onChange={(e) => updateField('business_name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business description</label>
              <textarea
                rows={4}
                value={chatbot.business_description}
                onChange={(e) => updateField('business_description', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="What does the business do?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Services / products</label>
              <textarea
                rows={3}
                value={chatbot.services}
                onChange={(e) => updateField('services', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="List key services or products"
              />
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">FAQs</h2>
              <button onClick={addFAQ} className="text-sm text-primary-600 hover:text-primary-700">
                + Add FAQ
              </button>
            </div>
            {chatbot.faqs.length === 0 && (
              <p className="text-sm text-gray-500">No FAQs yet. Add common questions and answers.</p>
            )}
            <div className="space-y-4">
              {chatbot.faqs.map((faq, index) => (
                <div key={`${index}-${faq.question}`} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                    <input
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Answer</label>
                    <textarea
                      rows={3}
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={() => removeFAQ(index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove FAQ
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Contact & availability</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Opening hours (JSON format)</label>
              <textarea
                rows={5}
                value={JSON.stringify(chatbot.opening_hours, null, 2)}
                onChange={(e) => {
                  try {
                    updateField('opening_hours', JSON.parse(e.target.value) as Chatbot['opening_hours']);
                  } catch {
                    // ignore invalid JSON while typing
                  }
                }}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
                placeholder='{"monday": {"open": "09:00", "close": "17:00"}}'
              />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={chatbot.contact_info.phone}
                  onChange={(e) =>
                    updateField('contact_info', { ...chatbot.contact_info, phone: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  value={chatbot.contact_info.email}
                  onChange={(e) =>
                    updateField('contact_info', { ...chatbot.contact_info, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  value={chatbot.contact_info.address}
                  onChange={(e) =>
                    updateField('contact_info', { ...chatbot.contact_info, address: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Widget settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Greeting message</label>
              <textarea
                rows={3}
                value={chatbot.greeting_message}
                onChange={(e) => updateField('greeting_message', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Widget colour</label>
                <input
                  type="color"
                  value={chatbot.widget_color}
                  onChange={(e) => updateField('widget_color', e.target.value)}
                  className="h-10 w-20 rounded border border-gray-300 bg-white"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
                <input
                  type="checkbox"
                  checked={chatbot.is_active}
                  onChange={(e) => updateField('is_active', e.target.checked)}
                />
                Chatbot active
              </label>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Widget preview</h2>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 min-h-[420px] flex flex-col justify-end">
              <div className="ml-auto w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                <div className="px-4 py-3 text-white" style={{ backgroundColor: chatbot.widget_color }}>
                  <p className="font-semibold">{chatbot.business_name || 'Your business'}</p>
                  <p className="text-xs opacity-90">AI assistant</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-700 max-w-[85%]">
                    {chatbot.greeting_message}
                  </div>
                  <div
                    className="ml-auto text-white rounded-2xl rounded-tr-sm px-3 py-2 text-sm max-w-[85%]"
                    style={{ backgroundColor: chatbot.widget_color }}
                  >
                    What services do you offer?
                  </div>
                  <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-700 max-w-[85%]">
                    {chatbot.services || 'Tell us about your services and products and the AI will answer here.'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Embed code</h2>
              <button onClick={copyEmbedCode} className="text-sm text-primary-600 hover:text-primary-700">
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 text-xs p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {embedCode}
            </pre>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent conversations</h2>
            <div className="space-y-3">
              {conversations.length === 0 ? (
                <p className="text-sm text-gray-500">No conversations yet.</p>
              ) : (
                conversations.map((conversation) => (
                  <div key={conversation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <p className="text-sm font-medium text-gray-900">Visitor {conversation.visitor_id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500">{conversation.message_count} messages</p>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{conversation.last_message || 'No preview available'}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
