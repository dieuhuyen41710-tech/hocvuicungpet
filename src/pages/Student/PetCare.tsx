import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Student } from '../../types';
import { mockFoods } from '../../data/mockData';
import { Star, Smile, Zap, Heart, Utensils, Gamepad2, Info } from 'lucide-react';
import PetAvatar from '../../components/PetAvatar';
import { getPetImage } from '../../lib/petUtils';

export default function PetCare() {
  const currentUser = useAppStore((state) => state.currentUser) as Student;
  const pets = useAppStore((state) => state.pets);
  const settings = useAppStore((state) => state.settings);
  const feedPet = useAppStore((state) => state.feedPet);
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
               <div className="flex flex-col items-center justify-center h-full text-center space-y-6 py-8">
                  <div className="w-24 h-24 bg-[#FEF3C7] rounded-[32px] border-4 border-[#FDE68A] flex items-center justify-center mb-2 shadow-inner transform rotate-3">
                     <Gamepad2 className="text-[#D97706]" size={48} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-black text-[#D97706] uppercase tracking-wide">Tính năng đang xây dựng!</h3>
                  <p className="text-[#B45309] font-bold max-w-sm">
                    Các mini-game chơi cùng Pet sẽ sớm được ra mắt. Hãy tích lũy năng lượng nhé!
                  </p>
                  <button className="px-8 py-4 bg-[#F3F4F6] text-[#9CA3AF] font-black rounded-2xl border-4 border-[#E5E7EB] cursor-not-allowed uppercase tracking-wider text-sm mt-4">
                    Sắp ra mắt
                  </button>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
