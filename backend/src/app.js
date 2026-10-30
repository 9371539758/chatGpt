import express from "express";
// import { env } from "./config/env.js";
const app = express();
app.use(express.json());
// auth routes
import authRouter from "./routes/auth.routes.js";
app.use("/api/auth",authRouter);
export default app;