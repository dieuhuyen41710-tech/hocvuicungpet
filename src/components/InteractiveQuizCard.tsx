import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export interface QuizData {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface InteractiveQuizCardProps {
  quiz: QuizData;
}

export default function InteractiveQuizCard({ quiz }: InteractiveQuizCardProps) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const addPointsAndXP = useAppStore(state => state.addPointsAndXP);

  const handleCheck = () => {
    if (selectedIdx === null) return;
    const correct = selectedIdx === quiz.correctIndex;
    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct && !rewardClaimed) {
      setRewardClaimed(true);
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors if any
      }
      addPointsAndXP(5, 10);
    }
  };

  const handleRetry = () => {
    setSelectedIdx(null);
    setIsSubmitted(false);
    setIsCorrect(null);
  };

  return (
    <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-3.5 shadow-sm space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-amber-200 pb-2">
        <span className="text-xs font-black text-[#92400E] flex items-center gap-1.5 uppercase tracking-wide">
          <Sparkles size={14} className="text-amber-500 animate-spin" />
          Thử sức lại với câu hỏi tương tự:
        </span>
        {rewardClaimed && (
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <Trophy size={11} /> +10 XP & +5 Điểm
          </span>
        )}
      </div>

      {/* Question */}
      <p className="text-xs sm:text-sm font-bold text-gray-800 leading-snug">
        {quiz.question}
      </p>

      {/* Options List */}
      <div className="space-y-1.5">
        {quiz.options.map((opt, idx) => {
          const isThisSelected = selectedIdx === idx;
          const isThisCorrect = idx === quiz.correctIndex;

          let btnStyle = "border-gray-200 bg-white hover:bg-amber-50/60 text-gray-800";
          if (!isSubmitted) {
            if (isThisSelected) {
              btnStyle = "border-[#F59E0B] bg-amber-100/70 text-[#92400E] font-bold shadow-2xs";
            }
          } else {
            if (isThisCorrect) {
              btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-2xs";
            } else if (isThisSelected && !isThisCorrect) {
              btnStyle = "border-rose-400 bg-rose-50 text-rose-800 line-through opacity-80";
            } else {
              btnStyle = "border-gray-100 bg-gray-50/50 text-gray-400";
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted && isCorrect === true}
              onClick={() => {
                if (!isSubmitted) {
                  setSelectedIdx(idx);
                }
              }}
              className={`w-full text-left px-3 py-2 rounded-xl border-2 text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span className="leading-snug">{opt}</span>
              {isSubmitted && isThisCorrect && (
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0 ml-2" />
              )}
              {isSubmitted && isThisSelected && !isThisCorrect && (
                <XCircle size={16} className="text-rose-500 shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action / Result */}
      <div className="pt-1">
        {!isSubmitted ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={selectedIdx === null}
            className="w-full py-2 px-3 bg-[#F59E0B] hover:bg-[#D97706] disabled:opacity-40 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 size={14} /> Kiểm tra đáp án
          </button>
        ) : isCorrect ? (
          <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-1">
            <p className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
              🎉 Chính xác! Cậu đã hiểu bản chất bài toán rồi đó!
            </p>
            {quiz.explanation && (
              <p className="text-[11px] text-emerald-700 leading-snug">
                {quiz.explanation}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl space-y-1">
              <p className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                Chưa chính xác nè bạn nhỏ! Cố lên nhé! 🐾
              </p>
              <p className="text-[11px] text-rose-700 leading-snug">
                Cậu thử đọc lại các bước gợi ý phía trên của Pet rồi tính lại xem sao nhé.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRetry}
              className="w-full py-1.5 px-3 bg-white border-2 border-amber-300 hover:bg-amber-50 text-amber-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={12} /> Thử sức lại lần nữa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
