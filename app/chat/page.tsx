import { auth } from "@/lib/auth";
import { conversation, message } from "@/auth-schema";
import { db } from "@/db/drizzle";
import type { UIMessage } from "ai";
import { and, asc, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Conversation } from "./conversation";

type ChatPageProps = {
  searchParams: Promise<{ conversation?: string | string[] }>;
};

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const requestedConversation = (await searchParams).conversation;
  const requestedId = Array.isArray(requestedConversation)
    ? requestedConversation[0]
    : requestedConversation;
  const conversations = await db
    .select({
      id: conversation.id,
      title: conversation.title,
      updatedAt: conversation.updatedAt,
    })
    .from(conversation)
    .where(eq(conversation.userId, session.user.id))
    .orderBy(desc(conversation.updatedAt));

  const selectedConversation = requestedId
    ? conversations.find((item) => item.id === requestedId)
    : conversations[0];
  const conversationId = selectedConversation?.id ?? requestedId ?? crypto.randomUUID();

  const savedMessages = selectedConversation
    ? await db
        .select({
          id: message.id,
          role: message.role,
          parts: message.parts,
          metadata: message.metadata,
        })
        .from(message)
        .where(
          and(
            eq(message.conversationId, selectedConversation.id),
          ),
        )
        .orderBy(asc(message.createdAt))
    : [];

  const initialMessages = savedMessages.map(
    (savedMessage) =>
      ({
        id: savedMessage.id,
        role: savedMessage.role as UIMessage["role"],
        parts: savedMessage.parts as UIMessage["parts"],
        ...(savedMessage.metadata
          ? { metadata: savedMessage.metadata }
          : {}),
      }) satisfies UIMessage,
  );

  return (
    <Conversation
      userName={session.user.name || "there"}
      userEmail={session.user.email}
      conversationId={conversationId}
      conversations={conversations.map((item) => ({
        ...item,
        updatedAt: item.updatedAt.toISOString(),
      }))}
      initialMessages={initialMessages}
    />
  );
}
