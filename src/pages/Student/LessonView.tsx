import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppStore } from '../../store/useAppStore';
import { calculateLessonReward, calculateQuizReward } from '../../utils/rewardEngine';
import { mockQuestions } from '../../data/mockData';
import { ArrowLeft, PlayCircle, BookOpen, CheckCircle, Trophy, Star, Gamepad2 } from 'lucide-react';
import clsx from 'clsx';
import { getEmbedUrl } from '../../utils/embed';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lessons, completeLesson, addPointsAndXP, completedLessons, tests } = useAppStore();
  
  const lesson = lessons.find(l => l.id === id);
  const isCompleted = lesson ? completedLessons.includes(lesson.id) : false;
  
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'CONTENT' | 'QUIZ' | 'GAME'>('VIDEO');
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, any>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  if (!lesson) return <div>Bài học không tồn tại</div>;

  const attachedTest = tests.find(t => t.lessonId === lesson.id);
  const lessonQuestions = attachedTest && attachedTest.questions?.length > 0 
    ? attachedTest.questions 
    : mockQuestions.filter(q => q.lessonId === lesson.id);

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      completeLesson(lesson.id);
      const reward = calculateLessonReward();
      addPointsAndXP(reward.points, reward.xp);
      alert(`Chúc mừng! Bạn nhận được ${reward.points} điểm và ${reward.xp} XP`);
    }
    setActiveTab('QUIZ');
  };

  const handleAnswer = (questionId: string, value: any) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const submitQuiz = () => {
    let correct = 0;
    const total = lessonQuestions.length;
    lessonQuestions.forEach((q: any) => {
      const userAns = selectedAnswers[q.id];
      if (q.type === 'MULTIPLE_CHOICE' || q.type === 'TRUE_FALSE') {
        if (userAns !== undefined && userAns === q.correctOptionIndex) {
          correct++;
        }
      } else if (q.type === 'FILL_BLANK') {
        const expected = (q.fillBlankAnswers?.[0] || '').trim().toLowerCase();
        const actual = String(userAns || '').trim().toLowerCase();
        if (expected && actual === expected) {
          correct++;
        }
      } else {
        if (userAns !== undefined && userAns !== '') {
          correct++;
        }
      }
    });
    
    // Calculate score on 10 point scale
    const score = total > 0 ? (correct / total) * 10 : 10;
    setQuizScore(score);
    setQuizFinished(true);

    const reward = calculateQuizReward(score);
    if (reward.points > 0) {
      addPointsAndXP(reward.points, reward.xp);
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
           <button 
             onClick={() => setActiveTab('CONTENT')}
             className={clsx("flex-1 py-4 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE]", activeTab === 'CONTENT' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]")}
           >
             <BookOpen size={24} strokeWidth={3} /> NỘI DUNG
           </button>
           <button 
             onClick={() => setActiveTab('QUIZ')}
             className={clsx("flex-1 py-4 font-black flex items-center justify-center gap-2 transition-all", activeTab === 'QUIZ' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]", lesson.gameUrl && "border-r-4 border-[#DBEAFE]")}
           >
             <CheckCircle size={24} strokeWidth={3} /> LUYỆN TẬP
           </button>
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
              
              <div className="flex justify-center">
                <button 
                  onClick={() => setActiveTab('CONTENT')}
                  className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black text-xl px-12 py-5 rounded-3xl shadow-[0_8px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_4px_0_#1E3A8A] transition-all active:translate-y-2 active:shadow-none"
                >
                  ĐỌC NỘI DUNG 📖
                </button>
              </div>
            </div>
          )}

          {activeTab === 'CONTENT' && (
            <div className="animate-fade-in space-y-8 max-w-5xl mx-auto w-full">
               <div className="bg-white p-8 rounded-[32px] border-4 border-[#E2E8F0] shadow-sm prose prose-sky max-w-none prose-p:text-[#475569] prose-p:font-medium prose-headings:text-[#1E3A8A] prose-headings:font-black">
                  <h3>Kiến thức trọng tâm</h3>
                  <p>Đây là phần nội dung lý thuyết của bài học. Trong thực tế, dữ liệu này sẽ được lấy từ Knowledge Units của bài học.</p>
                  <ul>
                    <li>Hiểu khái niệm cơ bản.</li>
                    <li>Nắm vững công thức.</li>
                    <li>Áp dụng vào bài tập.</li>
                  </ul>
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
                   <button 
                     onClick={() => setActiveTab('QUIZ')}
                     className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black text-xl px-12 py-5 rounded-3xl shadow-[0_8px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_4px_0_#1E3A8A] transition-all active:translate-y-2 active:shadow-none flex items-center gap-3 uppercase tracking-wide"
                   >
                     ĐÃ HOÀN THÀNH! TỚI LUYỆN TẬP
                   </button>
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
          {activeTab === 'QUIZ' && (
            <div className="animate-fade-in w-full pb-8">
              {!isCompleted ? (
                <div className="text-center py-12 max-w-md mx-auto bg-white p-8 rounded-[32px] border-4 border-[#E2E8F0]">
                  <BookOpen className="mx-auto text-[#CBD5E1] mb-6" size={80} strokeWidth={1.5} />
                  <h3 className="text-2xl font-black text-[#1E3A8A] mb-2 uppercase">Vui lòng hoàn thành bài học trước</h3>
                  <p className="text-[#64748B] font-semibold">Bạn cần xem xong lý thuyết mới có thể làm bài tập nhé.</p>
                </div>
              ) : lessonQuestions.length === 0 ? (
                <div className="text-center py-12 max-w-md mx-auto bg-white p-8 rounded-[32px] border-4 border-[#E2E8F0]">
                  <p className="text-[#64748B] font-bold text-lg">Chưa có câu hỏi cho bài học này.</p>
                </div>
              ) : !quizStarted ? (
                <div className="text-center py-12 space-y-8 max-w-md mx-auto bg-white p-10 rounded-[40px] border-4 border-[#FDE68A] shadow-xl my-auto">
                  <div className="w-32 h-32 bg-[#FFFBEB] rounded-full border-4 border-[#FCD34D] flex items-center justify-center mx-auto shadow-inner">
                     <Trophy className="text-[#F59E0B]" size={64} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[#D97706] mb-3 uppercase tracking-wide">Kiểm tra kiến thức</h3>
                    <p className="text-[#B45309] font-bold text-lg">Gồm {lessonQuestions.length} câu hỏi trắc nghiệm.<br/>Cố gắng đạt điểm cao nhé!</p>
                  </div>
                  <button 
                    onClick={() => setQuizStarted(true)}
                    className="w-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-black text-xl px-8 py-5 rounded-3xl shadow-[0_8px_0_#92400E] hover:translate-y-1 hover:shadow-[0_4px_0_#92400E] transition-all active:translate-y-2 active:shadow-none uppercase"
                  >
                    BẮT ĐẦU LÀM BÀI 🚀
                  </button>
                </div>
              ) : quizFinished ? (
                <div className="text-center py-12 space-y-8 max-w-lg mx-auto bg-white p-10 rounded-[40px] border-4 border-[#DBEAFE] shadow-xl">
                  <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-b from-[#FEF3C7] to-[#FDE68A] border-8 border-white shadow-xl mb-4 relative">
                    <div className="text-center relative z-10">
                      <span className="block text-6xl font-black text-[#D97706] drop-shadow-md">{quizScore.toFixed(1)}</span>
                      <span className="text-lg font-black text-[#B45309] uppercase tracking-widest">Điểm</span>
                    </div>
                    {quizScore >= 8 && <div className="absolute -top-4 -right-4 text-5xl animate-bounce">🌟</div>}
                  </div>
                  <h3 className="text-3xl font-black text-[#1E3A8A] uppercase">HOÀN THÀNH BÀI KIỂM TRA!</h3>
                  <div className="flex justify-center gap-6">
                    <div className="bg-[#FFF7ED] px-8 py-4 rounded-3xl border-4 border-[#FED7AA] flex-1">
                      <span className="block text-xs text-[#9A3412] font-black uppercase mb-1 tracking-widest">Thưởng</span>
                      <span className="text-2xl font-black text-[#C2410C]">+{calculateQuizReward(quizScore).points} Xu</span>
                    </div>
                    <div className="bg-[#F0F9FF] px-8 py-4 rounded-3xl border-4 border-[#BAE6FD] flex-1">
                      <span className="block text-xs text-[#0369A1] font-black uppercase mb-1 tracking-widest">Kinh nghiệm</span>
                      <span className="text-2xl font-black text-[#0284C7]">+{calculateQuizReward(quizScore).xp} XP</span>
                    </div>
                  </div>
                  <div className="pt-8">
                     <button 
                       onClick={() => navigate('/student/map')}
                       className="w-full bg-[#E0F2FE] text-[#2563EB] hover:bg-[#BFDBFE] font-black text-xl py-5 rounded-3xl transition-colors border-4 border-[#BAE6FD] uppercase"
                     >
                       VỀ BẢN ĐỒ LĨNH THƯỞNG
                     </button>
                  </div>
                </div>
              ) : (
                <div className="max-w-5xl mx-auto w-full space-y-8">
                  <div className="flex justify-between items-center bg-white p-4 rounded-2xl border-4 border-[#E2E8F0] shadow-sm">
                    <span className="font-black text-[#64748B] uppercase tracking-widest text-sm ml-2">CÂU HỎI {currentQuestionIndex + 1} / {lessonQuestions.length}</span>
                    <div className="flex gap-2 mr-2">
                      {lessonQuestions.map((_, i) => (
                        <div key={i} className={`w-10 h-3 rounded-full ${i === currentQuestionIndex ? 'bg-[#3B82F6] shadow-sm' : i < currentQuestionIndex ? 'bg-[#93C5FD]' : 'bg-[#E2E8F0]'}`}></div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border-4 border-[#DBEAFE] p-8 md:p-12 rounded-[40px] shadow-xl relative">
                    <div className="absolute -top-6 left-8 bg-[#FEF3C7] text-[#D97706] font-black px-6 py-2 rounded-full border-4 border-white shadow-md uppercase tracking-wider text-sm">
                      Chọn đáp án đúng
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-[#1E3A8A] mb-6 leading-relaxed mt-4 break-words whitespace-normal">
                      {lessonQuestions[currentQuestionIndex].content}
                    </h3>
                    {lessonQuestions[currentQuestionIndex].imageUrl && (
                      <div className="mb-6">
                        <img src={lessonQuestions[currentQuestionIndex].imageUrl} alt="Question illustration" className="max-h-64 w-auto rounded-2xl border-4 border-[#DBEAFE] shadow-md object-cover" />
                      </div>
                    )}

                    <div className="space-y-4">
                      {(lessonQuestions[currentQuestionIndex].type === 'MULTIPLE_CHOICE' || lessonQuestions[currentQuestionIndex].type === 'TRUE_FALSE') && 
                        lessonQuestions[currentQuestionIndex].options?.map((opt: string, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(lessonQuestions[currentQuestionIndex].id, idx)}
                          className={clsx(
                            "w-full text-left p-6 rounded-3xl border-4 transition-all font-bold text-lg flex items-center group",
                            selectedAnswers[lessonQuestions[currentQuestionIndex].id] === idx
                              ? "bg-[#EFF6FF] border-[#3B82F6] text-[#1E40AF] shadow-md -translate-y-1"
                              : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#93C5FD] text-[#475569] hover:bg-white hover:-translate-y-1 hover:shadow-sm"
                          )}
                        >
                          <span className={clsx(
                            "inline-flex items-center justify-center w-12 h-12 rounded-xl text-xl font-black mr-4 transition-colors shrink-0",
                            selectedAnswers[lessonQuestions[currentQuestionIndex].id] === idx
                              ? "bg-[#3B82F6] text-white"
                              : "bg-[#E2E8F0] text-[#64748B] group-hover:bg-[#DBEAFE] group-hover:text-[#2563EB]"
                          )}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="break-words whitespace-normal flex-1">{opt}</span>
                        </button>
                      ))}

                      {lessonQuestions[currentQuestionIndex].type === 'FILL_BLANK' && (
                        <div>
                          <input
                            type="text"
                            value={selectedAnswers[lessonQuestions[currentQuestionIndex].id] || ''}
                            onChange={(e) => handleAnswer(lessonQuestions[currentQuestionIndex].id, e.target.value)}
                            placeholder="Nhập câu trả lời của bạn..."
                            className="w-full px-6 py-4 rounded-2xl border-4 border-[#DBEAFE] focus:border-[#3B82F6] focus:outline-none text-lg font-bold text-[#1E3A8A]"
                          />
                        </div>
                      )}

                      {lessonQuestions[currentQuestionIndex].type === 'ESSAY' && (
                        <div>
                          <textarea
                            value={selectedAnswers[lessonQuestions[currentQuestionIndex].id] || ''}
                            onChange={(e) => handleAnswer(lessonQuestions[currentQuestionIndex].id, e.target.value)}
                            placeholder="Nhập bài làm tự luận..."
                            className="w-full px-6 py-4 rounded-2xl border-4 border-[#DBEAFE] focus:border-[#3B82F6] focus:outline-none text-lg font-bold text-[#1E3A8A] h-32"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 gap-4 pb-4">
                    <button 
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      className="px-8 py-5 font-black text-[#64748B] bg-white border-4 border-[#E2E8F0] rounded-3xl hover:bg-[#F8FAFC] disabled:opacity-50 disabled:hover:bg-white transition-all uppercase tracking-wide"
                    >
                      QUAY LẠI
                    </button>
                    
                    {currentQuestionIndex < lessonQuestions.length - 1 ? (
                      <button 
                        disabled={selectedAnswers[lessonQuestions[currentQuestionIndex].id] === undefined}
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        className="px-12 py-5 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black rounded-3xl shadow-[0_6px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_3px_0_#1E3A8A] active:translate-y-2 active:shadow-none disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-[0_6px_0_#94A3B8] transition-all uppercase tracking-wide"
                      >
                        TIẾP THEO
                      </button>
                    ) : (
                      <button 
                        disabled={selectedAnswers[lessonQuestions[currentQuestionIndex].id] === undefined}
                        onClick={submitQuiz}
                        className="px-12 py-5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-black rounded-3xl shadow-[0_6px_0_#064E3B] hover:translate-y-1 hover:shadow-[0_3px_0_#064E3B] active:translate-y-2 active:shadow-none disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-[0_6px_0_#94A3B8] transition-all uppercase tracking-wide"
                      >
                        NỘP BÀI!
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
