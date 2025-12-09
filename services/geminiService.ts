import { GoogleGenAI } from "@google/genai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

export const generateSermon = async (input: SermonInput): Promise<string> => {
  try {
    // Lazy Initialization: Initialize the client only when requested.
    // This prevents the app from crashing on startup if the API key is missing.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
        return "Error: API Key is missing. Please configure the API_KEY environment variable in Vercel settings.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    
    // Replace placeholders with user input
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // Use a model capable of complex text tasks and reasoning
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text || "Failed to generate sermon content. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide user-friendly error messages based on the error type
    if (error instanceof Error) {
        if (error.message.includes('404')) {
             return `Error: The AI model (gemini-3-pro-preview) is currently unavailable.`;
        }
        if (error.message.includes('403') || error.message.includes('API key')) {
             return `Error: Invalid or missing API Key. Please check your configuration.`;
        }
        return `Error: ${error.message}.`;
    }
    return "An unexpected error occurred while generating the sermon.";
  }
};