import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Shuffle, Layers, Eye } from 'lucide-react';

export default function FlashcardDeck({ cards = [], topic = 'Flashcards' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [deck, setDeck] = useState(cards);

  // Reset states if cards array updates
  useEffect(() => {
    setDeck(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const currentCard = deck[currentIndex] || {};

  const handleNext = useCallback(() => {
    if (currentIndex < deck.length - 1) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, deck.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...deck].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
  };

  // Keyboard navigation listener (Left/Right arrow to switch, Space/Enter to flip)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keyboard shortcuts if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleFlip]);

  if (!cards.length) {
    return (
      <div className="text-center p-8 text-slate-400">
        No flashcards available. Please generate content.
      </div>
    );
  }

  const progressPercentage = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">{topic}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShuffle}
            title="Shuffle Deck"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-400 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Shuffle
          </button>

          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            Card {currentIndex + 1} of {deck.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
        <div
          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* 3D Flippable Card Container */}
      <div
        onClick={handleFlip}
        className="w-full h-80 sm:h-96 perspective-1000 cursor-pointer select-none group"
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ease-out ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Card Front */}
          <div className="absolute inset-0 w-full h-full backface-hidden glass-card rounded-2xl p-6 sm:p-10 border border-indigo-500/20 shadow-2xl flex flex-col justify-between hover:border-indigo-500/40 transition-colors">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-400 uppercase tracking-wider">
              <span>Question / Term</span>
              <span className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-300">
                <Eye className="w-3.5 h-3.5" />
                Click to reveal answer
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center p-4">
              <p className="text-xl sm:text-2xl font-semibold text-slate-100 leading-relaxed font-sans">
                {currentCard.front}
              </p>
            </div>

            <div className="text-center text-xs text-slate-500 font-mono">
              Press Space or Click to Flip 🔄
            </div>
          </div>

          {/* Card Back */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 glass-card bg-slate-900/95 rounded-2xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-purple-400 uppercase tracking-wider">
              <span>Answer / Explanation</span>
              <span className="text-purple-300 font-mono">Card #{currentIndex + 1}</span>
            </div>

            <div className="flex-1 flex items-center justify-center text-center p-4">
              <p className="text-lg sm:text-xl text-slate-200 leading-relaxed font-sans">
                {currentCard.back}
              </p>
            </div>

            <div className="text-center text-xs text-slate-500 font-mono">
              Click anywhere to flip back
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/50 transition-colors"
        >
          <RotateCw className={`w-4 h-4 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
          {isFlipped ? 'Show Question' : 'Flip Card'}
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === deck.length - 1}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors"
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <div className="text-center text-xs text-slate-400 pt-2 flex items-center justify-center gap-4">
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">←</kbd> Prev</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">Space</kbd> Flip</span>
        <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">→</kbd> Next</span>
      </div>
    </div>
  );
}
