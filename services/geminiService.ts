import { GoogleGenAI } from "@google/genai";
import { SermonInput, KOREAN_PROMPT_TEMPLATE, ENGLISH_PROMPT_TEMPLATE } from "../types";

// 1. Vercel/Vite 환경에서 API Key 가져오기
const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

// 2. API Key가 제대로 있는지 확인 (디버깅용)
if (!apiKey) {
  console.error("⛔ Critical Error: VITE_GOOGLE_API_KEY is missing. Please check Vercel Environment Variables.");
}

// 3. Gemini 클라이언트 초기화
// (키가 없으면 빈 문자열을 넣지만, 아래 함수에서 에러를 뱉게 처리함)
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateSermon = async (input: SermonInput): Promise<string> => {
  // 실행 전 키 확인
  if (!apiKey) {
    return "Error: API Key is missing. Please set VITE_GOOGLE_API_KEY in Vercel settings.";
  }

  try {
    // 언어에 따른 템플릿 선택
    const template = input.language === 'ko' ? KOREAN_PROMPT_TEMPLATE : ENGLISH_PROMPT_TEMPLATE;
    
    // 프롬프트 완성
    const prompt = template
      .replace('{PASSAGE}', input.passage)
      .replace('{TOPIC}', input.topic)
      .replace('{AUDIENCE}', input.audience);

    // 4. 모델 설정 및 콘텐츠 생성
    // 참고: 'gemini-3'는 아직 사용할 수 없을 수 있습니다. 
    // 안정적이고 빠른 'gemini-2.0-flash' 또는 고성능 'gemini-1.5-pro'를 추천합니다.
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash', 
      contents: prompt,
      config: {
        // 설교문은 긴 생성이 필요할 수 있으므로 토큰 제한을 넉넉히 둡니다.
        maxOutputTokens: 2048, 
        temperature: 0.7, // 창의성과 논리성의 균형
      }
    });

    // 결과 텍스트 반환
    return response.text() || "Failed to generate sermon content. Please try again.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    
    if (error instanceof Error) {
        return `Error: ${error.message}. Please check your API key and connection.`;
    }
    return "An unexpected error occurred while generating the sermon.";
  }
};
