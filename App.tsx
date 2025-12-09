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

  const handleInputChange = (field: keyof SermonInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setStatus(GenerationStatus.LOADING);
    setResult('');
    
    try {
      const generatedText = await generateSermon(input);
      setResult(generatedText);
      setStatus(GenerationStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setResult("An error occurred. Please check your connection and try again.");
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

      {result && (
        <div id="result-section">
            <ResultDisplay content={result} />
        </div>
      )}
    </Layout>
  );
};

export default App;
