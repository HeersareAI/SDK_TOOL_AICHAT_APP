import type { UIMessage } from "ai";
import Image from "next/image";
import { code } from "@streamdown/code";
import { cjk } from "@streamdown/cjk";
import { math } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";
import { Streamdown } from "streamdown";

type ChatMessageProps = {
  message: UIMessage;
  isAnimating: boolean;
};

const plugins = { code, mermaid, math, cjk };

export function ChatMessage({ message, isAnimating }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <article
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-sm ${
          isUser
            ? "bg-slate-800 text-white"
            : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
        }`}
        aria-label={isUser ? "User" : "AI assistant"}
      >
        {isUser ? <UserIcon /> : <AssistantIcon />}
      </div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] ${
          isUser
            ? "rounded-br-md bg-blue-600 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <p className={`mb-1 text-xs font-semibold ${isUser ? "text-blue-100" : "text-slate-400"}`}>
          {isUser ? "You" : "Assistant"}
        </p>

        <div className="space-y-2">
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              if (!isUser) {
                return (
                  <Streamdown
                    key={`${message.id}-${index}`}
                    plugins={plugins}
                    animated
                    isAnimating={isAnimating}
                    className="break-words"
                  >
                    {part.text}
                  </Streamdown>
                );
              }

              return (
                <p key={`${message.id}-${index}`} className="whitespace-pre-wrap break-words">
                  {part.text}
                </p>
              );
            }

            if (part.type === "file" && part.mediaType.startsWith("image/")) {
              return (
                <Image
                  key={`${message.id}-${index}`}
                  src={part.url}
                  alt={part.filename || "Attached image"}
                  width={640}
                  height={480}
                  unoptimized
                  className="max-h-96 w-auto max-w-full rounded-xl object-contain"
                />
              );
            }

            if (part.type.startsWith("tool-") || part.type === "dynamic-tool") {
              return (
                <div
                  key={`${message.id}-${index}`}
                  className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600"
                >
                  Tool result received
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </article>
  );
}

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20.1a7.5 7.5 0 0 1 15 0A17.9 17.9 0 0 1 12 21.75 17.9 17.9 0 0 1 4.5 20.1Z" />
    </svg>
  );
}

function AssistantIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75 13.45 8a4 4 0 0 0 2.55 2.55L20.25 12 16 13.45A4 4 0 0 0 13.45 16L12 20.25 10.55 16A4 4 0 0 0 8 13.45L3.75 12 8 10.55A4 4 0 0 0 10.55 8L12 3.75Z" />
    </svg>
  );
}
