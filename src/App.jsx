import React, { useState, useRef } from 'react';
import { generateStudyMaterial } from './lib/api.js';
import PromptInput from './components/PromptInput.jsx';
import FlashcardDeck from './components/FlashcardDeck.jsx';
import QuizView from './components/QuizView.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import { Sparkles, Layers, HelpCircle, RotateCcw, Zap, Github, BookOpen } from 'lucide-react';

export default function App() {
  const [studyData, setStudyData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('flashcards'); // 'flashcards' | 'quiz'
  const [lastPrompt, setLastPrompt] = useState('');

  // Race condition guard: tracks latest request ID atomically
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);

  const handleGenerate = async (promptText) => {
    setLastPrompt(promptText);
    setIsLoading(true);
    setError(null);

    // Cancel any ongoing network request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Increment request ID counter for stale guard check
    const currentRequestId = ++requestIdRef.current;

    try {
      const data = await generateStudyMaterial(promptText, abortControllerRef.current.signal);

      // Race Condition Guard: Ignore response if a newer request was dispatched
      if (currentRequestId !== requestIdRef.current) {
        console.log(`[Stale Request Guard] Ignored outdated response from request #${currentRequestId}`);
        return;
      }

      setStudyData(data);
      setActiveTab('flashcards');
    } catch (err) {
      if (currentRequestId !== requestIdRef.current) {
        return; // Ignore errors from superseded requests
      }
      console.error('Error generating study material:', err);
      setError(err.message || 'Failed to generate study materials.');
    } finally {
      if (currentRequestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  const handleRetry = () => {
    if (lastPrompt) {
      handleGenerate(lastPrompt);
    } else {
      setError(null);
    }
  };

  const handleNewStudyKit = () => {
    setStudyData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div
            onClick={handleNewStudyKit}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-100 group-hover:text-indigo-400 transition-colors">
                MindSpark <span className="text-indigo-400 font-extrabold">AI</span>
              </span>
              <span className="block text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                Study Assistant
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {studyData && !isLoading && (
              <button
                onClick={handleNewStudyKit}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 hover:bg-indigo-900 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                New Topic
              </button>
            )}

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Proxy Ready
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Loading State */}
        {isLoading && <LoadingState />}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorState error={error} onRetry={handleRetry} />
        )}

        {/* Prompt Input (Initial view) */}
        {!isLoading && !error && !studyData && (
          <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
        )}

        {/* Generated Study Assistant View (Tabs for Flashcards vs Quiz) */}
        {!isLoading && !error && studyData && (
          <div className="space-y-8 animate-fadeIn">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-center">
              <div className="glass-card p-1.5 rounded-2xl border border-slate-800 flex items-center gap-2 max-w-md w-full">
                <button
                  onClick={() => setActiveTab('flashcards')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'flashcards'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Flashcards ({studyData.flashcards?.length || 0})
                </button>

                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Quiz ({studyData.quiz?.length || 0})
                </button>
              </div>
            </div>

            {/* Active Tab Component */}
            {activeTab === 'flashcards' ? (
              <FlashcardDeck
                cards={studyData.flashcards}
                topic={studyData.topic}
              />
            ) : (
              <QuizView
                questions={studyData.quiz}
                topic={studyData.topic}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Flam Frontend Internship Assignment</span>
          </div>

          <div className="text-slate-400 font-mono text-[11px]">
            React • Express Proxy • Gemini API • Defensive JSON Validation
          </div>
        </div>
      </footer>
    </div>
  );
}
