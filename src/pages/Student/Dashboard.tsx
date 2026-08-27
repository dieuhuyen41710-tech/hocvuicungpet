import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAppStore } from "../../store/useAppStore";
import { Student } from "../../types";
import PetAvatar from "../../components/PetAvatar";
import { getPetImage } from "../../lib/petUtils";


export default function StudentDashboard() {
  const currentUser = useAppStore((state) => state.currentUser) as Student;
  const pets = useAppStore((state) => state.pets);
  const selectPet = useAppStore((state) => state.selectPet);
  const { settings } = useAppStore();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  // State for Pet Selection
  const [isSelectingPet, setIsSelectingPet] = useState(!currentUser.petId || searchParams.get('new') === 'true');
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [petNameInput, setPetNameInput] = useState("");

  const handleSelectPet = () => {
    if (selectedPetId && petNameInput.trim()) {
      selectPet(selectedPetId, petNameInput.trim());
      setIsSelectingPet(false);
      navigate('/student/dashboard');
    }
  };

  if (isSelectingPet) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-black text-[#1E3A8A] mb-2">
          Chào mừng đến Vương Quốc!
        </h1>
        <p className="text-[#64748B] font-semibold mb-8">
          Hãy chọn một người bạn đồng hành cùng bạn nhé.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`flex flex-col items-center p-6 rounded-3xl transition-all border-4 ${
                selectedPetId === pet.id
                  ? "bg-[#FDF2F8] border-[#F9A8D4] scale-110 shadow-xl"
                  : "bg-white border-[#E2E8F0] hover:border-[#F9A8D4] hover:shadow-md"
              }`}
            >
              <div className="w-20 h-20 mb-4 flex items-center justify-center">
                <PetAvatar src={pet.baseImageUrl} className="w-full h-full text-5xl" imgClassName="w-full h-full object-contain" />
              </div>
              <span className="font-black text-[#BE185D] text-sm text-center uppercase">
                {pet.name}
              </span>
            </button>
          ))}
        </div>

        {selectedPetId && (
          <div className="bg-white p-8 rounded-[32px] border-4 border-[#DBEAFE] shadow-xl w-full max-w-md animate-fade-in">
            <h3 className="font-black text-[#1E40AF] mb-4 text-center text-lg">
              ĐẶT TÊN CHO PET
            </h3>
            <input
              type="text"
              value={petNameInput}
              onChange={(e) => setPetNameInput(e.target.value)}
              placeholder="Ví dụ: Bé Thỏ..."
              className="w-full px-4 py-4 rounded-2xl bg-[#F8FAFC] border-2 border-[#E2E8F0] focus:border-[#3B82F6] focus:bg-white focus:outline-none mb-6 text-center text-xl font-bold text-[#1E3A8A]"
            />
            <button
              onClick={handleSelectPet}
              disabled={!petNameInput.trim()}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] disabled:from-gray-300 disabled:to-gray-400 text-white font-black py-4 rounded-2xl shadow-[0_6px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_4px_0_#1E3A8A] active:translate-y-2 active:shadow-none transition-all"
            >
              BẮT ĐẦU HÀNH TRÌNH! 🚀
            </button>
          </div>
        )}
      </div>
    );
  }

  const petInfo = pets.find((p) => p.id === currentUser.petId);
  const petImageUrl = getPetImage(petInfo, currentUser.petLevel, settings.globalEvolutions);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full h-full">
      <div className="flex-1 flex flex-col gap-6">
        <div
          className="bg-white rounded-[40px] border-4 border-[#DBEAFE] shadow-xl p-8 relative overflow-hidden flex-1 flex flex-col cursor-pointer hover:border-[#60A5FA] transition-colors"
          onClick={() => navigate("/student/map")}
        >
          <div
            className="absolute inset-0 bg-[#F8FAFC] opacity-50"
            style={{
              backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          ></div>
          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-[#1E3A8A] flex items-center gap-3">
                  🏰 Bản Đồ Tri Thức
                </h2>
                <p className="text-[#64748B] font-semibold mt-1">
                  Tiếp tục hành trình học tập của bạn
                </p>
              </div>
              <div className="bg-[#EFF6FF] px-6 py-2 rounded-2xl border-2 border-[#BFDBFE] font-bold text-[#1D4ED8]">
                Vào học ngay
              </div>
            </div>

            <div className="relative flex-1 flex items-center justify-around px-4 md:px-12 my-8">
              <div className="absolute top-1/2 left-8 right-8 h-4 bg-[#E2E8F0] -translate-y-1/2 rounded-full z-0 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] w-3/5"></div>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border-4 border-[#34D399] rounded-full flex items-center justify-center text-3xl shadow-lg ring-4 md:ring-8 ring-[#D1FAE5]">
                  🏠
                </div>
                <span className="font-black text-xs md:text-sm text-[#059669]">
                  Bắt đầu
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="absolute -top-12 md:-top-16 animate-bounce">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#FBCFE8] rounded-full border-4 border-white flex items-center justify-center text-2xl md:text-3xl shadow-xl overflow-hidden">
                    <PetAvatar src={petImageUrl} className="w-full h-full" imgClassName="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-b-4 border-r-4 border-white"></div>
                </div>
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#3B82F6] border-4 border-[#60A5FA] rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-xl ring-4 md:ring-8 ring-[#DBEAFE]">
                  ⭐
                </div>
                <span className="font-black text-base md:text-lg text-[#1E40AF]">
                  Hiện tại
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 opacity-60 hidden sm:flex">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 border-4 border-gray-300 rounded-full flex items-center justify-center text-3xl shadow-lg">
                  🎮
                </div>
                <span className="font-black text-xs md:text-sm text-gray-400">
                  Trò Chơi
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-4 opacity-40">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 border-4 border-gray-300 rounded-full flex items-center justify-center text-3xl shadow-lg">
                  🏆
                </div>
                <span className="font-black text-xs md:text-sm text-gray-400">
                  Đích Đến
                </span>
              </div>
            </div>

            <div className="mt-auto flex justify-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/student/map");
                }}
                className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black text-lg md:text-xl px-10 md:px-12 py-4 md:py-5 rounded-3xl shadow-[0_8px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_4px_0_#1E3A8A] transition-all active:translate-y-2 active:shadow-none"
              >
                TIẾP TỤC KHÁM PHÁ! 🚀
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-[#FFF7ED] rounded-3xl border-4 border-[#FED7AA] p-5 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/student/map")}
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              🎯
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-[#9A3412] uppercase tracking-wide">
                Nhiệm Vụ Ngày
              </p>
              <p className="font-black text-[#C2410C] leading-tight">
                Học 1 bài toán mới
              </p>
            </div>
          </div>
          <div
            className="bg-[#F0FDF4] rounded-3xl border-4 border-[#BBF7D0] p-5 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/student/pet")}
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              🧩
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-[#166534] uppercase tracking-wide">
                Mini Game
              </p>
              <p className="font-black text-[#15803D] leading-tight">
                Bắn đáp án đúng
              </p>
            </div>
          </div>
          <div
            className="bg-[#FAF5FF] rounded-3xl border-4 border-[#E9D5FF] p-5 flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform"
            onClick={() => navigate("/student/pet")}
          >
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
              🎒
            </div>
            <div>
              <p className="text-[10px] md:text-xs font-bold text-[#6B21A8] uppercase tracking-wide">
                Cửa Hàng
              </p>
              <p className="font-black text-[#7E22CE] leading-tight">
                Mua thức ăn
              </p>
            </div>
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-white rounded-[40px] border-4 border-[#FDF2F8] shadow-xl p-6 flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-b from-[#FDF2F8] to-[#FCE7F3] rounded-full border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
            <PetAvatar src={petImageUrl} className="w-full h-full text-6xl md:text-7xl" imgClassName="w-full h-full object-cover" />
            <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full border-2 border-[#F9A8D4] text-xs font-black text-[#DB2777]">
              Cấp {currentUser.petLevel}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-[#BE185D]">
              {currentUser.petName}
            </h3>
            <p className="text-[#F472B6] font-bold">{petInfo?.name}</p>
          </div>
          <div className="w-full flex flex-col gap-3 mt-2">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                <span>🍎 Độ No</span>
                <span>{currentUser.petHunger}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#F87171] transition-all duration-500"
                  style={{ width: `${currentUser.petHunger}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                <span>😊 Vui Vẻ</span>
                <span>{currentUser.petHappiness}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FBBF24] transition-all duration-500"
                  style={{ width: `${currentUser.petHappiness}%` }}
                ></div>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                <span>⚡ Năng Lượng</span>
                <span>{currentUser.petEnergy}%</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#60A5FA] transition-all duration-500"
                  style={{ width: `${currentUser.petEnergy}%` }}
                ></div>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/student/pet")}
            className="w-full py-3 bg-[#F472B6] text-white font-black rounded-2xl shadow-[0_5px_0_#BE185D] hover:translate-y-1 hover:shadow-none transition-all mt-2 uppercase text-sm"
          >
            Chăm Sóc Pet
          </button>
        </div>
      </aside>
    </div>
  );
}
