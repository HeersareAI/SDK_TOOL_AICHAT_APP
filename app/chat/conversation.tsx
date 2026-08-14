"use client";

import { useChat } from "@ai-sdk/react";
import {
  convertFileListToFileUIParts,
  DefaultChatTransport,
  type FileUIPart,
  type UIMessage,
} from "ai";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ChatSidebar, type ConversationSummary } from "./chat-sidebar";
import { ChatMessage } from "./message";

type ConversationProps = {
  userName: string;
  userEmail: string;
  conversationId: string;
  conversations: ConversationSummary[];
  initialMessages: UIMessage[];
};

export function Conversation({
  userName,
  userEmail,
  conversationId,
  conversations,
  initialMessages,
}: ConversationProps) {
  const [input, setInput] = useState("");
  const [image, setImage] = useState<FileUIPart | null>(null);
  const [attachmentError, setAttachmentError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { conversationId },
      }),
    [conversationId],
  );
  const { messages, sendMessage, status, error, stop, clearError } = useChat({
    id: conversationId,
    messages: initialMessages,
    transport,
  });
  const endRef = useRef<HTMLDivElement>(null);
  const isWorking = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = input.trim();

    if ((!text && !image) || isWorking) return;

    clearError();
    void sendMessage({ text, ...(image ? { files: [image] } : {}) });
    setInput("");
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setAttachmentError("");

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAttachmentError("Only image files are allowed.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAttachmentError("The image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    const [filePart] = await convertFileListToFileUIParts(
      event.target.files ?? undefined,
    );
    setImage(filePart);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-950">
      <ChatSidebar
        conversations={conversations}
        currentConversationId={conversationId}
        user={{ name: userName, email: userEmail }}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-300 p-2 hover:bg-slate-50 md:hidden"
              aria-label="Open sidebar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <div>
            <h1 className="text-xl font-semibold">AI Chat</h1>
            <p className="text-sm text-slate-500">Welcome back, {userName}.</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4">
        <div className="flex-1 space-y-5 overflow-y-auto py-8" aria-live="polite">
          {messages.length === 0 ? (
            <div className="mx-auto mt-24 max-w-lg text-center">
              <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-blue-600 text-2xl text-white">
                ✦
              </div>
              <h2 className="text-2xl font-semibold">How can I help?</h2>
              <p className="mt-2 text-slate-500">
                Start a conversation, ask a question, or check the weather.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isAnimating={status === "streaming"}
              />
            ))
          )}

          {status === "submitted" && (
            <p className="text-sm text-slate-500">Assistant is thinking…</p>
          )}
          <div ref={endRef} />
        </div>

        {error && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error.message || "The message could not be sent."}
          </div>
        )}

        {attachmentError && (
          <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {attachmentError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="sticky bottom-0 bg-slate-50 pb-6 pt-3">
          {image && (
            <div className="mb-2 inline-flex items-start gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
              <Image
                src={image.url}
                alt={image.filename || "Image attachment"}
                width={72}
                height={72}
                unoptimized
                className="h-16 w-16 rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="grid h-6 w-6 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 shadow-sm focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isWorking}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
              aria-label="Add image"
              title="Add image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.2 7.8-6.9 6.9a2.1 2.1 0 0 0 3 3l7.6-7.6a4 4 0 0 0-5.7-5.7L5.6 12a5.8 5.8 0 0 0 8.2 8.2l6.5-6.5" />
              </svg>
            </button>
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder="Message the assistant…"
              className="max-h-40 min-h-11 flex-1 resize-none bg-transparent px-3 py-2.5 outline-none"
              aria-label="Chat message"
            />
            {isWorking ? (
              <button
                type="button"
                onClick={stop}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() && !image}
                className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-slate-400">
            AI can make mistakes. Check important information.
          </p>
        </form>
      </section>
      </main>
    </div>
  );
}
