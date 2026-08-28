import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Student, User } from '../../types';
import { Mail, Send, Inbox, AlertCircle } from 'lucide-react';
import pandaImg from '../../assets/images/pixar_panda_avatar_1787838510229.jpg';

export default function Mailbox() {
  const currentUser = useAppStore((state) => state.currentUser) as Student | null;
  const { messages, sendMessage, markMessageRead, users } = useAppStore();
  const teachers = users.filter(u => u.role === 'TEACHER');
  
  const [recipient, setRecipient] = useState<'TEACHER' | 'ADMIN'>('TEACHER');
  const [selectedTeacherId, setSelectedTeacherId] = useState(teachers[0]?.id || '');

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentStatus, setSentStatus] = useState<string | null>(null);

  const inboxMessages = messages.filter(m => m.receiverId === currentUser?.id && !m.isArchived);

  const isGuest = !currentUser || currentUser.role === 'GUEST';

  if (isGuest) {
    return (
      <div className="max-w-2xl mx-auto space-y-6 flex-1 w-full h-full py-12 px-4">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl border-4 border-[#F59E0B] text-center space-y-6 relative overflow-hidden">
          <div className="w-24 h-24 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto border-4 border-[#F59E0B] shadow-inner text-4xl">
            🔒
          </div>
          <h1 className="text-3xl font-black text-[#D97706] uppercase tracking-wide">Hòm Thư Riêng Tư</h1>
          <div className="bg-[#FFFBEB] p-6 rounded-2xl border-2 border-[#FDE68A] text-[#B45309] font-bold text-base leading-relaxed text-left">
            Tính năng hòm thư là nơi trao đổi riêng tư và chỉ dành cho các tài khoản chính thức được cấp bởi quản trị viên. 
            <br/><br/>
            👉 <strong>Lưu ý:</strong> Chế độ Khách không được phép sử dụng tính năng này. Vui lòng liên hệ Quản trị viên để được cấp tài khoản chính thức nhằm trao đổi với giáo viên và quản trị!
          </div>
          <div className="pt-2">
            <a 
              href="/login" 
              className="inline-block py-4 px-8 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white font-black rounded-2xl shadow-[0_6px_0_#B45309] hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-wider text-base"
            >
              Đăng nhập tài khoản chính thức
            </a>
          </div>
        </div>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Bạn cần đăng nhập để gửi thư!");
      return;
    }

    let recId = 'admin';
    let recName = 'Quản Trị Viên';
    
    if (recipient === 'TEACHER') {
      const teacher = teachers.find(t => t.id === selectedTeacherId);
      if (teacher) {
        recId = teacher.id;
        recName = teacher.fullName;
      } else {
        alert("Vui lòng chọn một giáo viên.");
        return;
      }
    }

    sendMessage({
      senderId: currentUser.id,
      senderName: currentUser.fullName,
      receiverId: recId,
      receiverName: recName,
      subject,
      content: message
    });

    setSentStatus('Gửi thư thành công! Giáo viên/Quản trị viên sẽ phản hồi sớm nhé.');
    setSubject('');
    setMessage('');
    
    setTimeout(() => {
      setSentStatus(null);
    }, 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex-1 w-full h-full pb-10">
      <div className="flex items-center gap-4 bg-white p-6 rounded-[32px] shadow-xl border-4 border-[#F59E0B] relative overflow-visible">
        <div className="absolute -top-6 -right-4 w-20 h-20 bg-white rounded-full p-1 shadow-lg border-4 border-[#F59E0B] transform -rotate-6 hover:scale-110 transition-transform z-20 flex items-center justify-center overflow-hidden">
          <img src={pandaImg} alt="Cute Panda" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center border-4 border-[#BFDBFE] shrink-0">
          <Mail className="text-[#3B82F6]" size={32} />
        </div>
        <div className="pr-16">
          <h1 className="text-3xl font-black text-[#1E3A8A] uppercase">Hòm Thư Liên Hệ</h1>
          <p className="text-[#64748B] font-bold mt-1">Gửi thắc mắc hoặc góp ý tới Giáo viên và Quản trị viên</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-[40px] p-8 shadow-xl border-4 border-[#DBEAFE] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F0F9FF] opacity-50 rounded-bl-[100px] pointer-events-none"></div>
          
          <h2 className="text-2xl font-black text-[#1E40AF] mb-6 flex items-center gap-2">
            <Send className="text-[#3B82F6]" /> Gửi thư mới
          </h2>

          {sentStatus && (
            <div className="bg-[#ECFDF5] border-2 border-[#6EE7B7] text-[#047857] p-4 rounded-2xl font-bold mb-6 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="shrink-0 mt-0.5" />
              <span>{sentStatus}</span>
            </div>
          )}

          {!currentUser && (
            <div className="bg-[#FFFBEB] border-2 border-[#FDE68A] text-[#B45309] p-4 rounded-2xl font-bold mb-6 flex items-start gap-3">
              <AlertCircle className="shrink-0 mt-0.5" />
              <span>Bạn đang sử dụng chế độ Khách. Tính năng gửi thư chỉ dành cho tài khoản đã đăng nhập.</span>
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-black text-[#64748B] uppercase mb-2">Người nhận</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRecipient('TEACHER')}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black transition-all border-4 ${
                    recipient === 'TEACHER' 
                      ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#1E40AF] shadow-md -translate-y-1' 
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  Giáo Viên
                </button>
                <button
                  type="button"
                  onClick={() => setRecipient('ADMIN')}
                  className={`flex-1 py-4 px-6 rounded-2xl font-black transition-all border-4 ${
                    recipient === 'ADMIN' 
                      ? 'bg-[#E0F2FE] border-[#BAE6FD] text-[#1E40AF] shadow-md -translate-y-1' 
                      : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1]'
                  }`}
                >
                  Quản Trị Viên
                </button>
              </div>
            </div>

            {recipient === 'TEACHER' && (
              <div className="mb-6">
                <label className="block text-sm font-black text-[#64748B] uppercase mb-2">Chọn Giáo viên</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white transition-colors font-bold text-[#1E3A8A] outline-none"
                >
                  <option value="" disabled>-- Chọn Giáo viên --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.fullName}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-black text-[#64748B] uppercase mb-2">Tiêu đề</label>
              <input 
                type="text" 
                required
                disabled={!currentUser}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Nhập tiêu đề thư..."
                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white transition-colors font-bold text-[#1E3A8A] outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#64748B] uppercase mb-2">Nội dung thư</label>
              <textarea 
                required
                disabled={!currentUser}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Nhập nội dung bạn muốn gửi..."
                rows={6}
                className="w-full px-6 py-4 bg-[#F8FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:border-[#3B82F6] focus:bg-white transition-colors font-medium text-[#475569] outline-none resize-none disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={!currentUser || !subject.trim() || !message.trim()}
              className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] text-white font-black text-lg px-8 py-5 rounded-3xl shadow-[0_6px_0_#1E3A8A] hover:translate-y-1 hover:shadow-[0_3px_0_#1E3A8A] active:translate-y-2 active:shadow-none transition-all disabled:opacity-50 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-[0_6px_0_#94A3B8] flex items-center justify-center gap-2 uppercase tracking-wide"
            >
              GỬI THƯ <Send size={20} />
            </button>
          </form>
        </div>

        <div className="bg-[#F8FAFC] rounded-[40px] p-6 border-4 border-[#E2E8F0] flex flex-col items-center text-center overflow-y-auto max-h-[800px]">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-[#CBD5E1] flex items-center justify-center mb-4 shadow-sm shrink-0">
            <Inbox className="text-[#94A3B8]" size={40} />
          </div>
          <h3 className="text-xl font-black text-[#475569] mb-2">Hộp Thư Đến</h3>
          
          <div className="w-full space-y-3 mt-4">
            {inboxMessages.length > 0 ? inboxMessages.map(msg => (
              <div 
                key={msg.id}
                onClick={() => { if(!msg.isRead) markMessageRead(msg.id); }}
                className={`w-full p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                  !msg.isRead ? 'bg-white border-[#93C5FD] shadow-md' : 'bg-gray-50 border-gray-200 opacity-75'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`font-bold text-sm ${!msg.isRead ? 'text-[#1E3A8A]' : 'text-gray-600'}`}>{msg.senderName}</span>
                </div>
                <p className={`text-sm ${!msg.isRead ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{msg.subject}</p>
                {msg.isRead && <p className="text-xs text-gray-600 mt-2 line-clamp-3">{msg.content}</p>}
              </div>
            )) : (
              <div className="mt-8 bg-white p-4 rounded-2xl border-2 border-dashed border-[#CBD5E1]">
                <p className="text-sm font-bold text-[#94A3B8]">Trống</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
