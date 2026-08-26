import React, { useEffect, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { useTimerStore } from "../store/useTimerStore";
import { Coffee, X } from "lucide-react";

export default function StudyTimer({
  forceShow,
  onClose,
}: {
  forceShow?: boolean;
  onClose?: () => void;
}) {
  const { settings } = useAppStore();
  const { secondsElapsed, increment, reset } = useTimerStore();
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      increment();
    }, 1000);
    return () => clearInterval(interval);
  }, [increment]);

  useEffect(() => {
    // Check if limit reached
    if (
      secondsElapsed >= 45 * 60
    ) {
      if (!showWarning && secondsElapsed === 45 * 60) {
        setShowWarning(true);
      }
    }
  }, [secondsElapsed, showWarning]);

  const handleDismiss = () => {
    setShowWarning(false);
    reset();
    if (onClose) onClose();
  };

  const isVisible = showWarning || forceShow;

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border-4 border-[#3B82F6] animate-bounce-short">
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 bg-[#DBEAFE] text-[#3B82F6] rounded-full flex items-center justify-center">
            <Coffee size={40} />
          </div>

          <h2 className="text-2xl font-black text-[#1E3A8A]">
            Đã đến lúc nghỉ ngơi!
          </h2>

          <p className="text-gray-600 font-medium">
            Bạn đã học rất chăm chỉ rồi, hãy nghỉ ngơi một chút, uống ly nước ấm, vận động nhẹ nhàng, thư giãn và tiếp tục học sau nhé!
          </p>

          <button
            onClick={handleDismiss}
            className="w-full mt-4 bg-[#3B82F6] text-white font-black py-4 rounded-xl hover:bg-[#2563EB] transition-colors shadow-lg shadow-blue-500/30"
          >
            MÌNH SẼ NGHỈ NGƠI NGAY
          </button>
        </div>
      </div>
    </div>
  );
}
