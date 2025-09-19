import OpenAI from "openai";
import type { AppConfig } from "./ai.config.js";

export function openaiClient(cfg: AppConfig) {
  return new OpenAI({ apiKey: cfg.openaiApiKey });
}

export type ToolCall = {
  name: string;
  arguments: Record<string, unknown>;
};

/**
 * Ask OpenAI to analyze context and decide on next tool calls.
 * Optional: register MCP tools if configured.
 */
export async function planWithLLM(opts: {
  cfg: AppConfig;
  systemPrompt: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  tools?: any[];
}) {
  const { cfg, systemPrompt, messages, tools = [] } = opts;
  const openai = openaiClient(cfg);

  const response = await openai.responses.create({
    model: "gpt-5-reasoning", // pick your model
    reasoning: { effort: "medium" },
    system: systemPrompt,
    input: messages.map((m) => ({ role: m.role, content: m.content })),
    tools,
  });

  return response;
}
