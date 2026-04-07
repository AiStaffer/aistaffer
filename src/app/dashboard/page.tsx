'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Chatbot, DashboardStats } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_conversations: 0,
    messages_today: 0,
    active_chatbots: 0,
  });
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [chatbotsRes, statsRes] = await Promise.all([
        fetch('/api/chatbots'),
        fetch('/api/stats'),
      ]);
      if (chatbotsRes.ok) {
        const data = await chatbotsRes.json();
        setChatbots(data.chatbots);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleCreateChatbot = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Chatbot' }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/dashboard/chatbot/${data.chatbot.id}`);
      }
    } catch (err) {
      console.error('Failed to create chatbot:', err);
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
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
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-gray-900">AIStaffer</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Active Chatbots</p>
            <p className="text-3xl font-bold text-gray-900">{stats.active_chatbots}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Conversations</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total_conversations}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Messages Today</p>
            <p className="text-3xl font-bold text-gray-900">{stats.messages_today}</p>
          </div>
        </div>

        {/* Chatbots header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Chatbots</h1>
          <button
            onClick={handleCreateChatbot}
            disabled={creating}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {creating ? 'Creating...' : '+ New Chatbot'}
          </button>
        </div>

        {/* Chatbot cards */}
        {chatbots.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No chatbots yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first chatbot to start handling customer enquiries automatically.
            </p>
            <button
              onClick={handleCreateChatbot}
              disabled={creating}
              className="bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Your First Chatbot'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot) => (
              <Link
                key={chatbot.id}
                href={`/dashboard/chatbot/${chatbot.id}`}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{chatbot.name}</h3>
                    <p className="text-sm text-gray-500">{chatbot.business_name || 'No business set'}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      chatbot.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {chatbot.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created {formatDate(chatbot.created_at)}</span>
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: chatbot.widget_color }}
                  ></div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
