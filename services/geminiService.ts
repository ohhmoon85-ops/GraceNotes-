import { GoogleGenAI } from "@google/genai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

// Initialize the Gemini Client
// Note: process.env.API_KEY will be injected by the build tool (Vite/Next.js) from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSermon = async (input: SermonInput): Promise<string> => {
  try {
    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    
    // Replace placeholders with user input
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // Use a model capable of complex text tasks and reasoning
    // Explicitly using gemini-3-pro-preview as per the latest guidelines
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      // Removed thinkingConfig to rely on model defaults for better stability
    });

    return response.text || "Failed to generate sermon content. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide user-friendly error messages based on the error type
    if (error instanceof Error) {
        if (error.message.includes('404')) {
             return `Error: The AI model (gemini-3-pro-preview) is currently unavailable or not found. Please try again later.`;
        }
        if (error.message.includes('403') || error.message.includes('API key')) {
             return `Error: Invalid or missing API Key. Please check your configuration.`;
        }
        return `Error: ${error.message}. Please check your connection.`;
    }
    return "An unexpected error occurred while generating the sermon.";
  }
};