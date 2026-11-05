import express from "express";
import {
  getMessages,
  sendMessage
} from "../controllers/chat.controller.js";

import authMiddleware from "../middleware/auth.Middleware.js";

const messageRouter = express.Router();

messageRouter.use(authMiddleware);

messageRouter.get("/:chatId", getMessages);
messageRouter.post("/", sendMessage);
messageRouter.post("/:chatId", sendMessage);

export default messageRouter;