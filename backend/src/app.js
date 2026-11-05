import express from "express";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// auth routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/auth",authRouter);

// chat routes
import chatRouter from "./routes/chat.routes.js";
app.use("/api/chats", chatRouter);

// message routres
import messageRouter from "./routes/message.routes.js";
app.use("/api/messages",messageRouter);

export default app;