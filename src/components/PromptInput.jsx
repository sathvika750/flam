import React, { useState } from 'react';
import { Sparkles, Trash2, ArrowRight, Lightbulb, BookOpen } from 'lucide-react';

const SAMPLE_PROMPTS = [
  {
    title: '🌿 Photosynthesis & Cell Energy',
    text: 'Photosynthesis is the process used by plants and other organisms to convert light energy into chemical energy. Light-dependent reactions happen in the thylakoid membrane producing ATP and NADPH, while the Calvin Cycle occurs in the stroma using carbon dioxide to produce glucose. Chlorophyll is the primary green pigment that absorbs solar light energy.'
  },
  {
    title: '⚡ JS Async/Await & Promises',
    text: 'Asynchronous JavaScript relies on the Event Loop, Promises, and Async/Await syntax. A Promise represents an eventual completion or failure of an asynchronous operation with states: Pending, Fulfilled, or Rejected. Async/await is syntactic sugar on top of Promises that makes asynchronous code look and behave like synchronous code, using try/catch blocks for error handling.'
  },
  {
    title: '⚛️ Quantum Computing Basics',
    text: 'Quantum computing uses principles of quantum mechanics like superposition and entanglement. Classical bits store 0 or 1, while qubits can exist in a superposition of both states simultaneously. Entanglement allows qubits to be correlated instantaneously regardless of distance, enabling massive parallel processing speedups for specific algorithms like Shor\'s and Grover\'s.'
  },
  {
    title: '🌍 World War II Causes & Impact',
    text: 'World War II (1939-1945) was sparked by Nazi Germany\'s invasion of Poland, unresolved tensions from the Treaty of Versailles, and aggressive expansionism by Axis powers. Major events include the Battle of Stalingrad, D-Day invasion, and atomic bombs on Hiroshima and Nagasaki. The war reshaped global geopolitics, creating the United Nations and launching the Cold War era.'
  }
];

export default function PromptInput({ onGenerate, isLoading }) {
  const [text, setText] = useState('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onGenerate(text);
    }
  };

  const handleSampleClick = (sampleText) => {
    setText(sampleText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-800">
        {/* Glow accent decoration */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="study-notes" className="flex items-center gap-2 text-lg font-semibold text-slate-100">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Enter Study Notes or Topic
            </label>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span>{wordCount} words</span>
              <span className="text-slate-700">•</span>
              <span>{charCount} chars</span>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-slate-900/80 border border-slate-800 focus-within:border-indigo-500 transition-colors shadow-inner">
            <textarea
              id="study-notes"
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your lecture notes, article excerpts, chapter summaries, or simply type a topic (e.g., 'Machine Learning Fundamentals')..."
              className="w-full p-4 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none resize-y text-base sm:text-lg leading-relaxed font-sans"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => setText('')}
              disabled={!text || isLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-rose-400 transition-colors disabled:opacity-30 disabled:hover:text-slate-400 self-start sm:self-center"
            >
              <Trash2 className="w-4 h-4" />
              Clear Input
            </button>

            <button
              type="submit"
              disabled={!text.trim() || isLoading}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 active:scale-[0.98] transition-all shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Sparkles className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Generating AI Study Kit...' : 'Generate Flashcards & Quiz'}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </form>
      </div>

      {/* Sample Prompts for Fast Testing */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          Quick Test Sample Prompts
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SAMPLE_PROMPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSampleClick(sample.text)}
              disabled={isLoading}
              className="glass-card text-left p-3.5 rounded-xl border border-slate-800/80 hover:border-indigo-500/40 hover:bg-slate-800/50 transition-all text-xs sm:text-sm text-slate-300 group flex flex-col justify-between"
            >
              <span className="font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">
                {sample.title}
              </span>
              <span className="line-clamp-2 text-slate-400 mt-1 text-xs">
                {sample.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
