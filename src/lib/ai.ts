import { createOpenAI } from "@ai-sdk/openai";

export const deepseek = createOpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY,
  name: "deepseek",
});
