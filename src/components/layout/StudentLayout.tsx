import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import { Settings, Coffee } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useTimerStore } from "../../store/useTimerStore";
import { isPetSleeping } from "../../utils/petSleepService";
import { Student } from "../../types";
import FloatingPet from "../FloatingPet";
import StudyTimer from "../StudyTimer";
import PetAIAssistant from "../PetAIAssistant";

export default function StudentLayout() {
  const { settings, logout, currentUser } = useAppStore();
  const { secondsElapsed } = useTimerStore();
  const navigate = useNavigate();
  const isSleeping = isPetSleeping(
    settings.petSleepStart,
    settings.petSleepEnd,
  );
  const student = currentUser as Student;
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [showTimerReminder, setShowTimerReminder] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { to: "/student", icon: "🏠", label: "Trang chủ" },
    { to: "/student/map", icon: "🗺️", label: "Bản đồ" },
    { to: "/student/dashboard", icon: "📚", label: "Nhiệm vụ" },
    { to: "/student/pet", icon: "🐾", label: "Chăm sóc Pet" },
    { to: "/student/pet-world", icon: "🌍", label: "Thế giới Pet" },
    { to: "/student/tools", icon: "🧮", label: "Công cụ số" },
    { to: "/student/minigame", icon: "🎮", label: "Vui chơi" },
    { to: "/student/3d-viewer", icon: "🧊", label: "Không gian 3D" },
    { to: "/student/achievements", icon: "🏆", label: "Thành tích" },
    { to: "/student/mailbox", icon: "✉️", label: "Hòm thư" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F0F9FF] text-[#2D3748] font-sans flex flex-col select-none relative overflow-x-hidden" style={settings.backgroundUrl ? { backgroundImage: `url(${settings.backgroundUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' } : {}}>
      {settings.backgroundUrl && <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-0"></div>}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
      <header className="h-20 bg-white border-b-4 border-[#E0F2FE] px-4 md:px-6 flex items-center justify-between shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#60A5FA] to-[#3B82F6] rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg shrink-0 cursor-pointer overflow-hidden"
            onClick={() => navigate("/student")}
          >
            {settings.logoUrl ? <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" /> : '🐾'}
          </div>
          <div className="hidden lg:block">
            <h1 className="text-xl font-black text-[#1E40AF] tracking-tight uppercase leading-none">
              "Học vui cùng Pet"
            </h1>
            <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-widest">
              Trường THCS Bằng Doãn
            </span>
          </div>
        </div>

        {student && (
          <div className="flex items-center gap-2 md:gap-6 flex-1 justify-center lg:justify-end lg:mr-6">
            <div className="flex items-center bg-[#FEF3C7] px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 border-[#FCD34D]">
              <span className="text-base md:text-lg md:mr-2">🌟</span>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-bold text-[#B45309] leading-none uppercase">
                  Kinh Nghiệm
                </span>
                <span className="text-sm font-black text-[#D97706]">
                  {student.xp} XP
                </span>
              </div>
              <span className="md:hidden ml-1 font-black text-[#D97706] text-sm">
                {student.xp}
              </span>
            </div>
            <div className="flex items-center bg-[#ECFDF5] px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 border-[#6EE7B7]">
              <span className="text-base md:text-lg md:mr-2">🪙</span>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-bold text-[#047857] leading-none uppercase">
                  Điểm Thưởng
                </span>
                <span className="text-sm font-black text-[#059669]">
                  {student.points} Xu
                </span>
              </div>
              <span className="md:hidden ml-1 font-black text-[#059669] text-sm">
                {student.points}
              </span>
            </div>
            <div className="flex items-center bg-[#FDF2F8] px-3 md:px-4 py-1.5 md:py-2 rounded-full border-2 border-[#F9A8D4]">
              <span className="text-base md:text-lg md:mr-2">🔥</span>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] font-bold text-[#BE185D] leading-none uppercase">
                  Chuỗi Học
                </span>
                <span className="text-sm font-black text-[#DB2777]">
                  {student.streak} Ngày
                </span>
              </div>
              <span className="md:hidden ml-1 font-black text-[#DB2777] text-sm">
                {student.streak}
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 lg:border-l-2 lg:border-[#E2E8F0] lg:pl-6 shrink-0">
          <button
            onClick={() => setShowTimerReminder(true)}
            title="Đồng hồ học tập"
            className="flex items-center gap-2 bg-[#F1F5F9] px-2 md:px-3 py-1 md:py-2 rounded-xl text-[#3B82F6] font-bold hover:bg-[#E2E8F0] transition-colors border-2 border-[#E2E8F0]"
          >
            <Coffee size={18} className="hidden md:block" />
            <span className="text-[10px] md:text-xs whitespace-nowrap">
              {Math.floor(secondsElapsed / 60)} / 45 phút
            </span>
          </button>

          <div className="text-right hidden lg:block">
            <p className="text-xs font-bold text-gray-400 uppercase">
              Học sinh
            </p>
            <p className="font-bold text-[#1E40AF]">
              {student?.fullName.split(" ").pop()}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Đăng xuất"
            className="w-10 h-10 md:w-12 md:h-12 bg-[#BFDBFE] rounded-full border-2 md:border-4 border-white shadow-inner flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
          >
            <span className="text-xl md:text-2xl">🎒</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        <FloatingPet onOpenAI={() => setIsAIOpen(true)} />
        <StudyTimer
          forceShow={showTimerReminder}
          onClose={() => setShowTimerReminder(false)}
        />
        <PetAIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

        <nav className="w-20 md:w-24 bg-white border-r-4 border-[#E0F2FE] hidden md:flex flex-col items-center py-8 gap-6 z-10 sticky top-20 h-[calc(100vh-5rem)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/student"}
              className={({ isActive }) =>
                `w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl md:text-3xl transition-all ${
                  isActive
                    ? "bg-[#E0F2FE] text-[#3B82F6] shadow-md hover:scale-110"
                    : "bg-[#F0F9FF] text-gray-400 hover:bg-[#E0F2FE] hover:text-[#3B82F6]"
                }`
              }
              title={item.label}
            >
              {item.icon}
            </NavLink>
          ))}

          <div className="mt-auto flex flex-col gap-4 items-center shrink-0">
            <button
              title="Trợ lí Pet AI"
              onClick={() => setIsAIOpen(true)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-[#FEF3C7] text-gray-700 flex items-center justify-center text-2xl md:text-3xl hover:bg-[#FDE68A] transition-colors border-2 border-[#FDE68A] hover:scale-110 shadow-sm"
            >
              🤖
            </button>
            <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F1F5F9] text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </nav>

        <main className="flex-1 p-4 md:p-8 flex justify-center relative">
          {isSleeping && (
            <div className="absolute top-4 left-4 right-4 bg-[#1E3A8A] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between z-50 border-4 border-[#3B82F6]">
              <div className="flex items-center space-x-4">
                <span className="text-3xl">😴</span>
                <div>
                  <h3 className="font-black uppercase tracking-wide text-blue-200">
                    Pet đã ngủ rồi!
                  </h3>
                  <p className="text-sm font-medium">
                    Hãy đi ngủ sớm để nạp đầy năng lượng cho ngày mai nhé.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="w-full max-w-6xl pb-24 md:pb-12 flex flex-col min-h-full">
            <Outlet />
          </div>
        </main>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-4 border-[#E0F2FE] flex justify-start p-2 z-40 pb-safe overflow-x-auto gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/student"}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center min-w-[56px] w-14 h-14 shrink-0 rounded-2xl transition-all text-2xl ${
                  isActive
                    ? "bg-[#E0F2FE] shadow-md -translate-y-2"
                    : "opacity-50 hover:opacity-100 hover:bg-[#F0F9FF]"
                }`
              }
            >
              {item.icon}
            </NavLink>
          ))}
          <button
            title="Trợ lí Pet AI"
            onClick={() => setIsAIOpen(true)}
            className="flex flex-col items-center justify-center min-w-[56px] w-14 h-14 shrink-0 rounded-2xl transition-all text-2xl opacity-50 hover:opacity-100 hover:bg-[#FEF3C7]"
          >
            🤖
          </button>
        </nav>
      </div>
    </div>
      </div>
  );
}
