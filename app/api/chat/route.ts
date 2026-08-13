import { openai } from "@ai-sdk/openai";
import { streamText, UIMessage, convertToModelMessages, tool  } from "ai";
import { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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

            const temperature = Math.round(
              Math.random() * (90 - 32) + 32
            );

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

    return result.toUIMessageStreamResponse();
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