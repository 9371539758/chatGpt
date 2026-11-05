import Chat from "../models/chatSchema.js";
import Message from "../models/messageSchema.js";
import { generateAIResponse } from "../services/openRouterService.js";

const SYSTEM_PROMPT = `
You are a helpful coding teacher.
Explain concepts in simple language.
Do not overcomplicate.
Use examples when needed.
`;

const SUMMARY_CHUNK_SIZE = 20;

const buildMessagesForAI = ({ chat, recentMessages, currentMessage }) => {
  const messages = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
  ];

  if (chat.summary && chat.summary.trim() !== "") {
    messages.push({
      role: "system",
      content: `Previous conversation summary: ${chat.summary}`,
    });
  }

  for (const msg of recentMessages) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  messages.push({
    role: "user",
    content: currentMessage,
  });

  return messages;
};