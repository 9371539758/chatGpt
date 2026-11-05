import OpenAI from "openai";
import { env } from "./env.js";

const groqKey = env.OPENAI_API_KEY?.trim();
const openRouterKey = env.OPENROUTER_API_KEY?.trim();
const configuredGroqKey = groqKey || (openRouterKey?.startsWith("gsk_") ? openRouterKey : "");
const configuredOpenRouterKey =
  !configuredGroqKey && openRouterKey && !openRouterKey.startsWith("replace_with_")
    ? openRouterKey
    : "";

if (!configuredGroqKey && !configuredOpenRouterKey) {
  throw new Error("OPENAI_API_KEY or OPENROUTER_API_KEY is missing");
}

const aiClient = new OpenAI({
  apiKey: configuredGroqKey || configuredOpenRouterKey,
  baseURL: configuredGroqKey
    ? process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1"
    : process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1",
});

export default aiClient;
