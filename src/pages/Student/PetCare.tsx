import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Student } from '../../types';
import { mockFoods } from '../../data/mockData';
import { Star, Smile, Zap, Heart, Utensils, Gamepad2, Info } from 'lucide-react';
import PetAvatar from '../../components/PetAvatar';
import { getPetImage } from '../../lib/petUtils';
import { useNavigate } from 'react-router';

export default function PetCare() {
  const currentUser = useAppStore((state) => state.currentUser) as Student;
  const pets = useAppStore((state) => state.pets);
  const settings = useAppStore((state) => state.settings);
  const feedPet = useAppStore((state) => state.feedPet);
  const miniGames = useAppStore((state) => state.miniGames);
  const playMiniGameReward = useAppStore((state) => state.playMiniGameReward);
  const navigate = useNavigate();
  const petInfo = pets.find(p => p.id === currentUser.petId);
  const [activeTab, setActiveTab] = useState<'FEED' | 'PLAY'>('FEED');

  if (!currentUser.petId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
        <div className="text-6xl mb-4">🐾</div>
        <h2 className="text-2xl font-black text-[#1E3A8A]">Bạn chưa chọn Pet!</h2>
        <p className="text-[#64748B] font-bold">Hãy quay lại mục Nhiệm vụ để chọn cho mình một người bạn đồng hành nhé.</p>
      </div>
    );
  }

  const petImageUrl = getPetImage(petInfo, currentUser.petLevel, settings.globalEvolutions);

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex-1 flex flex-col h-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[32px] shadow-xl border-4 border-[#DBEAFE]">
         <h1 className="text-3xl font-black text-[#1E3A8A] flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FCE7F3] rounded-full flex items-center justify-center border-4 border-[#F9A8D4]">
              <Heart className="text-[#BE185D] fill-[#BE185D]" size={24} />
            </div>
            Chăm sóc {currentUser.petName}
         </h1>
         <div className="flex items-center space-x-2 bg-[#FFFBEB] text-[#D97706] px-6 py-3 rounded-2xl font-black border-4 border-[#FDE68A] shadow-inner">
            <span className="text-2xl">🪙</span>
            <span className="text-xl">{currentUser.points} điểm</span>
         </div>
      </div>

      <div className="bg-gradient-to-r from-[#3B82F6] to-[#10B981] p-6 rounded-[32px] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 border-4 border-[#A7F3D0]">
         <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shrink-0 border-2 border-white/30">
              🎯
            </div>
            <div>
              <h3 className="text-xl font-black mb-1">Săn điểm để nuôi Pet</h3>
              <p className="text-sm font-bold text-white/90">Làm bài tập trên Bản đồ học tập để nhận Xu & XP chăm sóc Pet!</p>
            </div>
         </div>
         <button 
           onClick={() => navigate('/student/map')}
           className="px-6 py-4 bg-white text-[#1E3A8A] font-black rounded-2xl shadow-lg hover:bg-[#FEF3C7] hover:scale-105 transition-all flex items-center gap-2 shrink-0 border-4 border-white"
         >
           🗺️ Chọn bản đồ học tập
         </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Pet Avatar Area */}
        <div className="bg-gradient-to-b from-[#E0F2FE] to-[#F0F9FF] rounded-[40px] p-8 flex flex-col items-center justify-center shadow-xl relative overflow-hidden border-4 border-[#BAE6FD]">
          <div className="absolute inset-0 bg-white opacity-40" style={{ backgroundImage: 'radial-gradient(#93C5FD 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
          
          <div className="w-48 h-48 animate-bounce relative z-10 drop-shadow-xl flex items-center justify-center" style={{ animationDuration: '4s' }}>
             <PetAvatar src={petImageUrl} className="w-full h-full text-[120px]" imgClassName="w-full h-full object-contain drop-shadow-lg" />
          </div>
          <div className="absolute top-6 left-6 bg-white px-5 py-2 rounded-2xl shadow-md border-4 border-[#FDE68A] flex items-center gap-2 z-10">
            <Star className="text-[#F59E0B] fill-[#F59E0B]" size={20} />
            <span className="font-black text-[#92400E]">Cấp {currentUser.petLevel}</span>
          </div>
          
          <div className="mt-8 w-full space-y-5 bg-white p-6 rounded-[32px] border-4 border-[#DBEAFE] shadow-lg relative z-10">
             <div>
                <div className="flex justify-between text-xs mb-2 font-black text-[#64748B] uppercase tracking-wider">
                  <span className="flex items-center gap-2"><Utensils size={16} className="text-[#F59E0B]"/> Độ no</span>
                  <span>{currentUser.petHunger}%</span>
                </div>
                <div className="h-4 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0] shadow-inner">
                  <div className="h-full bg-[#F59E0B] rounded-full transition-all duration-500" style={{ width: `${currentUser.petHunger}%` }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-xs mb-2 font-black text-[#64748B] uppercase tracking-wider">
                  <span className="flex items-center gap-2"><Smile size={16} className="text-[#10B981]"/> Vui vẻ</span>
                  <span>{currentUser.petHappiness}%</span>
                </div>
                <div className="h-4 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0] shadow-inner">
                  <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${currentUser.petHappiness}%` }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-xs mb-2 font-black text-[#64748B] uppercase tracking-wider">
                  <span className="flex items-center gap-2"><Zap size={16} className="text-[#3B82F6]"/> Năng lượng</span>
                  <span>{currentUser.petEnergy}%</span>
                </div>
                <div className="h-4 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0] shadow-inner">
                  <div className="h-full bg-[#3B82F6] rounded-full transition-all duration-500" style={{ width: `${currentUser.petEnergy}%` }}></div>
                </div>
             </div>
          </div>
        </div>

        {/* Interaction Area */}
        <div className="bg-white rounded-[40px] shadow-xl border-4 border-[#DBEAFE] overflow-hidden flex flex-col">
          <div className="flex border-b-4 border-[#DBEAFE] bg-[#F8FAFC]">
            <button 
              onClick={() => setActiveTab('FEED')}
              className={`flex-1 py-5 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE] uppercase tracking-wide ${activeTab === 'FEED' ? 'bg-white text-[#2563EB] shadow-inner' : 'text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]'}`}
            >
              <Utensils size={24} strokeWidth={3} /> Cho Ăn
            </button>
            <button 
              onClick={() => setActiveTab('PLAY')}
              className={`flex-1 py-5 font-black flex items-center justify-center gap-2 transition-all uppercase tracking-wide ${activeTab === 'PLAY' ? 'bg-white text-[#2563EB] shadow-inner' : 'text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]'}`}
            >
              <Gamepad2 size={24} strokeWidth={3} /> Vui Chơi
            </button>
          </div>

          <div className="p-8 flex-1 bg-white">
            {activeTab === 'FEED' && (
               <div className="space-y-6">
                 <div className="flex items-start gap-3 bg-[#EFF6FF] p-4 rounded-2xl border border-[#BFDBFE]">
                   <Info className="text-[#3B82F6] flex-shrink-0 mt-0.5" size={20} />
                   <p className="text-sm text-[#1E3A8A] font-medium">Mua thức ăn bằng Điểm để tăng độ no và vui vẻ cho Pet nhé!</p>
                 </div>

                 <div className="bg-[#FFFBEB] p-5 rounded-3xl border-2 border-[#FDE68A] space-y-3">
                   <h4 className="font-black text-[#92400E] flex items-center gap-2 text-base">
                     <Star size={20} className="text-[#F59E0B] fill-[#F59E0B]" /> Quy định về độ no, thời gian đói & Tiến hoá của Pet
                   </h4>
                   <ul className="text-xs font-bold text-[#78350F] space-y-2 list-disc pl-4">
                     <li><strong>Thời gian đói:</strong> Độ no của Pet sẽ giảm <strong>10% sau mỗi 1 giờ</strong> hoặc sau mỗi bài học hoặc sau mỗi lần thực hiện nhiệm vụ / chơi game.</li>
                     <li><strong>Trạng thái đói:</strong> Khi độ no chỉ còn <strong>30%</strong>, phím tắt Pet sẽ hiện thông báo: <em>"Pet đói rồi bạn ơi. Hãy cho Pet ăn nào"</em>. Học sinh cần sử dụng điểm thưởng kiếm được từ việc làm bài tập để mua thức ăn cho Pet.</li>
                     <li><strong>Tiến hoá Pet:</strong> Số lần cho ăn để tiến hoá được quản lý và cài đặt trực tiếp bởi Quản trị viên (Admin), đảm bảo lộ trình phát triển của Pet theo đúng quy định hệ thống.</li>
                   </ul>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockFoods.map(food => (
                      <div key={food.id} className="bg-white border-4 border-[#E2E8F0] rounded-[24px] p-5 flex flex-col items-center text-center shadow-sm hover:border-[#93C5FD] transition-all hover:-translate-y-1 hover:shadow-md">
                        <div className="text-5xl mb-3 drop-shadow-md">{food.icon || '🍖'}</div>
                        <h4 className="font-black text-[#1E3A8A] mb-1 uppercase tracking-wide">{food.name}</h4>
                        <div className="text-xs font-bold text-[#64748B] flex items-center gap-2 mb-4">
                           <span className="bg-[#FEF3C7] text-[#D97706] px-2 py-1 rounded-lg">+{food.hungerRestore}% no</span>
                           <span className="bg-[#D1FAE5] text-[#059669] px-2 py-1 rounded-lg">+{food.happinessRestore}% vui</span>
                        </div>
                        <button 
                          disabled={currentUser.points < food.price || currentUser.petHunger >= 100}
                          onClick={() => {
                            if (currentUser.points >= food.price) {
                              feedPet(food.hungerRestore, food.happinessRestore, food.price);
                            } else {
                              alert("Bạn không đủ điểm rồi!");
                            }
                          }}
                          className={`w-full py-3 font-black rounded-xl uppercase text-sm tracking-widest transition-all ${
                            currentUser.points >= food.price && currentUser.petHunger < 100
                              ? 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white shadow-[0_4px_0_#1E3A8A] hover:translate-y-1 hover:shadow-none active:shadow-none active:translate-y-1' 
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Mua {food.price} 🪙
                        </button>
                      </div>
                    ))}
                 </div>
               </div>
            )}

            {activeTab === 'PLAY' && (
               <div className="space-y-6">
                 <div className="flex items-start gap-3 bg-[#FEF3C7] p-4 rounded-2xl border border-[#FDE68A]">
                   <Info className="text-[#D97706] flex-shrink-0 mt-0.5" size={20} />
                   <p className="text-sm text-[#92400E] font-medium">Hoàn thành mỗi trò chơi trong Phòng Game sẽ tự động cộng <strong className="font-black">+20% No</strong> và <strong className="font-black">+20% Vui vẻ</strong> cho Pet!</p>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {(miniGames || []).map(game => (
                     <div key={game.id} className="bg-white border-4 border-[#E2E8F0] rounded-[24px] p-5 flex flex-col items-center text-center shadow-sm hover:border-[#93C5FD] transition-all hover:-translate-y-1 hover:shadow-md">
                       <div className="w-16 h-16 bg-[#EFF6FF] text-[#3B82F6] rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                         <Gamepad2 size={32} />
                       </div>
                       <h4 className="font-black text-[#1E3A8A] mb-1 uppercase tracking-wide">{game.title}</h4>
                       <p className="text-xs font-bold text-[#64748B] mb-4 line-clamp-2">{game.description}</p>
                       <button 
                         onClick={() => {
                           playMiniGameReward();
                           navigate('/student/minigame');
                         }}
                         className="w-full py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black rounded-xl uppercase text-sm tracking-widest shadow-[0_4px_0_#047857] hover:translate-y-1 hover:shadow-none transition-all"
                       >
                         🎮 Chơi & Nhận Thưởng
                       </button>
                     </div>
                   ))}

                   <div className="bg-white border-4 border-[#E2E8F0] rounded-[24px] p-5 flex flex-col items-center text-center shadow-sm hover:border-[#93C5FD] transition-all hover:-translate-y-1 hover:shadow-md">
                     <div className="w-16 h-16 bg-[#FEF3C7] text-[#D97706] rounded-2xl flex items-center justify-center mb-3 shadow-inner">
                       <Zap size={32} />
                     </div>
                     <h4 className="font-black text-[#1E3A8A] mb-1 uppercase tracking-wide">Đập Chuột Tri Thức</h4>
                     <p className="text-xs font-bold text-[#64748B] mb-4">Luyện phản xạ và ôn tập kiến thức nhanh.</p>
                     <button 
                       onClick={() => {
                         playMiniGameReward();
                         navigate('/student/minigame');
                       }}
                       className="w-full py-3 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black rounded-xl uppercase text-sm tracking-widest shadow-[0_4px_0_#047857] hover:translate-y-1 hover:shadow-none transition-all"
                     >
                       🎮 Chơi & Nhận Thưởng
                     </button>
                   </div>
                 </div>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
