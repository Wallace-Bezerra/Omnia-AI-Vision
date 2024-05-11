import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

export const genAI = new GoogleGenerativeAI(API_KEY);
