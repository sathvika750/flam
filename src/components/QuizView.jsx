import React, { useState, useEffect } from 'react';
import { HelpCircle, CheckCircle2, XCircle, RefreshCw, Award, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

export default function QuizView({ questions = [], topic = 'Multiple Choice Quiz' }) {
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isRetestMode, setIsRetestMode] = useState(false);

  useEffect(() => {
    setActiveQuestions(questions);
    setUserAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setIsRetestMode(false);
  }, [questions]);

  if (!questions.length) {
    return (
      <div className="text-center p-8 text-slate-400">
        No quiz questions available. Please generate content.
      </div>
    );
  }

  const currentQ = activeQuestions[currentIndex] || {};
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleOptionSelect = (optionIdx) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIndex]: optionIdx,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    setCurrentIndex(0);
  };

  // Calculate score breakdown
  const correctCount = activeQuestions.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctIndex ? acc + 1 : acc;
  }, 0);

  const incorrectQuestions = activeQuestions.filter((q, idx) => {
    return userAnswers[idx] !== q.correctIndex;
  });

  const percentage = Math.round((correctCount / totalQuestions) * 100);

  // Retest only incorrect questions
  const handleRetestWrong = () => {
    if (incorrectQuestions.length > 0) {
      setActiveQuestions(incorrectQuestions);
      setUserAnswers({});
      setCurrentIndex(0);
      setIsSubmitted(false);
      setIsRetestMode(true);
    }
  };

  // Reset full quiz
  const handleResetFullQuiz = () => {
    setActiveQuestions(questions);
    setUserAnswers({});
    setCurrentIndex(0);
    setIsSubmitted(false);
    setIsRetestMode(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">{topic}</h2>
          {isRetestMode && (
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Retesting Missed ({totalQuestions})
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleResetFullQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-indigo-400 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Full Quiz
          </button>
          {!isSubmitted && (
            <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
              Q {currentIndex + 1} of {totalQuestions}
            </span>
          )}
        </div>
      </div>

      {/* QUIZ IN PROGRESS VIEW */}
      {!isSubmitted ? (
        <div className="space-y-6">
          {/* Progress bar */}
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
            <div
              className="bg-indigo-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            />
          </div>

          {/* Question Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                Question #{currentIndex + 1}
              </span>
              <h3 className="text-lg sm:text-xl font-semibold text-slate-100 leading-relaxed">
                {currentQ.question}
              </h3>
            </div>

            {/* Multiple Choice Options */}
            <div className="space-y-3">
              {currentQ.options?.map((option, optIdx) => {
                const isSelected = userAnswers[currentIndex] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleOptionSelect(optIdx)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-slate-100 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                          isSelected
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-sm sm:text-base font-medium">{option}</span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-slate-700'
                      }`}
                    >
                      {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Nav */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-5 py-2.5 rounded-xl font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors text-sm"
            >
              Previous
            </button>

            {answeredCount === totalQuestions ? (
              <button
                onClick={handleSubmitQuiz}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/25 active:scale-95 transition-all text-sm"
              >
                Submit Quiz
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl font-medium text-slate-200 bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 transition-colors text-sm"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors text-sm"
              >
                Finish & View Results
              </button>
            )}
          </div>
        </div>
      ) : (
        /* QUIZ SUMMARY & SCORE VIEW */
        <div className="space-y-8 animate-fadeIn">
          {/* Score Hero Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl text-center relative overflow-hidden space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto border border-indigo-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-100">Quiz Completed!</h3>
              <p className="text-sm text-slate-400 mt-1">
                You scored <span className="text-indigo-400 font-bold">{correctCount}</span> out of{' '}
                <span className="text-slate-200 font-bold">{totalQuestions}</span> questions correctly.
              </p>
            </div>

            {/* Score Percentage Gauge */}
            <div className="py-2">
              <div className="inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  {percentage}%
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">
                  {percentage >= 80 ? '🌟 Outstanding Mastery' : percentage >= 50 ? '👍 Good Knowledge' : '📚 Needs Practice'}
                </span>
              </div>
            </div>

            {/* Actions: Retest Wrong Answers vs Reset */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              {incorrectQuestions.length > 0 ? (
                <button
                  onClick={handleRetestWrong}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-amber-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Re-test Wrong Answers ({incorrectQuestions.length})
                </button>
              ) : (
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-4 py-2 rounded-xl border border-emerald-800/50">
                  <CheckCircle2 className="w-4 h-4" />
                  Perfect Score! No wrong answers to re-test.
                </div>
              )}

              <button
                onClick={handleResetFullQuiz}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Full Quiz
              </button>
            </div>
          </div>

          {/* Detailed Question Breakdown & Explanations */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Detailed Breakdown & Explanations
            </h4>

            {activeQuestions.map((q, qIdx) => {
              const selectedOpt = userAnswers[qIdx];
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={qIdx}
                  className={`glass-card rounded-2xl p-5 sm:p-6 border transition-all ${
                    isCorrect
                      ? 'border-emerald-500/30 bg-emerald-950/10'
                      : 'border-rose-500/30 bg-rose-950/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-xs font-mono font-semibold text-slate-400">
                          Question {qIdx + 1}
                        </span>
                        <h5 className="text-base font-semibold text-slate-100 mt-0.5">
                          {q.question}
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
                    {q.options.map((opt, oIdx) => {
                      const isUserChoice = selectedOpt === oIdx;
                      const isAnswer = q.correctIndex === oIdx;

                      let badgeClass = 'bg-slate-900/60 border-slate-800 text-slate-400';
                      if (isAnswer) {
                        badgeClass = 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 font-semibold';
                      } else if (isUserChoice && !isCorrect) {
                        badgeClass = 'bg-rose-950/80 border-rose-500/60 text-rose-200 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-3 rounded-lg border text-xs sm:text-sm flex items-center justify-between ${badgeClass}`}
                        >
                          <span>{opt}</span>
                          {isAnswer && <span className="text-xs text-emerald-400 font-mono">✓ Correct</span>}
                          {isUserChoice && !isAnswer && <span className="text-xs text-rose-400 font-mono">✗ Your Choice</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation Box */}
                  <div className="mt-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs sm:text-sm text-slate-300">
                    <span className="font-bold text-indigo-400 block mb-1">Explanation:</span>
                    {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
