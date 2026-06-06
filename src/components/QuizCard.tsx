"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";

interface QuizCardProps {
  question: {
    id: number;
    title: string;
    options: unknown;
    correctOption: string | null;
    explanation: string;
  };
  onAnswered?: (isCorrect: boolean) => void;
}

export default function QuizCard({ question, onAnswered }: QuizCardProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const hasCalledRef = useRef(false);

  const options: string[] = useMemo(() => {
    if (typeof question.options === "string") {
      try {
        return JSON.parse(question.options);
      } catch {
        return [];
      }
    }
    if (Array.isArray(question.options)) {
      return question.options as string[];
    }
    return [];
  }, [question.options]);

  const isCorrect = selected === question.correctOption;
  const answered = selected !== null;

  const handleSelect = useCallback(
    (option: string) => {
      if (answered) return;
      setSelected(option);
      setShowExplanation(true);
      const correct = option === question.correctOption;
      if (!hasCalledRef.current) {
        hasCalledRef.current = true;
        onAnswered?.(correct);
      }
    },
    [answered, question.correctOption, onAnswered]
  );

  function getOptionStyle(option: string) {
    if (!answered) {
      return "border-zinc-700/50 bg-zinc-800/60 hover:bg-zinc-700/70 hover:border-zinc-500 hover:-translate-y-0.5 cursor-pointer shadow-sm";
    }
    if (option === question.correctOption) {
      return "border-emerald-400/40 bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 text-emerald-200 shadow-[0_0_16px_rgba(52,211,153,0.08)]";
    }
    if (option === selected && !isCorrect) {
      return "border-red-400/40 bg-gradient-to-r from-red-500/15 to-red-400/10 text-red-200 shadow-[0_0_16px_rgba(248,113,113,0.08)]";
    }
    return "border-zinc-700/20 bg-zinc-800/30 text-zinc-500";
  }

  function getOptionLabel(index: number) {
    return String.fromCharCode(65 + index);
  }

  return (
    <div className="rounded-2xl border border-zinc-800/70 bg-zinc-900/70 shadow-lg shadow-black/10 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-black/15">
      {/* Question Header */}
      <div className="px-6 py-5 border-b border-zinc-800/50">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="inline-flex items-center justify-center text-[10px] font-bold text-blue-300 bg-blue-400/10 rounded-full px-2.5 py-0.5 uppercase tracking-wide">
            选择题
          </span>
          {answered && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-2.5 py-0.5 uppercase tracking-wide ${
                isCorrect
                  ? "text-emerald-300 bg-emerald-400/10"
                  : "text-red-300 bg-red-400/10"
              }`}
            >
              {isCorrect ? "✓ 回答正确" : "✗ 回答错误"}
            </span>
          )}
        </div>
        <h3 className="text-base font-semibold text-zinc-100 leading-relaxed">
          {question.title}
        </h3>
      </div>

      {/* Options */}
      <div className="px-6 py-4 grid gap-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            disabled={answered}
            className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm leading-relaxed transition-all duration-200 ${getOptionStyle(option)}`}
          >
            <span
              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold mr-3 transition-colors duration-200 ${
                option === question.correctOption && answered
                  ? "bg-emerald-500/20 text-emerald-300"
                  : option === selected && !isCorrect
                    ? "bg-red-500/20 text-red-300"
                    : "bg-zinc-700/50 text-zinc-400"
              }`}
            >
              {getOptionLabel(index)}
            </span>
            {option}
            {answered && option === question.correctOption && (
              <span className="ml-auto text-emerald-400 text-xs">✓</span>
            )}
            {answered && option === selected && !isCorrect && (
              <span className="ml-auto text-red-400 text-xs">✗</span>
            )}
          </button>
        ))}
      </div>

      {/* Explanation */}
      <div
        className={`explanation-enter ${showExplanation ? "show" : ""}`}
      >
        <div className="px-6 pb-6">
          <div className="rounded-xl bg-gradient-to-r from-blue-500/8 to-indigo-500/5 border border-blue-500/15 px-5 py-4 mt-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-base">💡</span>
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                解析
              </span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {question.explanation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
