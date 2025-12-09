import { GoogleGenerativeAI } from "@google/generative-ai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

// 1. Vercel 환경 변수 가져오기
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// 2. 중요: 키가 없어도 앱이 '흰 화면'으로 죽지 않도록 임시 값을 넣습니다.
const genAI = new GoogleGenerativeAI(apiKey || "NO_API_KEY");

export const generateSermon = async (input: SermonInput): Promise<string> => {
  // 실제 실행 버튼을 눌렀을 때 키를 검사합니다.
  if (!apiKey) {
    return "🚨 설정 오류: Vercel 환경 변수에 VITE_GOOGLE_API_KEY가 등록되지 않았습니다. (설정을 확인해주세요)";
  }

  try {
    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // 3. 최신 모델 사용 (404 에러 해결)
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
