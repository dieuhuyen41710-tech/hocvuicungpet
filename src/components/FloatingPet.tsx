import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAppStore } from "../store/useAppStore";
import { Student } from "../types";
import PetAvatar from "./PetAvatar";
import { getPetImage } from "../lib/petUtils";

import {
  Utensils,
  Gamepad2,
  Moon,
  BookOpen,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router";

export default function FloatingPet({ onOpenAI }: { onOpenAI?: () => void }) {
  const currentUser = useAppStore(
    (state) => state.currentUser,
  ) as Student | null;
  const { settings } = useAppStore();
  const pets = useAppStore((state) => state.pets);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (!currentUser || !currentUser.petId) return null;

  const petInfo = pets.find((p) => p.id === currentUser.petId);
  if (!petInfo) return null;

  const petImageUrl = getPetImage(petInfo, currentUser.petLevel, settings.globalEvolutions);

  // Helper messages logic
  const getPetMessages = () => {
    const messages = [];
    if (currentUser.petHunger <= 30) {
      messages.push({
        icon: <Utensils size={16} className="text-orange-500" />,
        text: "Pet đói rồi bạn ơi. Hãy cho Pet ăn nào",
        color: "bg-orange-50 text-orange-700 border-orange-200 animate-pulse",
      });
    } else if (currentUser.petHunger < 40) {
      messages.push({
        icon: <Utensils size={16} className="text-orange-500" />,
        text: "Đói bụng quá, cho tớ ăn nhé!",
        color: "bg-orange-50 text-orange-700 border-orange-200",
      });
    }
    if (currentUser.petHappiness < 40) {
      messages.push({
        icon: <Gamepad2 size={16} className="text-pink-500" />,
        text: "Tớ buồn chán, chơi cùng tớ đi!",
        color: "bg-pink-50 text-pink-700 border-pink-200",
      });
    }
    if (currentUser.petEnergy < 30) {
      messages.push({
        icon: <Moon size={16} className="text-indigo-500" />,
        text: "Tớ buồn ngủ quá, muốn đi ngủ...",
        color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      });
    }

    // Default messages if nothing is critical
    if (messages.length === 0) {
      messages.push({
        icon: <BookOpen size={16} className="text-blue-500" />,
        text: "Hôm nay mình học bài gì thế?",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      });
      messages.push({
        icon: <AlertCircle size={16} className="text-green-500" />,
        text: `Nhớ ngủ đúng giờ lúc ${settings.petSleepStart} nhé!`,
        color: "bg-green-50 text-green-700 border-green-200",
      });
    }
    return messages;
  };

  const messages = getPetMessages();

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      className="fixed bottom-24 right-4 z-[100] cursor-grab active:cursor-grabbing w-16 h-16 md:w-24 md:h-24"
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute bottom-full right-0 mb-4 w-64 bg-white rounded-3xl shadow-xl border-4 border-[#DBEAFE] p-4 flex flex-col gap-3 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b-2 border-gray-100 pb-2">
              <span className="font-black text-[#1E3A8A]">
                {currentUser.petName}
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-xs font-bold border flex items-start gap-2 ${msg.color}`}
                >
                  <span className="shrink-0 mt-0.5">{msg.icon}</span>
                  <span>{msg.text}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/student/pet");
                }}
                className="flex-1 py-2 bg-[#F0F9FF] text-[#3B82F6] font-black text-xs rounded-xl hover:bg-[#E0F2FE] transition-colors"
              >
                CHĂM SÓC
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenAI) {
                    onOpenAI();
                  }
                }}
                className="flex-[0.5] py-2 bg-[#FEF3C7] text-[#D97706] font-black text-xs rounded-xl border border-[#FDE68A] hover:bg-[#FDE68A] transition-colors flex justify-center items-center"
                title="Hỏi AI"
              >
                🤖 AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`w-full h-full bg-white rounded-full shadow-2xl border-4 flex items-center justify-center overflow-hidden hover:scale-110 transition-transform relative ${isOpen ? "border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.5)]" : "border-[#FDE68A]"}`}
      >
        <PetAvatar src={petImageUrl} className="w-full h-full text-4xl md:text-6xl animate-pulse" imgClassName="w-full h-full object-cover" />
        {currentUser.petHunger <= 30 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-black animate-bounce">!</span>
        )}
      </button>
    </motion.div>
  );
}
