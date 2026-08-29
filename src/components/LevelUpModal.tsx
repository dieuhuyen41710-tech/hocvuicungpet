import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles } from 'lucide-react';

export default function LevelUpModal() {
  const levelUpInfo = useAppStore((state) => state.levelUpInfo);
  const clearLevelUpInfo = useAppStore((state) => state.clearLevelUpInfo);

  useEffect(() => {
    if (levelUpInfo) {
      const duration = 3.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 35, spread: 360, ticks: 80, zIndex: 99999 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
        const particleCount = 60 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [levelUpInfo]);

  if (!levelUpInfo) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-[40px] p-8 max-w-md w-full shadow-2xl border-8 border-[#F59E0B] text-center relative overflow-hidden transform animate-bounce-subtle">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-2xl -z-10"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl -z-10"></div>

        <div className="w-24 h-24 bg-gradient-to-tr from-[#F59E0B] to-[#FCD34D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white animate-bounce">
          <Trophy size={48} className="text-white fill-white" />
        </div>

        <div className="inline-flex items-center gap-2 bg-[#FEF3C7] text-[#D97706] px-4 py-1.5 rounded-full font-black text-sm mb-3 border-2 border-[#FCD34D]">
          <Sparkles size={16} /> CHÚC MỪNG PET THĂNG CẤP! 🌟
        </div>

        <h2 className="text-3xl font-black text-[#1E3A8A] mb-3 uppercase tracking-wide">
          {levelUpInfo.petName || 'Pet'} đã lên Cấp {levelUpInfo.level}!
        </h2>

        <div className="bg-[#FFFBEB] border-2 border-[#FDE68A] p-5 rounded-2xl mb-6 text-left shadow-inner">
          <p className="text-sm font-bold text-[#92400E] leading-relaxed flex items-start gap-3">
            <span className="text-2xl">🎉</span>
            <span>
              Tuyệt vời quá! Em học tập rất chăm chỉ và chăm sóc Pet vô cùng tốt. Hãy tiếp tục cố gắng phát huy để Pet tiếp tục tiến hóa và đạt cấp độ cao hơn nữa nhé! Cố lên em ơi! 💪🚀
            </span>
          </p>
        </div>

        <button
          onClick={clearLevelUpInfo}
          className="w-full py-4 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-black rounded-2xl shadow-[0_6px_0_#B45309] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wider text-base"
        >
          Tuyệt vời! Tiếp tục cố gắng 💪
        </button>
      </div>
    </div>
  );
}
