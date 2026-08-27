import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { Student } from "../../types";
import { Trophy, Users, BookOpen, Star } from "lucide-react";
import cutePetsImg from "../../assets/images/cute_pets_banner_1787838175550.jpg";
import bunnyImg from "../../assets/images/pixar_bunny_avatar_1787838459749.jpg";
import catImg from "../../assets/images/pixar_cat_avatar_1787838476517.jpg";
import dogImg from "../../assets/images/pixar_dog_avatar_1787838495530.jpg";
import pandaImg from "../../assets/images/pixar_panda_avatar_1787838510229.jpg";

export default function StudentHome() {
  const currentUser = useAppStore(
    (state) => state.currentUser,
  ) as Student | null;
  const settings = useAppStore((state) => state.settings);

  return (
    <div className="max-w-6xl mx-auto space-y-8 flex-1 w-full h-full pb-10 relative overflow-hidden">
      {/* Floating Butterflies & Bees Background Effect */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-75">
        <div className="absolute top-10 left-[10%] text-3xl animate-[bounce_4s_infinite] duration-1000">🦋</div>
        <div className="absolute top-40 right-[15%] text-3xl animate-[pulse_3s_infinite]">🐝</div>
        <div className="absolute top-96 left-[5%] text-2xl animate-[bounce_5s_infinite]">🌸</div>
        <div className="absolute bottom-32 right-[10%] text-3xl animate-[bounce_6s_infinite]">🦋</div>
        <div className="absolute top-1/2 left-[50%] text-2xl animate-[pulse_4s_infinite]">✨</div>
        <div className="absolute bottom-10 left-[30%] text-3xl animate-[bounce_4.5s_infinite]">🐝</div>
      </div>

      <div className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] rounded-[40px] p-8 md:p-12 text-white shadow-xl relative overflow-hidden border-4 border-[#C4B5FD] z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black mb-4 drop-shadow-md">
              {settings.studentWelcomeTitle || "Chào mừng bạn đến với Vương quốc Pet tri thức!"}
            </h1>
            <p className="text-xl md:text-2xl font-bold text-white/90 drop-shadow-sm mb-6">
              {settings.studentWelcomeSubtitle || "Hãy học tập chăm chỉ để nuôi Pet lớn khôn mỗi ngày bạn nhé!"}
            </p>
            {currentUser ? (
              <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/30 font-black text-xl">
                Xin chào, {currentUser.fullName}! 👋
              </div>
            ) : (
              <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/30 font-black text-xl">
                Xin chào Khách! Hãy khám phá vương quốc nhé.
              </div>
            )}
          </div>
          <div className="w-full md:w-auto flex justify-center">
            <div className="max-w-md md:max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 transform hover:scale-105 transition-transform duration-300">
              <img 
                src={cutePetsImg} 
                alt="Vương quốc Pet" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-8 flex flex-col">
          {/* Intro & Instructions - Bunny Pet Corner & Pink/Rose Border */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border-4 border-[#EC4899] relative overflow-visible">
            <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#EC4899] transform rotate-12 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
              <img src={bunnyImg} alt="Cute Bunny" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h2 className="text-2xl font-black text-[#BE185D] border-b-4 border-[#FCE7F3] pb-4 flex items-center gap-3 pr-16">
              <BookOpen className="text-[#EC4899]" size={32} /> Giới thiệu & Hướng dẫn
            </h2>
            <div className="space-y-4 text-[#475569] font-medium leading-relaxed mt-4">
              <p>
                <strong className="text-[#BE185D]">Vương quốc Pet tri thức</strong> là một hành trình học tập đầy thú vị, nơi mỗi bài học toán học của bạn sẽ giúp cho một người bạn Pet đồng hành ngày càng trưởng thành và mạnh mẽ hơn.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Hoàn thành bài học để nhận <strong>Xu</strong> và <strong>Kinh nghiệm (XP)</strong>.</li>
                <li>Dùng Xu để mua thức ăn và chăm sóc Pet của bạn.</li>
                <li>Chăm chỉ mỗi ngày để duy trì <strong>Chuỗi học</strong> rực lửa!</li>
                <li>Nâng cấp Pet và mở khóa những vùng đất mới trên Bản đồ tri thức.</li>
              </ul>
              <div className="bg-[#FFFBEB] p-4 rounded-2xl border-2 border-[#FDE68A] text-[#B45309] text-sm mt-4">
                <strong>Miễn trừ trách nhiệm:</strong> Đây là nền tảng học tập demo. Nếu bạn truy cập bằng chế độ Khách, tiến trình của bạn sẽ không được lưu lại trên hệ thống.
              </div>
            </div>
          </div>

          {/* Thông tin - Cat Pet Corner & Purple Border */}
          <div className="bg-white rounded-[32px] border-4 border-[#8B5CF6] shadow-xl p-8 flex flex-col gap-4 relative overflow-visible">
            <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#8B5CF6] transform -rotate-12 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
              <img src={catImg} alt="Cute Cat" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h4 className="text-xl font-black text-[#6D28D9] flex items-center gap-3 pr-16">
              📜 Thông Tin
            </h4>
            <div className="space-y-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase">Người sáng lập</span>
                <span className="text-base font-bold text-[#1E3A8A]">{useAppStore.getState().settings.founder}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-400 uppercase">Trường Học</span>
                <span className="text-base font-bold text-[#1E3A8A]">{useAppStore.getState().settings.school}</span>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-dashed border-gray-200">
                <div className="w-10 h-10 bg-[#2563EB] rounded-xl flex items-center justify-center text-white text-lg">📞</div>
                <span className="text-sm font-black text-[#1E3A8A] tracking-wider">{useAppStore.getState().settings.zalo}</span>
              </div>
            </div>
            <div className="mt-auto pt-4 flex flex-col gap-2">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-gray-100">
                <p className="text-xs font-medium text-gray-500 italic">"Học để khám phá - Chăm Pet - Tiến hóa - Chinh phục tri thức!"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8 flex flex-col">
          {/* Stats - Dog Pet Corner & Emerald Border */}
          <div className="bg-white rounded-[32px] p-6 shadow-xl border-4 border-[#10B981] flex items-center justify-between relative overflow-visible">
            <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#10B981] transform rotate-6 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
              <img src={dogImg} alt="Cute Dog" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#ECFDF5] rounded-2xl flex items-center justify-center border-4 border-[#A7F3D0]">
                <Users className="text-[#10B981]" size={32} />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#065F46] uppercase">
                  Lượt truy cập
                </h3>
                <p className="text-3xl font-black text-[#059669]">1,284</p>
              </div>
            </div>
          </div>

          {/* Leaderboard - Panda Pet Corner & Amber Border */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border-4 border-[#F59E0B] flex-1 relative overflow-visible">
            <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#F59E0B] transform -rotate-6 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
              <img src={pandaImg} alt="Cute Panda" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h2 className="text-2xl font-black text-[#D97706] border-b-4 border-[#FEF9C3] pb-4 mb-6 flex items-center gap-3 pr-16">
              <Trophy className="text-[#F59E0B]" size={32} /> Bảng Vàng Thành Tích
            </h2>
            <div className="space-y-4">
              {[
                { name: "Nguyễn Văn A", xp: 450, rank: 1 },
                { name: "Trần Thị B", xp: 420, rank: 2 },
                { name: "Lê Hoàng C", xp: 390, rank: 3 },
                { name: "Phạm Minh D", xp: 350, rank: 4 },
                { name: "Hoàng Ánh E", xp: 310, rank: 5 },
              ].map((user) => (
                <div
                  key={user.rank}
                  className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl border-2 border-[#E2E8F0] hover:border-[#FCD34D] transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                      user.rank === 1
                        ? "bg-[#F59E0B] shadow-[0_4px_0_#D97706]"
                        : user.rank === 2
                          ? "bg-[#94A3B8] shadow-[0_4px_0_#64748B]"
                          : user.rank === 3
                            ? "bg-[#D97706] shadow-[0_4px_0_#B45309]"
                            : "bg-[#E2E8F0] text-[#64748B]"
                    }`}
                  >
                    {user.rank}
                  </div>
                  <div className="flex-1 font-bold text-[#1E3A8A]">
                    {user.name}
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A]">
                    <Star className="text-[#F59E0B] fill-[#F59E0B]" size={14} />
                    <span className="font-black text-[#D97706] text-sm">
                      {user.xp} XP
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
