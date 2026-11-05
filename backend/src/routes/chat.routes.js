import express from "express";
import authMiddleware from "../middleware/auth.Middleware.js";
import {
  createChat,
  getRecentChats,
  getSingleChat,
  deleteChat,
} from "../controllers/chat.controller.js";

const chatRouter = express.Router();

chatRouter.use(authMiddleware);
chatRouter.post("/", createChat);
chatRouter.get("/", getRecentChats);
chatRouter.get("/:chatId", getSingleChat);
chatRouter.delete("/:chatId", deleteChat);

export default chatRouter;
