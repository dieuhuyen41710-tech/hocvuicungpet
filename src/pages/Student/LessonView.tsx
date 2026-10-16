import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useAppStore } from '../../store/useAppStore';
import { calculateLessonReward } from '../../utils/rewardEngine';
import { 
  ArrowLeft, PlayCircle, BookOpen, CheckCircle, Gamepad2, 
  HelpCircle, Sparkles, CheckCircle2, XCircle, RotateCcw, 
  Award, ChevronRight, PenTool
} from 'lucide-react';
import clsx from 'clsx';
import { getEmbedUrl } from '../../utils/embed';
import { Question } from '../../types';
import { mockQuestions } from '../../data/mockData';

export default function LessonView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    lessons, 
    completeLesson, 
    addPointsAndXP, 
    completedLessons, 
    openPetAIDiagnostic 
  } = useAppStore();
  
  const lesson = lessons.find(l => l.id === id);
  const isCompleted = lesson ? completedLessons.includes(lesson.id) : false;
  
  const hasContent = lesson?.content && lesson.content.trim().length > 0;
  
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'CONTENT' | 'PRACTICE' | 'GAME'>('VIDEO');

  // Load questions for this lesson from lesson.questions or mockQuestions or default curriculum
  const questions: Question[] = useMemo(() => {
    if (!lesson) return [];
    if (lesson.questions && lesson.questions.length > 0) {
      return lesson.questions;
    }
    const fromMock = mockQuestions.filter(q => q.lessonId === lesson.id);
    if (fromMock.length > 0) return fromMock;

    // Default practice questions tailored to the lesson topic
    return [
      {
        id: `default-q1-${lesson.id}`,
        lessonId: lesson.id,
        content: `Trong bài học "${lesson.name}", quy tắc hoặc công thức trọng tâm cần ghi nhớ là gì?`,
        type: 'MULTIPLE_CHOICE',
        options: [
          'A. Đọc kỹ đề bài, ghi nhớ công thức và quy đổi về cùng một đơn vị đo trước khi tính',
          'B. Chỉ thực hiện tính nhẩm nhanh mà không cần kiểm tra lại đơn vị đo',
          'C. Cộng ngẫu nhiên các số trong đề bài lại với nhau',
          'D. Chỉ cần chọn đáp án có chữ số lớn nhất'
        ],
        correctOptionIndex: 0,
        level: 'UNDERSTANDING',
        status: 'PUBLISHED',
        explanation: 'Khi giải bài toán, đọc kỹ đề bài, áp dụng đúng công thức và quy đổi về cùng đơn vị đo là nguyên tắc cốt lõi giúp tránh bẫy sai lầm!'
      },
      {
        id: `default-q2-${lesson.id}`,
        lessonId: lesson.id,
        content: `Khi giải bài toán hình học hoặc đại số, sai lầm nào học sinh dễ mắc phải nhất?`,
        type: 'MULTIPLE_CHOICE',
        options: [
          'A. Nhầm công thức (như xung quanh với toàn phần/thể tích) hoặc quên đổi đơn vị đo',
          'B. Đọc quá kỹ đề bài và vẽ hình cẩn thận',
          'C. Kiểm tra lại kết quả sau khi làm xong',
          'D. Ghi nhớ các đơn vị đo thể tích và diện tích'
        ],
        correctOptionIndex: 0,
        level: 'APPLICATION',
        status: 'PUBLISHED',
        explanation: 'Học sinh rất thường nhầm giữa diện tích xung quanh với diện tích toàn phần, hoặc quên đổi đơn vị đo (ví dụ dm sang m, m sang cm).'
      }
    ];
  }, [lesson]);

  // State for Practice tab
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [rewardedQuestions, setRewardedQuestions] = useState<Record<number, boolean>>({});

  if (!lesson) return <div className="p-8 text-center font-bold text-gray-500">Bài học không tồn tại</div>;

  const handleCompleteLesson = () => {
    if (!isCompleted) {
      completeLesson(lesson.id);
      const reward = calculateLessonReward();
      addPointsAndXP(reward.points, reward.xp);
      alert(`Chúc mừng! Bạn nhận được ${reward.points} điểm và ${reward.xp} XP. Pet đã được trừ 10% độ no.`);
    }
  };

  // Handle selecting an answer in Practice tab
  const handleSelectAnswer = (qIdx: number, optIdx: number, correctIdx?: number) => {
    if (selectedAnswers[qIdx] !== undefined) return; // already answered

    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));

    // If answer is correct, reward points & XP once
    if (correctIdx !== undefined && optIdx === correctIdx && !rewardedQuestions[qIdx]) {
      setRewardedQuestions(prev => ({ ...prev, [qIdx]: true }));
      addPointsAndXP(5, 10);
    }
  };

  // Trigger Pet AI Diagnostic when student made a mistake
  const handleAskPetWhyWrong = (q: Question, qIdx: number) => {
    const selectedOptIdx = selectedAnswers[qIdx];
    const options = q.options || [];
    const selectedText = options[selectedOptIdx] || 'Chưa rõ';
    const correctText = typeof q.correctOptionIndex === 'number' ? options[q.correctOptionIndex] : undefined;

    openPetAIDiagnostic({
      lessonName: lesson.name,
      questionContent: q.content,
      options,
      selectedOptionIndex: selectedOptIdx,
      selectedOptionText: selectedText,
      correctOptionIndex: q.correctOptionIndex,
      correctOptionText: correctText,
      lessonContent: lesson.content
    });
  };

  const handleResetPractice = () => {
    setSelectedAnswers({});
    setRewardedQuestions({});
  };

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = questions.filter((q, idx) => selectedAnswers[idx] === q.correctOptionIndex).length;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 flex-1 flex flex-col h-full">
      <button 
        onClick={() => navigate('/student/map')} 
        className="flex items-center text-[#3B82F6] hover:text-[#1E40AF] font-black uppercase text-sm tracking-widest transition-colors w-fit cursor-pointer"
      >
        <ArrowLeft className="mr-2" size={20} strokeWidth={3} /> QUAY LẠI BẢN ĐỒ
      </button>

      <div className="bg-white rounded-[40px] border-4 border-[#DBEAFE] shadow-xl overflow-hidden flex-1 flex flex-col relative">
        <div className="absolute inset-0 bg-[#F8FAFC] opacity-50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Header */}
        <div className="bg-white p-6 border-b-4 border-[#DBEAFE] relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1E3A8A] mb-1 uppercase tracking-wide">{lesson.name}</h1>
            <p className="text-[#64748B] font-bold text-sm">{lesson.description}</p>
          </div>

          {isCompleted && (
            <div className="bg-[#DCFCE7] text-[#166534] font-black text-xs md:text-sm px-4 py-2 rounded-2xl border-2 border-[#86EFAC] flex items-center gap-2 self-start md:self-auto shrink-0 shadow-xs">
              <CheckCircle size={18} /> ĐÃ HOÀN THÀNH BÀI HỌC
            </div>
          )}
        </div>

        {/* Tab navigation bar */}
        <div className="flex border-b-4 border-[#DBEAFE] relative z-10 bg-[#F8FAFC] overflow-x-auto">
          <button 
            onClick={() => setActiveTab('VIDEO')}
            className={clsx(
              "flex-1 min-w-[140px] py-4 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE] text-xs md:text-sm cursor-pointer", 
              activeTab === 'VIDEO' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]"
            )}
          >
            <PlayCircle size={22} strokeWidth={3} /> VIDEO BÀI GIẢNG
          </button>

          {hasContent && (
            <button 
              onClick={() => setActiveTab('CONTENT')}
              className={clsx(
                "flex-1 min-w-[140px] py-4 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE] text-xs md:text-sm cursor-pointer", 
                activeTab === 'CONTENT' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]"
              )}
            >
              <BookOpen size={22} strokeWidth={3} /> ĐỌC NỘI DUNG
            </button>
          )}

          {/* TAB LUYỆN TẬP */}
          <button 
            onClick={() => setActiveTab('PRACTICE')}
            className={clsx(
              "flex-1 min-w-[150px] py-4 font-black flex items-center justify-center gap-2 transition-all border-r-4 border-[#DBEAFE] text-xs md:text-sm cursor-pointer", 
              activeTab === 'PRACTICE' ? "bg-white text-[#F59E0B] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#F59E0B]"
            )}
          >
            <PenTool size={20} strokeWidth={3} /> 
            <span>✍️ LUYỆN TẬP</span>
            <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {questions.length} câu
            </span>
          </button>

          {lesson.gameUrl && (
            <button 
              onClick={() => setActiveTab('GAME')}
              className={clsx(
                "flex-1 min-w-[140px] py-4 font-black flex items-center justify-center gap-2 transition-all text-xs md:text-sm cursor-pointer", 
                activeTab === 'GAME' ? "bg-white text-[#2563EB] shadow-inner" : "text-[#94A3B8] hover:bg-white hover:text-[#3B82F6]"
              )}
            >
              <Gamepad2 size={22} strokeWidth={3} /> MINI GAME
            </button>
          )}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 md:p-8 flex-1 relative z-10 overflow-y-auto">
          {/* TAB 1: VIDEO */}
          {activeTab === 'VIDEO' && (
            <div className="animate-fade-in space-y-6 max-w-5xl mx-auto w-full">
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
              
              <div className="flex flex-wrap justify-center gap-4">
                {hasContent && (
                  <button 
                    onClick={() => setActiveTab('CONTENT')}
                    className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black text-base md:text-lg px-8 py-3.5 rounded-2xl shadow-[0_6px_0_#1E3A8A] hover:translate-y-0.5 hover:shadow-[0_3px_0_#1E3A8A] transition-all cursor-pointer"
                  >
                    ĐỌC NỘI DUNG 📖
                  </button>
                )}
                <button 
                  onClick={() => setActiveTab('PRACTICE')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base md:text-lg px-8 py-3.5 rounded-2xl shadow-[0_6px_0_#92400E] hover:translate-y-0.5 hover:shadow-[0_3px_0_#92400E] transition-all cursor-pointer flex items-center gap-2"
                >
                  <PenTool size={20} /> LÀM BÀI LUYỆN TẬP ✍️
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT */}
          {activeTab === 'CONTENT' && hasContent && (
            <div className="animate-fade-in space-y-6 max-w-5xl mx-auto w-full">
               <div className="bg-white p-6 md:p-8 rounded-[32px] border-4 border-[#E2E8F0] shadow-sm space-y-4">
                  <h3 className="text-xl md:text-2xl font-black text-[#1E3A8A] border-b-2 border-gray-100 pb-3 flex items-center gap-3">
                    <BookOpen className="text-blue-600" size={26} />
                    Kiến thức trọng tâm: {lesson.name}
                  </h3>
                  <div className="whitespace-pre-wrap text-sm md:text-base font-medium text-gray-700 leading-relaxed pt-2">
                    {lesson.content}
                  </div>
               </div>

               <div className="pt-4 flex justify-center gap-4 border-t-4 border-dashed border-[#E2E8F0]">
                 <button 
                   onClick={() => setActiveTab('PRACTICE')}
                   className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-base md:text-lg px-10 py-4 rounded-2xl shadow-[0_6px_0_#92400E] hover:translate-y-0.5 hover:shadow-[0_3px_0_#92400E] transition-all cursor-pointer flex items-center gap-2"
                 >
                   <PenTool size={20} /> CHUYỂN SANG LUYỆN TẬP ✍️
                 </button>
               </div>
            </div>
          )}

          {/* TAB 3: LUYỆN TẬP (PRACTICE) - GẮN LIỀN PET AI CHẨN ĐOÁN LỖI SAI */}
          {activeTab === 'PRACTICE' && (
            <div className="animate-fade-in space-y-6 max-w-4xl mx-auto w-full pb-8">
              
              {/* Practice Summary Bar */}
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-amber-50 p-4 md:p-5 rounded-3xl border-3 border-blue-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-2xl border-2 border-blue-300 flex items-center justify-center text-2xl shadow-inner">
                    ✍️
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#1E3A8A]">
                      Luyện Tập & Củng Cố Kiến Thức
                    </h2>
                    <p className="text-xs text-gray-600 font-medium">
                      Hãy chọn phương án đúng. Nếu làm sai, bạn có thể <strong className="text-amber-700">Hỏi Pet vì sao sai</strong> để được hướng dẫn!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs">
                    <span>Đã làm:</span>
                    <span className="text-blue-600 font-black">{answeredCount}/{totalQuestions}</span>
                  </div>

                  <div className="bg-white px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs">
                    <span>Đúng:</span>
                    <span className="text-emerald-600 font-black">{correctCount}</span>
                  </div>

                  {answeredCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetPractice}
                      className="p-2 text-gray-500 hover:text-amber-700 bg-white border border-gray-200 hover:border-amber-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
                      title="Làm lại từ đầu"
                    >
                      <RotateCcw size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Question List */}
              <div className="space-y-6">
                {questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const selectedOpt = selectedAnswers[idx];
                  const isCorrect = isAnswered && selectedOpt === q.correctOptionIndex;
                  const isWrong = isAnswered && selectedOpt !== q.correctOptionIndex;

                  return (
                    <div 
                      key={q.id || idx} 
                      className={clsx(
                        "bg-white rounded-3xl p-5 md:p-6 border-3 transition-all shadow-sm space-y-4",
                        !isAnswered ? "border-gray-200" : isCorrect ? "border-emerald-300 bg-emerald-50/20" : "border-rose-300 bg-rose-50/20"
                      )}
                    >
                      {/* Question Header */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-[#1E3A8A] text-white text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-black uppercase text-[#1E3A8A] tracking-wider">
                            Câu hỏi số {idx + 1}
                          </span>
                        </div>

                        {/* Level badge */}
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {q.level === 'RECOGNITION' ? 'Nhận biết' : q.level === 'UNDERSTANDING' ? 'Thông hiểu' : 'Vận dụng'}
                        </span>
                      </div>

                      {/* Question Content */}
                      <p className="text-sm md:text-base font-bold text-gray-800 leading-relaxed">
                        {q.content}
                      </p>

                      {/* Options List */}
                      <div className="space-y-2 pt-1">
                        {q.options?.map((opt, optIdx) => {
                          const isThisSelected = selectedOpt === optIdx;
                          const isThisTheCorrectAnswer = q.correctOptionIndex === optIdx;

                          let optionClass = "border-gray-200 bg-gray-50/60 hover:bg-blue-50 hover:border-blue-300 text-gray-800";

                          if (isAnswered) {
                            if (isThisTheCorrectAnswer) {
                              optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold shadow-xs";
                            } else if (isThisSelected && !isThisTheCorrectAnswer) {
                              optionClass = "border-rose-400 bg-rose-50 text-rose-900 font-bold shadow-xs";
                            } else {
                              optionClass = "border-gray-100 bg-gray-50/40 text-gray-400";
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={isAnswered}
                              onClick={() => handleSelectAnswer(idx, optIdx, q.correctOptionIndex)}
                              className={clsx(
                                "w-full text-left p-3.5 md:p-4 rounded-2xl border-2 text-xs md:text-sm transition-all flex items-center justify-between cursor-pointer",
                                optionClass
                              )}
                            >
                              <span className="leading-snug">{opt}</span>
                              {isAnswered && isThisTheCorrectAnswer && (
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                              )}
                              {isAnswered && isThisSelected && !isThisTheCorrectAnswer && (
                                <XCircle size={18} className="text-rose-500 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback for Correct Answer */}
                      {isCorrect && (
                        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800 font-bold animate-in fade-in duration-200">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          <span>Chính xác! Bạn đã nắm rất vững kiến thức này (+10 XP & +5 Điểm) 🎉</span>
                        </div>
                      )}

                      {/* Feedback & "HỎI PET VÌ SAO SAI" for Wrong Answer */}
                      {isWrong && (
                        <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/70 border-2 border-amber-400 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white border-2 border-amber-400 flex items-center justify-center text-2xl shrink-0 shadow-inner">
                              🐾
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-black text-[#92400E]">
                                Bạn chưa chọn đúng câu này rồi!
                              </p>
                              <p className="text-[11px] md:text-xs text-amber-800 font-medium mt-0.5">
                                Đừng lo lắng! Pet AI sẽ chỉ ra chỗ bạn bị nhầm và gợi ý từng bước để bạn tự tin giải quyết.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAskPetWhyWrong(q, idx)}
                            className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white font-black text-xs md:text-sm rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 animate-pulse"
                          >
                            <span>🐾 Hỏi Pet vì sao sai</span>
                            <Sparkles size={16} className="text-amber-200" />
                          </button>
                        </div>
                      )}

                      {/* Explanation preview if available */}
                      {isAnswered && q.explanation && (
                        <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 font-medium">
                          <strong className="text-gray-700">💡 Gợi ý giải:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Completion Action Box */}
              {answeredCount === totalQuestions && totalQuestions > 0 && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white text-center shadow-lg space-y-4">
                  <div className="text-4xl">🏆</div>
                  <div>
                    <h3 className="text-xl font-black">Chúc mừng bạn đã hoàn thành phần luyện tập!</h3>
                    <p className="text-sm text-emerald-100 font-medium mt-1">
                      Bạn đã trả lời đúng {correctCount}/{totalQuestions} câu hỏi. Hãy tiếp tục phát huy nhé!
                    </p>
                  </div>

                  <div className="flex justify-center gap-4 pt-2">
                    {!isCompleted ? (
                      <button 
                        onClick={handleCompleteLesson}
                        className="bg-white text-emerald-700 font-black text-sm md:text-base px-8 py-3.5 rounded-2xl shadow-md hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <CheckCircle size={20} /> Hoàn Thành Bài Học & Nhận Thưởng
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigate('/student/map')}
                        className="bg-white text-emerald-700 font-black text-sm md:text-base px-8 py-3.5 rounded-2xl shadow-md hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-2"
                      >
                        Tiếp Tục Bài Học Khác Trên Bản Đồ 🗺️
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: MINI GAME */}
          {activeTab === 'GAME' && lesson.gameUrl && (
            <div className="animate-fade-in bg-white h-full flex flex-col relative min-h-[500px]">
              <div className="bg-[#EFF6FF] px-6 py-3 flex justify-between items-center border-b-4 border-[#DBEAFE] z-10 flex-wrap gap-2">
                <span className="font-black text-[#1E3A8A] text-sm">🎮 Trò chơi mini bài học</span>
                <a 
                  href={lesson.gameUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-black rounded-xl shadow transition-colors flex items-center gap-1.5"
                >
                  Mở trong tab mới ↗
                </a>
              </div>
              <div className="bg-[#FEF3C7] px-4 py-2 text-xs font-bold text-[#D97706] text-center border-b border-[#FDE68A]">
                ⚠️ Lưu ý: Nếu trò chơi ngoài (Canva/Trang khác) báo lỗi quyền truy cập, hãy bấm nút <span className="underline font-black">"Mở trong tab mới"</span> phía trên.
              </div>
              <div className="flex-1 w-full relative bg-black min-h-[450px]">
                <iframe 
                  src={getEmbedUrl(lesson.gameUrl)} 
                  className="w-full h-full border-0 absolute inset-0"
                  title="Mini Game"
                  allow="autoplay; fullscreen"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
