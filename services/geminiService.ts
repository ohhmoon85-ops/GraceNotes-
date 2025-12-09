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

    // Switch to 'gemini-2.5-flash' for better speed and higher rate limits (avoids 429 Quota Exceeded)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Failed to generate sermon content. Please try again.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Provide user-friendly error messages based on the error type
    if (error instanceof Error) {
        // Handle 429 Resource Exhausted (Quota Limit)
        if (error.message.includes('429') || error.message.includes('quota')) {
            return `Error: API traffic limit exceeded. Please try again in a minute. (Model: gemini-2.5-flash)`;
        }
        if (error.message.includes('404')) {
             return `Error: The AI model is currently unavailable.`;
        }
        if (error.message.includes('403') || error.message.includes('API key')) {
             return `Error: Invalid or missing API Key. Please check your configuration in Vercel.`;
        }
        return `Error: ${error.message}`;
    }
    return "An unexpected error occurred while generating the sermon.";
  }
};