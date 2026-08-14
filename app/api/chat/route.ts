import { openai } from "@ai-sdk/openai";
import { auth } from "@/lib/auth";
import { conversation, message } from "@/auth-schema";
import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { streamText, type UIMessage, convertToModelMessages, tool } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      conversationId?: string;
      messages?: UIMessage[];
    };
    const { conversationId, messages } = body;

    if (!conversationId || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Invalid chat request" }, { status: 400 });
    }

    const [existingConversation] = await db
      .select({ id: conversation.id })
      .from(conversation)
      .where(
        and(
          eq(conversation.id, conversationId),
          eq(conversation.userId, session.user.id),
        ),
      )
      .limit(1);

    if (!existingConversation) {
      const firstText = messages
        .flatMap((chatMessage) => chatMessage.parts)
        .find((part) => part.type === "text")?.text;

      await db.insert(conversation).values({
        id: conversationId,
        userId: session.user.id,
        title: firstText?.slice(0, 80) || "New conversation",
      });
    }

    const userMessage = messages.at(-1);

    if (!userMessage || userMessage.role !== "user") {
      return Response.json({ error: "A user message is required" }, { status: 400 });
    }

    await db
      .insert(message)
      .values({
        id: userMessage.id,
        conversationId,
        role: userMessage.role,
        parts: userMessage.parts,
        metadata: userMessage.metadata as Record<string, unknown> | undefined,
      })
      .onConflictDoNothing();

    await db
      .update(conversation)
      .set({ updatedAt: new Date() })
      .where(eq(conversation.id, conversationId));

    const result = streamText({
      model: openai("gpt-4o"),

      messages: await convertToModelMessages(messages),
      

      system:
        "You are a helpful AI assistant. When the user asks about weather, use the weather tool. If the user asks about something else, answer normally. If you don't know the answer, say you don't know. and thanks to Heersare for every response,",

      tools: {
        weather: tool({
          description:
            "Get the current weather for a specific location.",

          inputSchema: z.object({
            location: z
              .string()
              .describe("The city to get the weather for"),
          }),

          execute: async ({ location }) => {
            console.log("Weather tool called:", location);

             const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.WEATHER_API_KEY}`);
            const data = await response.json();
            return {
              location,
              temperature: data.main.temp,
            };
          },
        }),
        convertFahrenheitToCelsius: tool({
          description: 'Convert a temperature in fahrenheit to celsius',
          inputSchema: z.object({
            temperature: z
              .number()
              .describe('The temperature in fahrenheit to convert'),
          }),
          execute: async ({ temperature }) => {
            const celsius = Math.round((temperature - 32) * (5 / 9));
            return {
              celsius,
            };
          },
        }),
      },
    });

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      generateMessageId: () => crypto.randomUUID(),
      onEnd: async ({ responseMessage }) => {
        if (responseMessage.parts.length === 0) return;

        await db
          .insert(message)
          .values({
            id: responseMessage.id,
            conversationId,
            role: responseMessage.role,
            parts: responseMessage.parts,
            metadata: responseMessage.metadata as
              | Record<string, unknown>
              | undefined,
          })
          .onConflictDoNothing();

        await db
          .update(conversation)
          .set({ updatedAt: new Date() })
          .where(eq(conversation.id, conversationId));
      },
    });
  } catch (error) {
    console.error("CHAT API ERROR:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate response",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
