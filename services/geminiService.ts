import { GoogleGenerativeAI } from "@google/generative-ai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

// Vercel 환경 변수에서 API 키 가져오기
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// Gemini 클라이언트 초기화
const genAI = new GoogleGenerativeAI(apiKey || "MISSING_KEY");

export const generateSermon = async (input: SermonInput): Promise<string> => {
  if (!apiKey) {
    return "설정 오류: Vercel 환경 변수에 VITE_GOOGLE_API_KEY가 등록되지 않았습니다.";
  }

  try {
    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // ✅ 중요: 최신 모델 'gemini-1.5-flash' 사용 (404 에러 해결의 핵심!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        return `오류 발생: ${error.message}. (잠시 후 다시 시도해주세요)`;
    }
    return "설교문을 생성하는 도중 알 수 없는 오류가 발생했습니다.";
  }
};
