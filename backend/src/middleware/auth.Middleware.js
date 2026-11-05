import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { env } from "../config/env.js";

const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;
    const token = bearerToken || cookieToken;

    if (!token) {
      return res.status(401).json({
        message: "Please login first"
      });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);

    const user = await User.findById(payload.sub || payload.id);

    if (!user) {
      return res.status(401).json({
        message: "User no longer exists"
      });
    }

    req.user = user;

    next();

  } catch (err) {
    res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};



export default authMiddleware;