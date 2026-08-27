import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Student } from '../../types';
import { Play, Star, Heart, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import PetAvatar from '../../components/PetAvatar';
import catImg from '../../assets/images/pixar_cat_avatar_1787838476517.jpg';

export default function PetWorld() {
  const currentUser = useAppStore((state) => state.currentUser) as Student;
  const pets = useAppStore((state) => state.pets);
  const resumePet = useAppStore((state) => state.resumePet);
  const navigate = useNavigate();

  const ownedPets = currentUser.ownedPets || [];

  const handleResume = (instanceId: string) => {
    resumePet(instanceId);
    navigate('/student/pet');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-full flex flex-col">
      <div className="bg-white p-6 rounded-[32px] shadow-xl border-4 border-[#8B5CF6] flex justify-between items-center relative overflow-visible">
         <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#8B5CF6] transform -rotate-12 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
           <img src={catImg} alt="Cute Cat" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
         </div>
         <h1 className="text-3xl font-black text-[#1E3A8A] flex items-center gap-3 pr-16">
            🌍 Thế giới Pet của em
         </h1>
         <button onClick={() => navigate('/student/dashboard?new=true')} className="px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-2xl shadow-[0_4px_0_#047857] hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 relative z-10">
            + Nhận nuôi Pet mới
         </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-8">
        {ownedPets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white/50 rounded-[32px] border-4 border-dashed border-[#93C5FD]">
            <span className="text-6xl mb-4">🐾</span>
            <p className="text-xl font-bold text-[#64748B]">Em chưa nuôi Pet nào. Hãy nhận nuôi một bé nhé!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ownedPets.map(petInstance => {
              const template = pets.find(p => p.id === petInstance.templateId);
              if (!template) return null;
              
              const isCurrent = currentUser.currentPetId === petInstance.id;

              return (
                <div key={petInstance.id} className={`bg-white rounded-[32px] overflow-hidden shadow-xl border-4 ${isCurrent ? 'border-[#34D399]' : 'border-[#DBEAFE]'} flex flex-col`}>
                  <div className={`p-6 flex justify-center items-center ${isCurrent ? 'bg-[#D1FAE5]' : 'bg-[#E0F2FE]'}`}>
                    <PetAvatar src={template.baseImageUrl} className="w-32 h-32 text-6xl" imgClassName="w-32 h-32 object-contain filter drop-shadow-xl hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-black text-[#1E3A8A]">{petInstance.name}</h3>
                        <p className="text-sm font-bold text-[#64748B]">{template.name}</p>
                      </div>
                      <div className="bg-[#FEF3C7] px-3 py-1 rounded-xl border-2 border-[#FCD34D]">
                        <span className="font-black text-[#B45309]">Lv.{petInstance.level}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <Heart size={16} className="text-[#F43F5E]" />
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F43F5E] rounded-full" style={{ width: `${petInstance.happiness}%` }}></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-[#F59E0B]" />
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${petInstance.hunger}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto">
                      {isCurrent ? (
                        <button disabled className="w-full py-3 bg-gray-100 text-gray-500 font-bold rounded-xl border-2 border-gray-200">
                          Đang chăm sóc
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleResume(petInstance.id)}
                          className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold rounded-xl shadow-[0_4px_0_#1D4ED8] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                          <Play size={20} fill="currentColor" /> Tiếp tục nuôi
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
