import React from 'react';
import { AlertTriangle, RotateCcw, HelpCircle } from 'lucide-react';

export default function ErrorState({ error, onRetry }) {
  const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred.';

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="glass-card bg-rose-950/20 rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-2xl space-y-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-100">Generation Failed</h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            {errorMessage}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs font-mono text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Troubleshooting Tips:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
            <li>Ensure the backend proxy server is running on port 5000.</li>
            <li>Verify your internet connection and API key quota.</li>
            <li>Try simplifying or rephrasing your input notes.</li>
          </ul>
        </div>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all shadow-lg shadow-rose-600/25 text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}
