import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/chat");
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-slate-950 px-6 py-16 text-white">
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/25 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />

      <section className="relative z-10 mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl shadow-xl shadow-blue-950/40">
          ✦
        </div>
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-blue-300">
          AI Chat Assistant
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Your conversations, saved and ready.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
          Sign in to continue your conversations, or create an account to start
          chatting with the assistant.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/signin"
            className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-xl border border-slate-600 bg-white/5 px-7 py-3 font-semibold text-white backdrop-blur transition hover:border-slate-400 hover:bg-white/10"
          >
            Create Account
          </Link>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          An account is required before starting a chat.
        </p>
      </section>
    </main>
  );
}
