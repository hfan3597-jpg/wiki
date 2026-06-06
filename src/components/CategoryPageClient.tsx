"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { generateQuiz, type GeneratedQuiz } from "@/actions/generateQuiz";
import QuizCard from "@/components/QuizCard";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loading-overlay"; questions: GeneratedQuiz[] }
  | { status: "success"; questions: GeneratedQuiz[] }
  | { status: "error"; message: string };

interface CategoryPageClientProps {
  categoryName: string;
  icon: string;
  description: string;
}

export default function CategoryPageClient({
  categoryName,
  icon,
  description,
}: CategoryPageClientProps) {
  const [state, setState] = useState<State>({ status: "idle" });
  const [answeredCount, setAnsweredCount] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  const requestIdRef = useRef(0);
  const initialTriggeredRef = useRef(false);

  const totalQuestions = 10;
  const isComplete = answeredCount >= totalQuestions;

  const resetProgress = useCallback(() => {
    setAnsweredCount(0);
    setScore(0);
    setAnswers({});
  }, []);

  const handleAnswered = useCallback(
    (index: number, isCorrect: boolean) => {
      setAnswers((prev) => {
        if (prev[index] !== undefined) return prev; // already answered
        return { ...prev, [index]: isCorrect };
      });
      setAnsweredCount((prev) => prev + 1);
      if (isCorrect) {
        setScore((prev) => prev + 10);
      }
    },
    []
  );

  const fetchQuestions = useCallback(
    async (isInitial = false) => {
      const currentRequestId = ++requestIdRef.current;

      if (isInitial) {
        setState({ status: "loading" });
      } else {
        setState((prev) =>
          prev.status === "success"
            ? { status: "loading-overlay", questions: prev.questions }
            : { status: "loading" }
        );
      }

      resetProgress();

      try {
        const questions = await generateQuiz(categoryName);
        if (currentRequestId !== requestIdRef.current) return;
        setState({ status: "success", questions });
      } catch (e) {
        if (currentRequestId !== requestIdRef.current) return;
        const message =
          e instanceof Error ? e.message : "生成失败，请稍后重试";
        setState({ status: "error", message });
      }
    },
    [categoryName, resetProgress]
  );

  // Auto-trigger on first mount
  useEffect(() => {
    let cancelled = false;

    if (!initialTriggeredRef.current) {
      initialTriggeredRef.current = true;
      const id = ++requestIdRef.current;
      const doFetch = async () => {
        setState({ status: "loading" });
        try {
          const questions = await generateQuiz(categoryName);
          if (cancelled) return;
          if (id !== requestIdRef.current) return;
          setState({ status: "success", questions });
        } catch (e) {
          if (cancelled) return;
          if (id !== requestIdRef.current) return;
          const message =
            e instanceof Error ? e.message : "生成失败，请稍后重试";
          setState({ status: "error", message });
        }
      };
      doFetch();
    }

    return () => {
      cancelled = true;
    };
  }, [categoryName]);

  const questions =
    state.status === "success" || state.status === "loading-overlay"
      ? state.questions
      : [];

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">
            {icon} {categoryName}
          </h1>
          <p className="text-sm text-zinc-500">{description}</p>
        </div>
        <button
          onClick={() => fetchQuestions(false)}
          disabled={state.status === "loading"}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium
                     bg-zinc-800 border border-zinc-700 text-zinc-300
                     hover:bg-zinc-700 hover:text-zinc-100 hover:border-zinc-600
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all active:scale-95"
        >
          <svg
            className={`w-3.5 h-3.5 ${state.status === "loading" || state.status === "loading-overlay" ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {state.status === "loading" || state.status === "loading-overlay"
            ? "生成中..."
            : "生成 10 道新题"}
        </button>
      </div>

      {/* Progress Bar + Scoreboard */}
      {(state.status === "success" || state.status === "loading-overlay") && (
        <div className="mb-6">
          {/* Floating scoreboard */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              {/* Progress ring */}
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    className="text-zinc-800"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="currentColor"
                    className="text-blue-400 transition-all duration-500 ease-out"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={`${(answeredCount / totalQuestions) * 94.2} 94.2`}
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-blue-300">
                  {answeredCount}/{totalQuestions}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-300">
                  答题进度
                </p>
                <p className="text-[10px] text-zinc-500">
                  已答 {answeredCount} / {totalQuestions} 题
                </p>
              </div>
            </div>

            {/* Score badge */}
            <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-2.5 shadow-lg">
              <span className="text-lg">⭐</span>
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
                  得分
                </p>
                <p className="text-lg font-bold text-amber-400 leading-tight tabular-nums">
                  {score}
                </p>
              </div>
            </div>
          </div>

          {/* Linear progress bar */}
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Idle */}
      {state.status === "idle" && (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-sm">准备中...</p>
        </div>
      )}

      {/* Loading (initial) */}
      {state.status === "loading" && <LoadingSkeleton />}

      {/* Loading (regenerate - keep old questions visible) */}
      {state.status === "loading-overlay" && (
        <div className="relative">
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px] z-10 rounded-xl flex items-start justify-center pt-20">
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-5 py-3 shadow-lg">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <span className="text-xs text-zinc-300 font-medium">
                AI 正在生成新题目...
              </span>
            </div>
          </div>
          <div className="opacity-50 pointer-events-none">
            <div className="grid gap-6">
              {questions.map((q, i) => (
                <QuizCard
                  key={i}
                  question={{
                    id: i,
                    title: q.title,
                    options: q.options,
                    correctOption: q.correctOption,
                    explanation: q.explanation,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Success */}
      {state.status === "success" && (
        <>
          <p className="text-xs text-zinc-600 mb-4">
            AI 为您生成了 {questions.length} 道关于「{categoryName}」的题目
          </p>
          <div className="grid gap-6">
            {questions.map((q, i) => (
              <QuizCard
                key={i}
                question={{
                  id: i,
                  title: q.title,
                  options: q.options,
                  correctOption: q.correctOption,
                  explanation: q.explanation,
                }}
                onAnswered={(correct) => handleAnswered(i, correct)}
              />
            ))}
          </div>

          {/* Settlement Card */}
          {isComplete && <SettlementCard score={score} total={totalQuestions} onRetry={() => fetchQuestions(false)} />}
        </>
      )}

      {/* Error */}
      {state.status === "error" && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mb-4">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-zinc-300 text-sm font-medium mb-2">生成失败</p>
          <p className="text-zinc-500 text-xs mb-4">{state.message}</p>
          <button
            onClick={() => fetchQuestions(false)}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-zinc-800 border border-zinc-700 text-zinc-300 hover:bg-zinc-700 transition-all"
          >
            重试
          </button>
        </div>
      )}
    </div>
  );
}

function SettlementCard({
  score,
  total,
  onRetry,
}: {
  score: number;
  total: number;
  onRetry: () => void;
}) {
  const maxScore = total * 10;
  const ratio = score / maxScore;
  const emoji = ratio >= 0.9 ? "🏆" : ratio >= 0.7 ? "🎉" : ratio >= 0.5 ? "👍" : "💪";
  const subtitle =
    ratio >= 0.9
      ? "太厉害了，你简直是知识达人！"
      : ratio >= 0.7
        ? "非常棒，继续保持！"
        : ratio >= 0.5
          ? "表现不错，再接再厉！"
          : "继续加油，知识需要积累！";

  return (
    <div className="mt-10 rounded-2xl border border-zinc-800/70 bg-gradient-to-b from-zinc-900/90 to-zinc-900/60 shadow-xl shadow-black/10 overflow-hidden">
      {/* Confetti-like top bar */}
      <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500" />
      <div className="px-8 py-8 text-center">
        <div className="text-5xl mb-4">{emoji}</div>
        <h2 className="text-xl font-bold text-zinc-100 mb-2">答题完成！</h2>
        <p className="text-sm text-zinc-400 mb-6">{subtitle}</p>

        {/* Score display */}
        <div className="inline-flex items-baseline gap-1 mb-6">
          <span className="text-5xl font-extrabold text-amber-400 tabular-nums">
            {score}
          </span>
          <span className="text-lg font-medium text-zinc-500">/ {maxScore}</span>
        </div>

        {/* Mini stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-zinc-200">{total}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
              总题数
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {score / 10}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
              答对
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">
              {total - score / 10}
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
              答错
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {Math.round(ratio * 100)}%
            </p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
              正确率
            </p>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold
                     bg-gradient-to-r from-blue-500 to-indigo-500 text-white
                     hover:from-blue-400 hover:to-indigo-400
                     shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30
                     transition-all active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          再来 10 题
        </button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6 animate-pulse">
        <div className="h-3 w-3 rounded-full bg-zinc-700" />
        <div className="h-3 w-56 bg-zinc-800 rounded" />
      </div>

      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/70 overflow-hidden animate-pulse shadow-lg"
        >
          <div className="px-6 py-5 border-b border-zinc-800/50 space-y-3">
            <div className="h-4 w-14 bg-zinc-800 rounded-full" />
            <div className="h-4 w-3/4 bg-zinc-800 rounded" />
          </div>
          <div className="px-6 py-4 grid gap-3">
            {Array.from({ length: 4 }).map((_, j) => (
              <div
                key={j}
                className="h-12 bg-zinc-800 rounded-xl"
                style={{ width: `${85 - j * 5}%` }}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-center gap-2 py-6">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <span className="text-xs text-zinc-500 ml-2">
          AI 正在生成题目，请稍候...
        </span>
      </div>
    </div>
  );
}
