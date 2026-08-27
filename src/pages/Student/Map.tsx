import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAppStore } from '../../store/useAppStore';
import { MapNode, Lesson } from '../../types';
import { Map as MapIcon, Lock, CheckCircle2, PlayCircle, Star, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';
import bunnyImg from '../../assets/images/pixar_bunny_avatar_1787838459749.jpg';
import dragonImg from '../../assets/images/pixar_dragon_avatar_178783843114.jpg'; // or mock
import dogImg from '../../assets/images/pixar_dog_avatar_1787838495530.jpg';

export default function StudentMap() {
  const { subjects, mapNodes, lessons, completedLessons, currentUser } = useAppStore();
  const navigate = useNavigate();
  
  const userClass = (currentUser as any)?.class || '7A';
  const userGrade = userClass.replace(/\D/g, '') || '7'; // extract just the number part (e.g. '7A' -> '7')

  const [selectedGrade, setSelectedGrade] = useState(userGrade);
  const availableGrades = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  
  // Filter subjects by selected grade
  const filteredSubjects = subjects.filter(s => {
    if (!s.grade || s.grade.includes('Tất cả') || s.grade === 'Tất cả khối') return true;
    const subGradeNum = s.grade.replace(/\D/g, '');
    return subGradeNum === selectedGrade || s.grade === selectedGrade || !subGradeNum;
  }); // fallback to all if no grade mapped

  // Ensure activeSubject is valid for the current grade
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  
  // Update activeSubjectId when selectedGrade changes
  React.useEffect(() => {
    setActiveSubjectId(filteredSubjects[0]?.id || null);
  }, [selectedGrade, subjects]); // Re-run when grade or subjects list changes

  const activeSubject = filteredSubjects.find(s => s.id === activeSubjectId) || filteredSubjects[0] || null;

  const [activeMapNode, setActiveMapNode] = useState<MapNode | null>(null);

  // All nodes for selected subject
  const subjectNodes = activeSubject ? mapNodes.filter(n => n.subjectId === activeSubject.id).sort((a, b) => a.order - b.order) : [];

  const getLessonsForNode = (nodeId: string) => {
    return lessons.filter(l => l.mapNodeId === nodeId).sort((a, b) => (a.order || 0) - (b.order || 0));
  };

  return (
    <div className="flex-1 flex flex-col gap-6 w-full h-full max-w-4xl mx-auto">
      
      {!activeMapNode ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-[32px] shadow-xl border-4 border-[#3B82F6] relative overflow-visible">
            <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#3B82F6] transform rotate-12 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
              <img src={bunnyImg} alt="Cute Bunny" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <h1 className="text-2xl font-black text-[#1E3A8A] flex items-center gap-3 pr-16">
               <span className="text-3xl">🗺️</span> Bản đồ học tập
            </h1>
            
            <div className="flex gap-4 w-full md:w-auto relative z-10">
              <div className="flex-1 md:w-32">
                <label className="block text-xs font-black text-[#64748B] uppercase mb-1">Khối lớp</label>
                <select 
                  value={selectedGrade} 
                  onChange={(e) => {
                    setSelectedGrade(e.target.value);
                    setActiveMapNode(null);
                  }}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl font-bold text-[#1E3A8A] outline-none"
                >
                  {availableGrades.map(g => (
                    <option key={g} value={g}>Khối {g}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 md:w-48">
                <label className="block text-xs font-black text-[#64748B] uppercase mb-1">Môn học</label>
                <select 
                  value={activeSubject?.id || ''} 
                  onChange={(e) => {
                    setActiveSubjectId(e.target.value);
                    setActiveMapNode(null);
                  }}
                  className="w-full px-4 py-3 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-xl font-bold text-[#1E3A8A] outline-none"
                >
                  {filteredSubjects.map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pb-8">
            {subjectNodes.length > 0 ? subjectNodes.map(node => (
              <button 
                key={node.id} 
                onClick={() => setActiveMapNode(node)}
                className="bg-white p-6 rounded-[32px] border-4 border-[#E0F2FE] hover:border-[#3B82F6] hover:-translate-y-2 transition-all shadow-md group text-left flex flex-col relative overflow-hidden"
              >
                <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                  <MapIcon size={120} />
                </div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center border-4 border-[#3B82F6] text-[#3B82F6] font-black text-xl shadow-inner">
                    {node.order}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1E3A8A]">{node.name}</h3>
                    <p className="text-sm font-bold text-[#64748B]">{getLessonsForNode(node.id).length} bài học</p>
                  </div>
                </div>
                <p className="text-[#475569] font-medium line-clamp-2 mb-6 relative z-10 flex-1">{node.description}</p>
                
                <div className="w-full bg-[#E0F2FE] text-[#2563EB] font-black py-3 rounded-xl text-center group-hover:bg-[#3B82F6] group-hover:text-white transition-colors relative z-10 flex justify-center items-center gap-2">
                  MỞ BẢN ĐỒ <ArrowRight size={20} strokeWidth={3} />
                </div>
              </button>
            )) : (
              <div className="col-span-1 md:col-span-2 text-center py-12 bg-white rounded-[32px] border-4 border-dashed border-[#CBD5E1]">
                <p className="text-[#64748B] font-bold text-lg">Chưa có bản đồ nào cho Lớp/Môn này.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between bg-white p-4 md:p-6 rounded-[32px] shadow-xl border-4 border-[#DBEAFE]">
             <button 
               onClick={() => setActiveMapNode(null)} 
               className="flex items-center text-[#3B82F6] hover:text-[#1E40AF] font-black uppercase text-sm tracking-widest transition-colors"
             >
               <ArrowLeft className="mr-2" size={20} strokeWidth={3} /> Quay lại
             </button>
             <h2 className="text-xl md:text-2xl font-black text-[#1E3A8A] truncate max-w-sm">{activeMapNode.name}</h2>
             <div className="w-24 text-right"></div> {/* Spacer for alignment */}
          </div>

          <div className="bg-white rounded-[40px] border-4 border-[#DBEAFE] shadow-xl p-4 md:p-8 relative overflow-hidden flex-1 flex flex-col">
            <div className="absolute inset-0 bg-[#F8FAFC] opacity-50" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
            <div className="relative z-10 w-full max-w-3xl mx-auto space-y-12 py-8 flex-1 overflow-y-auto">
              
              <div className="text-center mb-8 bg-white p-6 rounded-3xl shadow-sm border-4 border-[#F1F5F9] inline-block mx-auto max-w-lg">
                 <p className="text-[#475569] font-bold text-sm md:text-base">{activeMapNode.description}</p>
              </div>

              {(() => {
                const nodeLessons = getLessonsForNode(activeMapNode.id);
                return (
                  <div className="relative">
                    {/* Connection Line to next node (except last) */}
                    <div className="absolute left-[39px] md:left-[59px] top-10 bottom-10 w-2 bg-[#BBF7D0] border-r-4 border-dashed border-[#86EFAC] -z-10"></div>
                    
                    <div className="grid gap-6">
                       {nodeLessons.map((lesson, idx) => {
                         const isCompleted = completedLessons.includes(lesson.id);
                         const isLocked = !isCompleted && idx > 0 && !completedLessons.includes(nodeLessons[idx-1].id);
                         return (
                           <button
                             key={lesson.id}
                             disabled={isLocked}
                             onClick={() => navigate(`/student/lesson/${lesson.id}`)}
                             className={`flex items-center p-5 rounded-[24px] transition-all border-4 w-full text-left group z-10 relative ${
                               isCompleted
                                  ? 'bg-[#F0FDF4] border-[#BBF7D0] hover:border-[#86EFAC]'
                                  : isLocked
                                    ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-70 cursor-not-allowed'
                                   : 'bg-white border-[#DBEAFE] hover:border-[#93C5FD] shadow-md hover:shadow-lg transform hover:-translate-y-1'
                             }`}
                           >
                              <div className="mr-5 flex-shrink-0">
                                {isCompleted ? (
                                  <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center text-[#10B981]"><CheckCircle2 size={24} strokeWidth={3} /></div>
                                ) : isLocked ? (
                                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400"><Lock size={24} strokeWidth={3} /></div>
                                ) : (
                                  <div className="w-12 h-12 bg-[#DBEAFE] rounded-full flex items-center justify-center text-[#3B82F6]"><PlayCircle size={24} strokeWidth={3} /></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <h4 className={`font-black text-lg ${isLocked ? 'text-[#94A3B8]' : 'text-[#1E3A8A]'}`}>
                                  Bài {lesson.order}: {lesson.name}
                                </h4>
                                <p className="text-sm font-semibold text-[#64748B] line-clamp-1">{lesson.description}</p>
                              </div>
                              {!isLocked && !isCompleted && (
                                 <ArrowRight className="text-[#93C5FD] group-hover:text-[#3B82F6] transition-colors" strokeWidth={3} />
                              )}
                           </button>
                         );
                       })}
                    </div>
                  </div>
                );
              })()}
              
              {getLessonsForNode(activeMapNode.id).length > 0 && (
                <div className="flex items-center gap-4 md:gap-8 pt-12 pb-8 justify-center">
                  <div className="w-20 h-20 md:w-32 md:h-32 flex-shrink-0 bg-white rounded-full shadow-xl border-4 border-[#FBBF24] ring-8 ring-[#FEF3C7] flex items-center justify-center relative z-10 animate-pulse">
                     <span className="text-4xl md:text-6xl">🏆</span>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  );
}
