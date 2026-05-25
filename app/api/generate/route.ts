import { NextRequest } from "next/server";
import OpenAI from "openai";
import {
  PRE_FEEDBACK_PROMPTS,
  POST_FEEDBACK_PROMPTS,
  type PromptContext,
} from "@/lib/prompts";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { phase, stepIndex, context } = body as {
    phase: "pre" | "post";
    stepIndex: number;
    context: PromptContext;
  };

  const prompts = phase === "pre" ? PRE_FEEDBACK_PROMPTS : POST_FEEDBACK_PROMPTS;
  const promptFn = prompts[stepIndex];

  if (!promptFn) {
    return new Response(JSON.stringify({ error: "Invalid step" }), { status: 400 });
  }

  const promptText = promptFn(context);

  let stream;
  try {
    stream = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: promptText }],
      stream: true,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "OpenAI request failed";
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
