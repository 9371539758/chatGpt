import bcrypt from "bcryptjs";
import User from "../model/user.model.js";;
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const SALT_ROUNDS = 12;

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await User.exists({ email });

  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      const duplicateError = new Error(
        "An account with this email already exists."
      );

      duplicateError.statusCode = 409;
      duplicateError.code = "EMAIL_ALREADY_EXISTS";

      throw duplicateError;
    }

    throw error;
  }
};
// login user


export const loginUser = async ({ identifier, password }) => {
  // 1. Find the user by email or name
  const value = identifier.trim();

  const user = await User.findOne({
    $or: [
      { email: value.toLowerCase() },
      { name: value },
    ],
  }).select("+password");

  // 2. Verify the account and password
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error("Invalid email/name or password.");
    error.statusCode = 401;
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  // 3. Generate JWT only after successful authentication
  const token = jwt.sign(
    { sub: user._id.toString() },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  // 4. Return the token and safe user information
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};