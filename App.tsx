import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { InputForm } from './components/InputForm';
import { ResultDisplay } from './components/ResultDisplay';
import { SermonInput, GenerationStatus } from './types';
import { generateSermon } from './services/geminiService';

const App: React.FC = () => {
  const [input, setInput] = useState<SermonInput>({
    passage: '',
    topic: '',
    audience: '',
    language: 'ko', // Default to Korean
  });

  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [result, setResult] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleInputChange = (field: keyof SermonInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setStatus(GenerationStatus.LOADING);
    setResult('');
    setErrorMessage('');
    
    try {
      const generatedText = await generateSermon(input);
      
      // Check if the service returned an error string
      if (generatedText.startsWith('Error:')) {
         setErrorMessage(generatedText);
         setStatus(GenerationStatus.ERROR);
      } else {
         setResult(generatedText);
         setStatus(GenerationStatus.SUCCESS);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  return (
    <Layout>
      <div className="space-y-4 mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900">
            {input.language === 'ko' ? '설교 준비의 동반자' : 'Your Homiletic Companion'}
        </h2>
        <p className="text-stone-600 max-w-2xl mx-auto leading-relaxed">
            {input.language === 'ko' 
                ? '본문과 주제를 입력하시면, 신학적 깊이와 실천적 적용이 담긴 설교 노트를 작성해 드립니다.' 
                : 'Enter your text and topic to generate a sermon note rich in theological insight and practical application.'}
        </p>
      </div>

      <InputForm 
        input={input} 
        status={status} 
        onChange={handleInputChange} 
        onSubmit={handleSubmit} 
      />

      {status === GenerationStatus.ERROR && errorMessage && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center animate-fade-in-up">
            <p className="font-medium">{input.language === 'ko' ? '오류가 발생했습니다' : 'Error Occurred'}</p>
            <p className="text-sm mt-1">{errorMessage}</p>
        </div>
      )}

      {status === GenerationStatus.SUCCESS && result && (
        <div id="result-section">
            <ResultDisplay content={result} />
        </div>
      )}
    </Layout>
  );
};

export default App;