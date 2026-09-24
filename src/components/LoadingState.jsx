import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Layers, HelpCircle } from 'lucide-react';

const LOADING_STEPS = [
  { text: 'Analyzing study notes & key concepts...', icon: Brain },
  { text: 'Generating high-yield flashcard deck...', icon: Layers },
  { text: 'Formulating multiple-choice quiz questions...', icon: HelpCircle },
  { text: 'Finalizing interactive AI study kit...', icon: Sparkles }
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const StepIcon = LOADING_STEPS[currentStep].icon;

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-indigo-500/30 shadow-2xl text-center space-y-8 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Animated Spinner Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <StepIcon className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
        </div>

        {/* Dynamic Status Text */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
            Generating Study Assistant
          </h3>
          <p className="text-sm sm:text-base text-indigo-300 font-medium h-6 transition-all duration-300">
            {LOADING_STEPS[currentStep].text}
          </p>
        </div>

        {/* Skeleton Card Animations */}
        <div className="space-y-3 pt-4 max-w-md mx-auto">
          <div className="h-4 bg-slate-800/80 rounded-full animate-shimmer w-3/4 mx-auto"></div>
          <div className="h-4 bg-slate-800/60 rounded-full animate-shimmer w-full"></div>
          <div className="h-4 bg-slate-800/40 rounded-full animate-shimmer w-5/6 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
