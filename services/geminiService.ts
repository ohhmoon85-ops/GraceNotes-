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
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 }, // Enable thinking for better structure and connections
      }
    });

    return response.text || "Failed to generate sermon content. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}. Please check your API key and connection.`;
    }
    return "An unexpected error occurred while generating the sermon.";
  }
};
