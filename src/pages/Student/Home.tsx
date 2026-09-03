import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Student } from "../../types";
import { Trophy, BookOpen, Star, CheckCircle2, Flame } from "lucide-react";
import { useNavigate } from "react-router";
import PetAvatar from "../../components/PetAvatar";
import cutePetsImg from "../../assets/images/cute_pets_banner_1787838175550.jpg";
import bunnyImg from "../../assets/images/pixar_bunny_avatar_1787838459749.jpg";
import catImg from "../../assets/images/pixar_cat_avatar_1787838476517.jpg";
import pandaImg from "../../assets/images/pixar_panda_avatar_1787838510229.jpg";

export default function StudentHome() {
  const currentUser = useAppStore(
    (state) => state.currentUser,
  ) as Student | null;
  const settings = useAppStore((state) => state.settings);
  const ratings = useAppStore((state) => state.ratings);
  const addRating = useAppStore((state) => state.addRating);
  const pets = useAppStore((state) => state.pets);
  const selectPet = useAppStore((state) => state.selectPet);
  const students = useAppStore((state) => state.students);
  const navigate = useNavigate();

  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const [showPetModal, setShowPetModal] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [petNameInput, setPetNameInput] = useState("");

  const totalRatings = (ratings || []).length;
  const avgRating = totalRatings > 0 ? (ratings.reduce((acc, r) => acc + r.stars, 0) / totalRatings).toFixed(1) : '5.0';

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRating(selectedStars, comment);
    setComment('');
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  const handleSelectPet = () => {
    if (selectedPetId && petNameInput.trim()) {
      selectPet(selectedPetId, petNameInput.trim());
      setShowPetModal(false);
      navigate('/student/pet');
    }
  };

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
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/30 font-black text-xl">
                  Xin chào, {currentUser.fullName}! 👋
                </div>
                <button
                  onClick={() => {
                    if (currentUser.petId) {
                      navigate('/student/pet');
                    } else {
                      setShowPetModal(true);
                    }
                  }}
                  className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black rounded-2xl shadow-[0_6px_0_#B45309] hover:translate-y-1 hover:shadow-[0_2px_0_#B45309] active:translate-y-2 active:shadow-none transition-all text-lg flex items-center gap-3 animate-bounce"
                >
                  {currentUser.petId ? "🐾 Vào nuôi Pet" : "🐾 Bắt đầu nuôi"}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/30 font-black text-xl">
                  Xin chào Khách! Hãy khám phá vương quốc nhé.
                </div>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black rounded-2xl shadow-[0_6px_0_#B45309] transition-all text-lg flex items-center gap-3"
                >
                  🔑 Đăng nhập ngay
                </button>
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
          {/* Leaderboard - Panda Pet Corner & Amber Border */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border-4 border-[#F59E0B] relative overflow-visible">
            <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#F59E0B] transform -rotate-6 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
              <img src={pandaImg} alt="Cute Panda" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h2 className="text-2xl font-black text-[#D97706] border-b-4 border-[#FEF9C3] pb-4 mb-6 flex items-center gap-3 pr-16">
              <Trophy className="text-[#F59E0B]" size={32} /> Bảng Vàng Thành Tích
            </h2>
            <div className="space-y-4">
              {(() => {
                const topStudents = [...(students || [])]
                  .filter(s => s.role === 'STUDENT')
                  .sort((a, b) => {
                    const levelA = a.petLevel || 1;
                    const levelB = b.petLevel || 1;
                    if (levelB !== levelA) return levelB - levelA;
                    const xpA = a.xp || 0;
                    const xpB = b.xp || 0;
                    return xpB - xpA;
                  })
                  .slice(0, 3);

                if (topStudents.length === 0) {
                  return (
                    <p className="text-center text-gray-400 font-bold py-4">Chưa có học sinh nào trên bảng vàng.</p>
                  );
                }

                return topStudents.map((studentItem, index) => {
                  const rank = index + 1;
                  return (
                    <div
                      key={studentItem.id}
                      className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl border-2 border-[#E2E8F0] hover:border-[#FCD34D] transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-white ${
                          rank === 1
                            ? "bg-[#F59E0B] shadow-[0_4px_0_#D97706]"
                            : rank === 2
                              ? "bg-[#94A3B8] shadow-[0_4px_0_#64748B]"
                              : "bg-[#D97706] shadow-[0_4px_0_#B45309]"
                        }`}
                      >
                        {rank}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-[#1E3A8A]">{studentItem.fullName}</div>
                        <div className="text-xs font-bold text-gray-400">🐾 Pet Cấp {studentItem.petLevel || 1}</div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#FFFBEB] px-3 py-1 rounded-full border border-[#FDE68A]">
                        <Star className="text-[#F59E0B] fill-[#F59E0B]" size={14} />
                        <span className="font-black text-[#D97706] text-sm">
                          {studentItem.xp || 0} XP
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>

          {/* Website Usefulness Rating Widget */}
          <div className="bg-white rounded-[32px] p-8 shadow-xl border-4 border-[#3B82F6] relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-black text-[#1E3A8A] flex items-center gap-2">
                <Star className="text-[#F59E0B] fill-[#F59E0B]" size={28} /> Đánh Giá Website
              </h3>
              <div className="flex items-center gap-2 bg-[#EFF6FF] px-3 py-1.5 rounded-2xl border-2 border-[#BFDBFE]">
                <span className="text-2xl font-black text-[#1D4ED8]">{avgRating}</span>
                <div className="flex flex-col text-left">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-[#F59E0B]" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500">{totalRatings} lượt đánh giá</span>
                </div>
              </div>
            </div>

            <p className="text-sm font-medium text-gray-600 mb-4">
              Bạn đánh giá mức độ hữu ích của website học tập này như thế nào? Hãy cho chúng tôi biết ý kiến của bạn nhé!
            </p>

            {/* Rating Breakdown Statistics */}
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border-2 border-gray-100 mb-6 space-y-2">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">Thống kê chi tiết các mức độ đánh giá:</h4>
              {[5, 4, 3, 2, 1].map((s) => {
                const count = (ratings || []).filter(r => r.stars === s).length;
                const percentage = totalRatings > 0 ? Math.round((count / totalRatings) * 100) : 0;
                return (
                  <div key={s} className="flex items-center gap-3 text-xs font-bold">
                    <div className="w-16 flex items-center gap-1 text-[#F59E0B]">
                      <span>{s}</span> <Star size={12} className="fill-[#F59E0B]" />
                    </div>
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden relative">
                      <div className="absolute top-0 left-0 bottom-0 bg-[#3B82F6] rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="w-20 text-right text-gray-600 font-black">
                      {count} lượt ({percentage}%)
                    </div>
                  </div>
                );
              })}
            </div>

            {successMsg && (
              <div className="bg-[#ECFDF5] border-2 border-[#6EE7B7] text-[#047857] p-3 rounded-xl font-bold mb-4 flex items-center gap-2 text-sm animate-fade-in">
                <CheckCircle2 size={18} /> Cảm ơn bạn đã đánh giá mức độ hữu ích của website!
              </div>
            )}

            <form onSubmit={handleRatingSubmit} className="space-y-4">
              <div className="space-y-2">
                {[
                  { stars: 5, label: '5 sao - Cực kì hữu ích', isHot: true },
                  { stars: 4, label: '4 sao - Rất hữu ích', isHot: true },
                  { stars: 3, label: '3 sao - Hữu ích', isHot: false },
                  { stars: 2, label: '2 sao - Bình thường', isHot: false },
                  { stars: 1, label: '1 sao - Không hữu ích', isHot: false },
                ].map((item) => (
                  <label
                    key={item.stars}
                    onClick={() => setSelectedStars(item.stars)}
                    className={`flex items-center justify-between p-3 rounded-2xl border-3 cursor-pointer transition-all ${
                      selectedStars === item.stars
                        ? 'bg-[#EFF6FF] border-[#3B82F6] shadow-sm'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="ratingStars"
                        checked={selectedStars === item.stars}
                        onChange={() => setSelectedStars(item.stars)}
                        className="w-4 h-4 text-[#3B82F6]"
                      />
                      <div className="flex text-[#F59E0B]">
                        {[...Array(item.stars)].map((_, i) => (
                          <Star key={i} size={16} className="fill-[#F59E0B]" />
                        ))}
                      </div>
                      <span className="font-bold text-gray-800 text-sm">{item.label}</span>
                    </div>

                    {item.isHot && (
                      <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full animate-bounce shadow-md flex items-center gap-1">
                        <Flame size={12} className="fill-white" /> HOT
                      </span>
                    )}
                  </label>
                ))}
              </div>

              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Nhập góp ý hoặc nhận xét của bạn (không bắt buộc)..."
                  className="w-full p-3 rounded-2xl border-2 border-gray-200 text-sm font-medium focus:border-[#3B82F6] outline-none resize-none"
                  rows={2}
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#3B82F6] text-white font-black rounded-2xl hover:bg-[#2563EB] shadow-[0_4px_0_#1D4ED8] hover:translate-y-0.5 transition-all text-sm uppercase tracking-wider"
              >
                Gửi đánh giá ngay
              </button>
            </form>
          </div>
        </div>
      </div>

      {showPetModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] border-4 border-[#3B82F6] p-8 max-w-2xl w-full shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-[#1E3A8A] text-center mb-2">
              Chọn Pet Đồng Hành
            </h2>
            <p className="text-gray-500 font-medium text-center mb-6">
              Hãy chọn một người bạn thú cưng đáng yêu để bắt đầu hành trình nuôi dưỡng và học tập nhé!
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`flex flex-col items-center p-4 rounded-3xl transition-all border-4 ${
                    selectedPetId === pet.id
                      ? "bg-[#EFF6FF] border-[#3B82F6] scale-105 shadow-lg"
                      : "bg-white border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="w-20 h-20 mb-3 flex items-center justify-center">
                    <PetAvatar src={pet.baseImageUrl} className="w-full h-full text-5xl" imgClassName="w-full h-full object-contain" />
                  </div>
                  <span className="font-black text-[#1E3A8A] text-sm text-center">
                    {pet.name}
                  </span>
                </button>
              ))}
            </div>

            {selectedPetId && (
              <div className="space-y-4 pt-4 border-t-2 border-gray-100 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Đặt tên cho Pet của bạn:
                  </label>
                  <input
                    type="text"
                    value={petNameInput}
                    onChange={(e) => setPetNameInput(e.target.value)}
                    placeholder="Ví dụ: Bé Thỏ Thông Minh..."
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-2 border-gray-200 focus:border-[#3B82F6] focus:bg-white focus:outline-none font-bold text-[#1E3A8A]"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowPetModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all"
              >
                Hủy
              </button>
              <button
                onClick={handleSelectPet}
                disabled={!selectedPetId || !petNameInput.trim()}
                className="flex-1 py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-300 text-white font-black rounded-2xl shadow-[0_4px_0_#1D4ED8] transition-all"
              >
                Xác nhận & Nuôi Pet 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
