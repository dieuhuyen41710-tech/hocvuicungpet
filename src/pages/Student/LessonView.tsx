import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppStore } from '../../store/useAppStore';
import { calculateLessonReward } from '../../utils/rewardEngine';
import { ArrowLeft, PlayCircle, BookOpen, CheckCircle, Gamepad2 } from 'lucide-react';
import clsx from 'clsx';
import { getEmbedUrl } from '../../utils/embed';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lessons, completeLesson, addPointsAndXP, completedLessons } = useAppStore();
  
  const lesson = lessons.find(l => l.id === id);
  const isCompleted = lesson ? completedLessons.includes(lesson.id) : false;
  
  const hasContent = lesson?.content && lesson.content.trim().length > 0;
  
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'CONTENT' | 'GAME'>('VIDEO');

  if (!lesson) return <div>Bài học không tồn tại</div>;

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      completeLesson(lesson.id);
      const reward = calculateLessonReward();
      addPointsAndXP(reward.points, reward.xp);
      alert(`Chúc mừng! Bạn nhận được ${reward.points} điểm và ${reward.xp} XP. Pet đã được trừ 10% độ no.`);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex-1 flex flex-col h-full">
      <button onClick={() => navigate('/student/map')} className="flex items-center text-[#3B82F6] hover:text-[#1E40AF] font-black uppercase text-sm tracking-widest transition-colors w-fit">
        <ArrowLeft className="mr-2" size={20} strokeWidth={3} /> QUAY LẠI BẢN ĐỒ
      </button>

      <div className="bg-white rounded-[40px] border-4 border-[#DBEAFE] shadow-xl overflow-hidden flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[#F8FAFC] opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="bg-white p-6 border-b-4 border-[#DBEAFE] relative z-10">
           <h1 className="text-3xl font-black text-[#1E3A8A] mb-2 uppercase">{lesson.name}</h1>
           <p className="text-[#64748B] font-bold">{lesson.description}</p>
        </div>

        <div className="flex border-b-4 border-[#DBEAFE] relative z-10 bg-[#F8FAFC]">
           <button 
             onClick={() => setActiveTab('VIDEO')}
             className={clsx("flex-1 py-4 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE]", activeTab === 'VIDEO' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]")}
           >
             <PlayCircle size={24} strokeWidth={3} /> VIDEO BÀI GIẢNG
           </button>
           {hasContent && (
             <button 
               onClick={() => setActiveTab('CONTENT')}
               className={clsx("flex-1 py-4 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE]", activeTab === 'CONTENT' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]")}
             >
               <BookOpen size={24} strokeWidth={3} /> ĐỌC NỘI DUNG
             </button>
           )}
           {lesson.gameUrl && (
             <button 
               onClick={() => setActiveTab('GAME')}
               className={clsx("flex-1 py-4 font-black flex items-center justify-center gap-2 transition-all", activeTab === 'GAME' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]")}
             >
               <Gamepad2 size={24} strokeWidth={3} /> MINI GAME
             </button>
           )}
        </div>

        <div className="p-6 md:p-10 flex-1 relative z-10 overflow-y-auto">
          {activeTab === 'VIDEO' && (
            <div className="animate-fade-in space-y-8 max-w-5xl mx-auto w-full">
              {lesson.videoUrl ? (
                <div className="aspect-video rounded-[32px] overflow-hidden bg-[#0F172A] border-4 border-[#E2E8F0] shadow-2xl">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={getEmbedUrl(lesson.videoUrl)} 
                    title="Video bài giảng" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="aspect-video bg-[#F1F5F9] rounded-[32px] border-4 border-dashed border-[#CBD5E1] flex items-center justify-center text-[#94A3B8] font-bold">
                  Không có video cho bài học này
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                {hasContent && (
                  <button 
                    onClick={() => setActiveTab('CONTENT')}
                    className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black text-xl px-12 py-5 rounded-3xl shadow-[0_8px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_4px_0_#1E3A8A] transition-all active:translate-y-2 active:shadow-none"
                  >
                    ĐỌC NỘI DUNG 📖
                  </button>
                )}
                {!isCompleted ? (
                  <button 
                    onClick={handleCompleteLesson}
                    className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black text-xl px-12 py-5 rounded-3xl shadow-[0_8px_0_#064E3B] hover:translate-y-1 hover:shadow-[0_4px_0_#064E3B] transition-all active:translate-y-2 active:shadow-none flex items-center gap-3 uppercase tracking-wide"
                  >
                    <CheckCircle size={28} strokeWidth={3} /> Hoàn thành bài học
                  </button>
                ) : (
                  <div className="bg-[#DCFCE7] text-[#166534] font-black text-xl px-8 py-5 rounded-3xl border-4 border-[#86EFAC] flex items-center gap-2">
                    <CheckCircle size={24} /> ĐÃ HOÀN THÀNH BÀI HỌC
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'CONTENT' && hasContent && (
            <div className="animate-fade-in space-y-8 max-w-5xl mx-auto w-full">
               <div className="bg-white p-8 rounded-[32px] border-4 border-[#E2E8F0] shadow-sm space-y-4">
                  <h3 className="text-2xl font-black text-[#1E3A8A] border-b-2 border-gray-100 pb-3 flex items-center gap-3">
                    <BookOpen className="text-blue-600" size={28} />
                    Kiến thức trọng tâm: {lesson.name}
                  </h3>
                  <div className="whitespace-pre-wrap text-base font-medium text-gray-700 leading-relaxed pt-2">
                    {lesson.content}
                  </div>
               </div>

               <div className="pt-8 flex justify-center border-t-4 border-dashed border-[#E2E8F0]">
                 {!isCompleted ? (
                   <button 
                     onClick={handleCompleteLesson}
                     className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black text-xl px-12 py-5 rounded-3xl shadow-[0_8px_0_#064E3B] hover:translate-y-1 hover:shadow-[0_4px_0_#064E3B] transition-all active:translate-y-2 active:shadow-none flex items-center gap-3 uppercase tracking-wide"
                   >
                     <CheckCircle size={28} strokeWidth={3} /> Hoàn thành bài học
                   </button>
                 ) : (
                   <div className="bg-[#DCFCE7] text-[#166534] font-black text-xl px-8 py-5 rounded-3xl border-4 border-[#86EFAC] flex items-center gap-2">
                     <CheckCircle size={24} /> ĐÃ HOÀN THÀNH BÀI HỌC
                   </div>
                 )}
               </div>
            </div>
          )}

          {activeTab === 'GAME' && lesson.gameUrl && (
            <div className="animate-fade-in p-6 bg-white h-full flex flex-col items-center justify-center relative min-h-[500px]">
              <iframe 
                src={getEmbedUrl(lesson.gameUrl)} 
                className="w-full h-full absolute inset-0 border-0 rounded-b-[36px]"
                title="Mini Game"
                allow="autoplay; fullscreen"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
