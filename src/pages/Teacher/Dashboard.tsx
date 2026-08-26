import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Users, BookOpen, Activity, Award } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function TeacherDashboard() {
  const currentUser = useAppStore(state => state.currentUser);
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-[32px] shadow-sm border-4 border-[#D1FAE5]">
        <div className="w-16 h-16 bg-[#D1FAE5] rounded-2xl flex items-center justify-center text-[#059669] text-3xl">👋</div>
        <div>
          <h1 className="text-2xl font-black text-[#065F46]">Xin chào, {currentUser?.fullName}!</h1>
          <p className="text-[#10B981] font-bold">Giáo viên phụ trách - Bảng điều khiển</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4 cursor-pointer hover:border-[#10B981] hover:scale-105 transition-all" onClick={() => navigate('/teacher/students')}>
          <div className="w-12 h-12 bg-[#ECFDF5] text-[#10B981] rounded-xl flex items-center justify-center"><Users size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Học sinh</p>
            <p className="text-2xl font-black text-[#065F46]">45</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4 cursor-pointer hover:border-[#3B82F6] hover:scale-105 transition-all" onClick={() => navigate('/teacher/lessons')}>
          <div className="w-12 h-12 bg-[#EFF6FF] text-[#3B82F6] rounded-xl flex items-center justify-center"><BookOpen size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Bài giảng</p>
            <p className="text-2xl font-black text-[#1E40AF]">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FEF3C7] text-[#F59E0B] rounded-xl flex items-center justify-center"><Activity size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Hoạt động</p>
            <p className="text-2xl font-black text-[#92400E]">89%</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-[#E5E7EB] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F3E8FF] text-[#A855F7] rounded-xl flex items-center justify-center"><Award size={24} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Thành tích</p>
            <p className="text-2xl font-black text-[#6B21A8]">32</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border-4 border-[#D1FAE5] p-8 text-center">
        <h2 className="text-2xl font-black text-[#065F46] mb-4">Hoạt động gần đây</h2>
        <div className="space-y-4 max-w-3xl mx-auto text-left">
           <div className="p-4 bg-[#F9FAFB] rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#BFDBFE] flex items-center justify-center text-lg">👦</div>
                 <div>
                    <p className="font-bold text-[#1F2937]">Nguyễn Minh Anh <span className="text-xs text-gray-500 font-normal">vừa nộp bài tập</span></p>
                    <p className="text-xs text-[#3B82F6] font-bold">Toán hình học lớp 7</p>
                 </div>
              </div>
              <span className="text-xs font-bold text-gray-400">5 phút trước</span>
           </div>
           <div className="p-4 bg-[#F9FAFB] rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-[#FECACA] flex items-center justify-center text-lg">👧</div>
                 <div>
                    <p className="font-bold text-[#1F2937]">Trần Hà Chi <span className="text-xs text-gray-500 font-normal">đạt cấp 3 cho Pet</span></p>
                    <p className="text-xs text-[#EF4444] font-bold">Thành tích: Chăm chỉ</p>
                 </div>
              </div>
              <span className="text-xs font-bold text-gray-400">12 phút trước</span>
           </div>
        </div>
      </div>
    </div>
  );
}
