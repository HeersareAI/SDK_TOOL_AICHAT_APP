"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export type ConversationSummary = {
  id: string;
  title: string;
  updatedAt: string;
};

const conversationDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});

type ChatSidebarProps = {
  conversations: ConversationSummary[];
  currentConversationId: string;
  user: {
    name: string;
    email: string;
  };
  mobileOpen: boolean;
  onClose: () => void;
};

export function ChatSidebar({
  conversations,
  currentConversationId,
  user,
  mobileOpen,
  onClose,
}: ChatSidebarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return conversations;

    return conversations.filter((item) =>
      item.title.toLowerCase().includes(normalizedQuery),
    );
  }, [conversations, query]);

  const createNewChat = () => {
    onClose();
    router.push(`/chat?conversation=${crypto.randomUUID()}`);
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-slate-950/40 md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-100 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-slate-800 p-4">
          <div className="mb-4 flex items-center justify-between">
            <Link href="/chat" className="text-lg font-semibold" onClick={onClose}>
              AI Chat
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="Close sidebar"
            >
              <CloseIcon />
            </button>
          </div>

          <button
            type="button"
            onClick={createNewChat}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
          >
            <PlusIcon />
            New chat
          </button>

          <label className="relative mt-3 block">
            <span className="sr-only">Search chats</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500">
              <SearchIcon />
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search chats"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </label>
        </div>

        <nav className="flex-1 overflow-y-auto p-3" aria-label="Conversations">
          <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Conversations
          </p>
          <div className="space-y-1">
            {filteredConversations.map((item) => {
              const active = item.id === currentConversationId;

              return (
                <Link
                  key={item.id}
                  href={`/chat?conversation=${encodeURIComponent(item.id)}`}
                  onClick={onClose}
                  className={`block rounded-xl px-3 py-2.5 transition ${
                    active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-900"
                  }`}
                >
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {conversationDateFormatter.format(new Date(item.updatedAt))}
                  </p>
                </Link>
              );
            })}
            {filteredConversations.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-slate-500">
                No chats found.
              </p>
            )}
          </div>
        </nav>

        <div className="border-t border-slate-800 p-3">
          <Link
            href="/"
            onClick={onClose}
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-900 hover:text-white"
          >
            <HomeIcon />
            Home
          </Link>
          <Link
            href="/user"
            onClick={onClose}
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-900"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{user.name}</span>
              <span className="block truncate text-xs text-slate-500">{user.email}</span>
            </span>
          </Link>
          <div className="mt-1 grid grid-cols-2 gap-1">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 text-center text-xs text-slate-400 hover:bg-slate-900 hover:text-white">
              Dashboard
            </Link>
            <form action="/signout" method="post">
              <button type="submit" className="w-full rounded-lg px-3 py-2 text-center text-xs text-slate-400 hover:bg-slate-900 hover:text-white">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

function PlusIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m20 20-4-4" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true"><path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" /></svg>;
}

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.75 10.5 8.25-7 8.25 7v9a1.25 1.25 0 0 1-1.25 1.25H5a1.25 1.25 0 0 1-1.25-1.25v-9Z"
      />
      <path strokeLinecap="round" d="M9 20.75v-6.5h6v6.5" />
    </svg>
  );
}
