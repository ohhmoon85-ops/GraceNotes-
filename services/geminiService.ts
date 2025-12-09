import { GoogleGenerativeAI } from "@google/generative-ai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

// 1. Vercel 환경에서 API Key 안전하게 가져오기 (Vite 전용 명령어)
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// 2. Gemini 클라이언트 초기화 (키가 없으면 빈 문자열을 넣어 충돌 방지)
const genAI = new GoogleGenerativeAI(apiKey || "MISSING_KEY");

export const generateSermon = async (input: SermonInput): Promise<string> => {
  // 실행 시점에 키가 진짜로 있는지 확인
  if (!apiKey) {
    console.error("⛔ API KEY ERROR: VITE_GOOGLE_API_KEY가 없습니다.");
    return "설정 오류: Vercel 환경변수에 API 키가 등록되지 않았습니다.";
  }

  try {
    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // 3. 모델 설정 (gemini-pro 사용)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error) {
        return `오류 발생: ${error.message}. API 키를 확인해주세요.`;
    }
    return "설교문을 생성하는 도중 알 수 없는 오류가 발생했습니다.";
  }
};
