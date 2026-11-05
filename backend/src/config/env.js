import dotenv from 'dotenv';
dotenv.config();
export const env = {
    port:process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    NODE_ENV: process.env.NODE_ENV || "development",
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
    OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b",
}
