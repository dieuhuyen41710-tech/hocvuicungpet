import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Student } from '../../types';
import { Trophy, Star, Medal, Zap, Award, BookOpen, Flame } from 'lucide-react';

export default function Achievements() {
  const currentUser = useAppStore(state => state.currentUser) as Student | null;

  if (!currentUser) return null;

  const currentXp = currentUser.xp;
  const currentLevel = currentUser.petLevel;
  const thresholds = [0, 100, 300, 600, 1000];
  const nextLevel = currentLevel + 1;
  const requiredXp = thresholds[currentLevel] || 1000;
  const pointsNeeded = Math.max(0, requiredXp - currentXp);

  const badges = [
    { id: 'first_login', name: 'Mới Nhập Môn', description: 'Đăng nhập lần đầu tiên', icon: <Star size={24} />, color: 'bg-yellow-100 text-yellow-600 border-yellow-200', achieved: true },
    { id: 'streak_3', name: 'Chăm Chỉ', description: 'Học liên tục 3 ngày', icon: <Flame size={24} />, color: 'bg-orange-100 text-orange-600 border-orange-200', achieved: currentUser.streak >= 3 },
    { id: 'streak_7', name: 'Siêng Năng', description: 'Học liên tục 7 ngày', icon: <Zap size={24} />, color: 'bg-red-100 text-red-600 border-red-200', achieved: currentUser.streak >= 7 },
    { id: 'points_100', name: 'Tích Lũy', description: 'Đạt 100 điểm xu', icon: <Award size={24} />, color: 'bg-purple-100 text-purple-600 border-purple-200', achieved: currentUser.points >= 100 },
    { id: 'points_500', name: 'Tài Năng', description: 'Đạt 500 điểm xu', icon: <Trophy size={24} />, color: 'bg-blue-100 text-blue-600 border-blue-200', achieved: currentUser.points >= 500 },
    { id: 'pet_level_2', name: 'Người Bạn Nhỏ', description: 'Pet đạt cấp 2', icon: <Medal size={24} />, color: 'bg-green-100 text-green-600 border-green-200', achieved: currentUser.petLevel >= 2 },
    { id: 'pet_level_5', name: 'Bậc Thầy Thú Cưng', description: 'Pet đạt cấp 5', icon: <Trophy size={24} />, color: 'bg-emerald-100 text-emerald-600 border-emerald-200', achieved: currentUser.petLevel >= 5 },
    { id: 'lesson_5', name: 'Bác Học Nhí', description: 'Hoàn thành 5 bài học', icon: <BookOpen size={24} />, color: 'bg-indigo-100 text-indigo-600 border-indigo-200', achieved: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full px-2">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-[32px] shadow-sm border-4 border-[#DBEAFE]">
        <div className="w-24 h-24 bg-[#EFF6FF] rounded-full flex items-center justify-center text-4xl border-4 border-[#3B82F6] shadow-inner">
          🏆
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-black text-[#1E3A8A]">Bảng Thành Tích</h1>
          <p className="text-[#3B82F6] font-bold text-lg mt-1">Cố gắng thu thập thật nhiều huy hiệu nhé, {currentUser.fullName}!</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
            <div className="bg-[#FEF3C7] px-4 py-2 rounded-xl border-2 border-[#FCD34D] font-black text-[#D97706] flex items-center gap-2">
              <span>🌟</span> {currentUser.xp} XP
            </div>
            <div className="bg-[#FDF2F8] px-4 py-2 rounded-xl border-2 border-[#F9A8D4] font-black text-[#DB2777] flex items-center gap-2">
              <span>🔥</span> Chuỗi học {currentUser.streak} ngày
            </div>
            <div className="bg-[#ECFDF5] px-4 py-2 rounded-xl border-2 border-[#6EE7B7] font-black text-[#059669] flex items-center gap-2">
              <span>🐾</span> Pet Cấp {currentUser.petLevel}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] p-6 rounded-[32px] border-4 border-[#3B82F6] shadow-lg flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 bg-white rounded-2xl border-4 border-[#3B82F6] flex items-center justify-center text-4xl shadow-inner flex-shrink-0 animate-bounce">
          🐾
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-black text-[#1E3A8A] mb-1">Lời động viên cho bạn & Pet</h3>
          <p className="text-[#1E40AF] font-bold text-base leading-relaxed">
            {currentLevel >= 5 
              ? `Tuyệt vời! Pet của bạn đã đạt cấp độ tối đa (Cấp 5). Bạn và Pet đã xuất sắc hoàn thành mọi thử thách!`
              : `Tuyệt lắm! Pet của bạn đang tiến rất gần đến cấp độ ${nextLevel}. Chỉ cần cố gắng đạt thêm ${pointsNeeded} điểm nữa thôi là Pet sẽ nâng cấp. Hãy tiếp tục cố gắng mỗi ngày để nâng cấp Pet bạn nhé!`
            }
          </p>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border-4 border-[#DBEAFE]">
        <h2 className="text-2xl font-black text-[#1E3A8A] mb-6 flex items-center gap-3">
          Bộ Sưu Tập Huy Hiệu
          <span className="text-sm font-bold bg-[#E0F2FE] text-[#3B82F6] px-3 py-1 rounded-full">
            {badges.filter(b => b.achieved).length} / {badges.length}
          </span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(badge => (
            <div 
              key={badge.id}
              className={`p-5 rounded-2xl border-4 transition-all duration-300 ${
                badge.achieved 
                  ? `${badge.color.split(' ')[0]} border-${badge.color.split(' ')[2].split('-')[1]}-300 hover:scale-105 hover:shadow-lg` 
                  : 'bg-gray-50 border-gray-200 opacity-60 grayscale'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner ${
                badge.achieved ? 'bg-white text-current' : 'bg-gray-200 text-gray-400'
              }`}>
                {badge.icon}
              </div>
              <h3 className={`text-center font-black mb-1 ${badge.achieved ? 'text-gray-800' : 'text-gray-500'}`}>
                {badge.name}
              </h3>
              <p className="text-center text-xs font-bold text-gray-500">
                {badge.description}
              </p>
              
              {!badge.achieved && (
                <div className="mt-3 text-center">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-200 px-2 py-1 rounded-md">
                    Chưa mở khóa
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
