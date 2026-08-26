import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Users, Search, Award, Flame, Star, Trophy, BookOpen, Gift, MailPlus, CheckSquare, X } from 'lucide-react';
import Modal from '../../components/Modal';

export default function TeacherStudents() {
  const { students, rewardStudent, sendMessage, currentUser, addStudentTask } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Modals state
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Forms state
  const [rewardData, setRewardData] = useState({ points: 50, xp: 50, note: '', type: 'GIFT' });
  const [taskData, setTaskData] = useState({ title: '', description: '', dueDate: '' });

  const filteredStudents = students.filter(student => 
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openReward = (student: any) => {
    setSelectedStudent(student);
    setRewardData({ points: 50, xp: 50, note: '', type: 'GIFT' });
    setIsRewardModalOpen(true);
  };

  const handleReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    if (rewardData.type === 'GIFT') {
      rewardStudent(selectedStudent.id, rewardData.points, rewardData.xp, rewardData.note);
    } else {
      // Send praise letter
      sendMessage({
        senderId: currentUser?.id || '',
        senderName: currentUser?.fullName || 'Giáo viên',
        receiverId: selectedStudent.id,
        receiverName: selectedStudent.fullName,
        subject: 'Thư khen từ Giáo viên',
        content: rewardData.note || 'Cô khen ngợi em đã có thành tích học tập tốt!'
      });
      // Optionally give some points with the letter
      if (rewardData.points > 0 || rewardData.xp > 0) {
         rewardStudent(selectedStudent.id, rewardData.points, rewardData.xp, 'Thư khen');
      }
    }
    setIsRewardModalOpen(false);
  };

  const openTask = (student: any) => {
    setSelectedStudent(student);
    setTaskData({ title: '', description: '', dueDate: '' });
    setIsTaskModalOpen(true);
  };

  const handleTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    addStudentTask({
      studentId: selectedStudent.id,
      teacherId: currentUser?.id || '',
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate
    });
    setIsTaskModalOpen(false);
  };

  const openProgress = (student: any) => {
    setSelectedStudent(student);
    setIsProgressModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#065F46] flex items-center gap-3">
          <Users size={32} className="text-[#10B981]" />
          Quản Lý Học Sinh
        </h1>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border-4 border-[#D1FAE5] flex flex-col md:flex-row items-center gap-4 justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl font-bold text-sm bg-[#D1FAE5] text-[#059669] border-2 border-[#6EE7B7]">
            Tất cả học sinh
          </button>
        </div>
        
        <div className="relative w-full md:w-64">
          <input 
            type="text" 
            placeholder="Tìm kiếm tên học sinh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#6EE7B7] text-sm font-medium"
          />
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border-4 border-[#D1FAE5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#ECFDF5] text-[#065F46]">
                <th className="p-4 font-black border-b border-[#D1FAE5]">Học Sinh</th>
                <th className="p-4 font-black border-b border-[#D1FAE5]">Lớp</th>
                <th className="p-4 font-black border-b border-[#D1FAE5]">Pet & Điểm</th>
                <th className="p-4 font-black border-b border-[#D1FAE5]">Chuỗi Học</th>
                <th className="p-4 font-black border-b border-[#D1FAE5] text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? filteredStudents.map((student, idx) => (
                <tr key={student.id} className={`border-b border-gray-100 hover:bg-emerald-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#D1FAE5] flex items-center justify-center border border-[#A7F3D0] text-[#059669] shrink-0">
                        👦
                      </div>
                      <div>
                        <span className="font-bold text-gray-800 block">{student.fullName}</span>
                        <span className="text-xs text-gray-400">{student.username}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 font-bold">{student.class}</td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-sm font-bold">
                      <div className="flex items-center gap-1 text-[#059669]"><Award size={14}/> Pet Cấp {student.petLevel}</div>
                      <div className="flex items-center gap-1 text-[#D97706]"><Star size={14}/> {student.xp} XP</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 font-bold text-[#DB2777]">
                      <Flame size={18} /> {student.streak} Ngày
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openProgress(student)}
                        className="p-2 bg-[#F0FDF4] text-[#059669] hover:bg-[#D1FAE5] rounded-xl transition-colors border border-[#A7F3D0]"
                        title="Xem tiến độ"
                      >
                        <BookOpen size={18} />
                      </button>
                      <button 
                        onClick={() => openTask(student)}
                        className="p-2 bg-[#EFF6FF] text-[#3B82F6] hover:bg-[#DBEAFE] rounded-xl transition-colors border border-[#BFDBFE]"
                        title="Giao bài tập/nhiệm vụ"
                      >
                        <CheckSquare size={18} />
                      </button>
                      <button 
                        onClick={() => openReward(student)}
                        className="p-2 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#FEE2E2] rounded-xl transition-colors border border-[#FECACA]"
                        title="Tặng thưởng / Thư khen"
                      >
                        <Gift size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">Không tìm thấy học sinh nào!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Modal */}
      <Modal isOpen={isProgressModalOpen} onClose={() => setIsProgressModalOpen(false)} title={`Tiến độ học tập: ${selectedStudent?.fullName}`}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-200 flex flex-col items-center">
              <Star size={32} className="text-orange-500 mb-2" />
              <span className="text-xl font-black text-orange-700">{selectedStudent?.xp}</span>
              <span className="text-xs font-bold text-orange-600 uppercase">Kinh nghiệm (XP)</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border-2 border-emerald-200 flex flex-col items-center">
              <Award size={32} className="text-emerald-500 mb-2" />
              <span className="text-xl font-black text-emerald-700">{selectedStudent?.points}</span>
              <span className="text-xs font-bold text-emerald-600 uppercase">Xu tích lũy</span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-2 border-gray-100 rounded-xl">
            <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2"><Flame size={18} className="text-pink-500"/> Chuỗi học tập: {selectedStudent?.streak} ngày liên tiếp</h3>
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><Trophy size={18} className="text-yellow-500"/> Level Pet hiện tại: {selectedStudent?.petLevel}</h3>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button onClick={() => setIsProgressModalOpen(false)} className="px-6 py-2 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">Đóng</button>
          </div>
        </div>
      </Modal>

      {/* Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title={`Giao nhiệm vụ: ${selectedStudent?.fullName}`}>
        <form onSubmit={handleTask} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề nhiệm vụ</label>
            <input
              required
              type="text"
              value={taskData.title}
              onChange={e => setTaskData({...taskData, title: e.target.value})}
              placeholder="VD: Làm bài tập toán trang 45..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Chi tiết nhiệm vụ</label>
            <textarea
              required
              value={taskData.description}
              onChange={e => setTaskData({...taskData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none h-24"
              placeholder="Mô tả cụ thể..."
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Hạn chót</label>
            <input
              required
              type="date"
              value={taskData.dueDate}
              onChange={e => setTaskData({...taskData, dueDate: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Hủy</button>
            <button type="submit" className="px-6 py-3 rounded-xl font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-md flex items-center gap-2">
              <CheckSquare size={18} /> Giao việc
            </button>
          </div>
        </form>
      </Modal>

      {/* Reward/Praise Modal */}
      <Modal isOpen={isRewardModalOpen} onClose={() => setIsRewardModalOpen(false)} title={`Tặng thưởng: ${selectedStudent?.fullName}`}>
        <form onSubmit={handleReward} className="space-y-4">
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setRewardData({...rewardData, type: 'GIFT'})}
              className={`flex-1 py-3 rounded-xl font-bold border-2 flex items-center justify-center gap-2 transition-colors ${rewardData.type === 'GIFT' ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#EF4444]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              <Gift size={20} /> Tặng Điểm/Xu
            </button>
            <button
              type="button"
              onClick={() => setRewardData({...rewardData, type: 'PRAISE'})}
              className={`flex-1 py-3 rounded-xl font-bold border-2 flex items-center justify-center gap-2 transition-colors ${rewardData.type === 'PRAISE' ? 'bg-[#EFF6FF] border-[#BFDBFE] text-[#3B82F6]' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
            >
              <MailPlus size={20} /> Thư Khen
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tặng Xu (Mua đồ Pet)</label>
              <input
                type="number"
                min="0"
                value={rewardData.points}
                onChange={e => setRewardData({...rewardData, points: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#EF4444] focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tặng XP (Lên cấp)</label>
              <input
                type="number"
                min="0"
                value={rewardData.xp}
                onChange={e => setRewardData({...rewardData, xp: Number(e.target.value)})}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#EF4444] focus:outline-none font-bold"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Lời nhắn / Nội dung thư khen</label>
            <textarea
              required
              value={rewardData.note}
              onChange={e => setRewardData({...rewardData, note: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#EF4444] focus:outline-none h-24"
              placeholder={rewardData.type === 'PRAISE' ? "Cô khen ngợi em đã..." : "Lý do tặng thưởng..."}
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setIsRewardModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100">Hủy</button>
            <button type="submit" className={`px-6 py-3 rounded-xl font-bold text-white shadow-md flex items-center gap-2 ${rewardData.type === 'GIFT' ? 'bg-[#EF4444] hover:bg-[#DC2626]' : 'bg-[#3B82F6] hover:bg-[#2563EB]'}`}>
              {rewardData.type === 'GIFT' ? <><Gift size={18}/> Tặng</> : <><MailPlus size={18}/> Gửi Thư Khen</>}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
