"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  fromAgent: boolean;
  content: string;
  createdAt: string;
};

export function MessagesSection({ initial }: { initial: Message[] }) {
  const [messages, setMessages] = useState(initial);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text) return;
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/members/client-services/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to send message.");
        return;
      }
      setMessages((prev) => [...prev, data.message]);
      setContent("");
    } catch {
      setError("Failed to send message.");
    } finally {
      setSending(false);
    }
  }

  function fmt(iso: string) {
    return new Date(iso).toLocaleDateString("en-CA", {
      month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-[var(--surface-elevated)] shadow-[0_4px_24px_rgba(0,0,0,0.08)]">
      {/* Message list */}
      <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-[var(--muted)]">
            No messages yet. Send your agent a message below.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.fromAgent ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.fromAgent
                    ? "bg-white/[0.06] text-[var(--foreground)]"
                    : "bg-[var(--accent)] text-white"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                <p className={`mt-1 text-[10px] ${m.fromAgent ? "text-[var(--muted)]" : "text-white/60"}`}>
                  {m.fromAgent ? "Agent" : "You"} · {fmt(m.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="border-t border-white/[0.06] p-3">
        {error && <p className="mb-2 text-xs text-red-400">{error}</p>}
        <form onSubmit={send} className="flex items-end gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(e as unknown as React.FormEvent);
              }
            }}
            placeholder="Message your agent… (Enter to send)"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-white/[0.12] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--muted)]/60 outline-none transition focus:border-[var(--accent)]/50 focus:ring-1 focus:ring-[var(--accent)]/20"
          />
          <button
            type="submit"
            disabled={sending || !content.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)] text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40"
            aria-label="Send message"
          >
            <svg className="h-4 w-4 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
