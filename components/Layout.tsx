import React, { ReactNode } from 'react';
import { BookOpen } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-stone-50 text-stone-900 font-sans selection:bg-stone-200 selection:text-stone-900">
      <header className="w-full bg-white border-b border-stone-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-stone-900 text-white p-1.5 rounded-md">
              <BookOpen size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">GraceNotes</h1>
          </div>
          <div className="text-xs font-medium text-stone-500 uppercase tracking-widest hidden sm:block">
            AI Sermon Architect
          </div>
        </div>
      </header>
      
      <main className="w-full max-w-4xl px-4 py-8 flex-grow">
        {children}
      </main>

      <footer className="w-full bg-stone-100 border-t border-stone-200 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center text-stone-500 text-sm">
          <p>© {new Date().getFullYear()} GraceNotes. Empowering ministry with technology.</p>
        </div>
      </footer>
    </div>
  );
};
