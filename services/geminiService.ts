import { GoogleGenerativeAI } from "@google/generative-ai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "NO_API_KEY");

export const generateSermon = async (input: SermonInput): Promise<string> => {
  if (!apiKey) {
    return "🚨 설정 오류: Vercel 환경 변수에 API 키가 없습니다.";
  }

  try {
    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // ✅ 핵심 수정: 'gemini-pro' 대신 최신 'gemini-1.5-flash' 사용
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        return `오류 발생: ${error.message}. (잠시 후 다시 시도해주세요)`;
    }
    return "생성 중 알 수 없는 오류가 발생했습니다.";
  }
};
