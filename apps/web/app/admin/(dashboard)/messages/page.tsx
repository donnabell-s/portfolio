'use client';

import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api';
import type { ContactMessage } from '@portfolio/shared';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reload() {
    api
      .adminMessages()
      .then(setMessages)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load'));
  }

  useEffect(reload, []);

  async function toggleRead(message: ContactMessage) {
    const updated = await api.markMessageRead(message.id, !message.isRead);
    setMessages((prev) => prev?.map((m) => (m.id === message.id ? updated : m)) ?? null);
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold">Messages</h1>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      {!messages ? (
        <p className="text-sm text-foreground/60">Loading…</p>
      ) : messages.length === 0 ? (
        <p className="text-sm text-foreground/60">No messages yet.</p>
      ) : (
        <ul className="divide-y divide-black/10 rounded-xl border border-black/10 dark:divide-white/10 dark:border-white/15">
          {messages.map((message) => (
            <li key={message.id} className={`p-5 ${message.isRead ? '' : 'bg-black/[0.02] dark:bg-white/[0.03]'}`}>
              <div className="mb-2 flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">
                    {message.subject}{' '}
                    {!message.isRead && (
                      <span className="ml-1 rounded-full bg-blue-500/15 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-400">
                        New
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-foreground/60">
                    {message.name} &lt;{message.email}&gt; &middot;{' '}
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => toggleRead(message)}
                  className="shrink-0 text-sm text-foreground/70 hover:text-foreground"
                >
                  Mark as {message.isRead ? 'unread' : 'read'}
                </button>
              </div>
              <p className="whitespace-pre-line text-sm text-foreground/80">{message.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
