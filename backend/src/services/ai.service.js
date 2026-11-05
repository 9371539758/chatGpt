import client from "../config/openRouter.js";
import { env } from "../config/env.js";

export const generateAIResponse = async ({ model, messages }) => {
  const groqKey = env.OPENAI_API_KEY?.trim();
  const openRouterKey = env.OPENROUTER_API_KEY?.trim();
  const apiKey = groqKey || openRouterKey;

  if (!apiKey || apiKey.startsWith("replace_with_")) {
    throw new Error("OPENAI_API_KEY or OPENROUTER_API_KEY is missing");
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Conversation messages are required");
  }

  const response = await client.chat.completions.create({
    model: model || env.OPENROUTER_MODEL,
    messages,
  });

  const aiReply = response.choices?.[0]?.message?.content;

  if (!aiReply) {
    throw new Error("AI returned an empty response");
  }

  return {
    aiReply,
    usage: response.usage || {},
  };
};
