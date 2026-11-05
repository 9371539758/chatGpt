import Chat from "../model/conversations/chat.model.js";
import Message from "../model/conversations/message.model.js";
import { generateAIResponse } from "../services/ai.service.js";

export const createChat = async (req, res) => {
  try {
    const { model } = req.body;

    if (!model) {
      return res.status(400).json({
        message: "Model is required"
      });
    }

    const chat = await Chat.create({
      userId: req.user._id,
      model,
      topic: "New Chat"
    });

    res.status(201).json({
      message: "Chat created successfully",
      chat: {
        id: chat._id,
        topic: chat.topic,
        model: chat.model,
        createdAt: chat.createdAt
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getRecentChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      userId: req.user._id
    })
      .select("topic model messageCount usage updatedAt createdAt")
      .sort({ updatedAt: -1 })
      .limit(20);

    res.status(200).json({
      message: "Recent chats fetched successfully",
      chats
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getSingleChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found"
      });
    }

    res.status(200).json({
      message: "Chat fetched successfully",
      chat
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({
      _id: chatId,
      userId: req.user._id
    });

    if (!chat) {
      return res.status(404).json({
        message: "Chat not found"
      });
    }

    await Message.deleteMany({
      chatId: chat._id
    });

    await Chat.deleteOne({
      _id: chat._id
    });

    res.status(200).json({
      message: "Chat deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.findOne({
      _id: req.params.chatId,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const messages = await Message.find({
      chatId: chat._id,
      userId: req.user._id,
    }).sort({ createdAt: 1 });

    return res.status(200).json({ messages });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, model } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Message content is required" });
    }

    let chat;

    if (chatId) {
      chat = await Chat.findOne({
        _id: chatId,
        userId: req.user._id,
      });

      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
    } else {
      if (!model) {
        return res.status(400).json({ message: "Model is required for new chat" });
      }

      chat = await Chat.create({
        userId: req.user._id,
        model,
        topic: content.trim().slice(0, 40),
      });
    }

    const recentMessages = await Message.find({
      chatId: chat._id,
      userId: req.user._id,
    }).sort({ createdAt: 1 }).limit(20);

    const messagesForAI = [
      {
        role: "system",
        content: "You are a helpful coding teacher. Explain clearly and keep answers simple.",
      },
      ...recentMessages.map((message) => ({
        role: message.role,
        content: message.content,
      })),
      {
        role: "user",
        content: content.trim(),
      },
    ];

    const { aiReply, usage } = await generateAIResponse({
      model: chat.model,
      messages: messagesForAI,
    });
    const promptTokens = usage.prompt_tokens || usage.promptTokens || 0;
    const completionTokens = usage.completion_tokens || usage.completionTokens || 0;
    const totalTokens = usage.total_tokens || usage.totalTokens || 0;

    const userMessage = await Message.create({
      chatId: chat._id,
      userId: req.user._id,
      role: "user",
      content: content.trim(),
    });

    const assistantMessage = await Message.create({
      chatId: chat._id,
      userId: req.user._id,
      role: "assistant",
      content: aiReply,
    });

    chat.messageCount += 2;
    if (chat.topic === "New Chat") {
      chat.topic = content.trim().slice(0, 40);
    }
    await chat.save();

    res.status(201).json({
      message: "Message sent successfully",
      chatId: chat._id,
      reply: aiReply,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
      },
      userMessage,
      assistantMessage,
    });
  } catch (err) {
    console.log(err);
    const status = Number.isInteger(err.status) ? err.status : 500;
    const providerMessage =
      err.error?.message || err.message || "AI request failed";

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      message: providerMessage,
    });
  }
};