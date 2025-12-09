import React from 'react';
import { SermonInput, GenerationStatus } from '../types';
import { Sparkles, PenTool, Users, FileText } from 'lucide-react';

interface InputFormProps {
  input: SermonInput;
  status: GenerationStatus;
  onChange: (field: keyof SermonInput, value: string) => void;
  onSubmit: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ input, status, onChange, onSubmit }) => {
  const isLoading = status === GenerationStatus.LOADING;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 sm:p-8 transition-all duration-300">
      <div className="space-y-6">
        
        {/* Language Toggle */}
        <div className="flex justify-end">
            <div className="bg-stone-100 p-1 rounded-lg inline-flex">
                <button
                    onClick={() => onChange('language', 'ko')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${input.language === 'ko' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    한국어
                </button>
                <button
                    onClick={() => onChange('language', 'en')}
                    className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${input.language === 'en' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                    English
                </button>
            </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center">
            <FileText size={16} className="mr-2" />
            {input.language === 'ko' ? '설교 본문' : 'Scripture Passage'}
          </label>
          <input
            type="text"
            value={input.passage}
            onChange={(e) => onChange('passage', e.target.value)}
            placeholder={input.language === 'ko' ? '예: 빌립보서 4:6-7' : 'e.g., Philippians 4:6-7'}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all placeholder-stone-400"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center">
            <PenTool size={16} className="mr-2" />
            {input.language === 'ko' ? '설교 주제' : 'Sermon Topic'}
          </label>
          <input
            type="text"
            value={input.topic}
            onChange={(e) => onChange('topic', e.target.value)}
            placeholder={input.language === 'ko' ? '예: 염려를 기도로 바꾸는 법' : 'e.g., Turning Anxiety into Prayer'}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all placeholder-stone-400"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center">
            <Users size={16} className="mr-2" />
            {input.language === 'ko' ? '청중' : 'Audience'}
          </label>
          <input
            type="text"
            value={input.audience}
            onChange={(e) => onChange('audience', e.target.value)}
            placeholder={input.language === 'ko' ? '예: 주일 대예배 성도' : 'e.g., Sunday Morning Congregation'}
            className="w-full px-4 py-3 rounded-lg border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-transparent outline-none transition-all placeholder-stone-400"
            disabled={isLoading}
          />
        </div>

        <button
          onClick={onSubmit}
          disabled={isLoading || !input.passage || !input.topic}
          className={`w-full py-4 rounded-lg font-bold text-white shadow-md flex items-center justify-center space-x-2 transition-all duration-200 
            ${isLoading 
              ? 'bg-stone-400 cursor-not-allowed' 
              : 'bg-stone-900 hover:bg-stone-800 hover:shadow-lg active:scale-[0.99]'
            }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{input.language === 'ko' ? '설교 노트 작성 중...' : 'Architecting Sermon...'}</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>{input.language === 'ko' ? '설교 노트 생성하기' : 'Generate Sermon Note'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
