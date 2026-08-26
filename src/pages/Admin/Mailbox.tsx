import React, { useState } from 'react';
import { Mail, Edit3, Send, Archive, X, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import Modal from '../../components/Modal';

export default function AdminMailbox() {
  const { currentUser, messages, sendMessage, archiveMessage, markMessageRead, students, users } = useAppStore();
  const [activeTab, setActiveTab] = useState<'INBOX' | 'SENT' | 'ARCHIVED'>('INBOX');
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [composeData, setComposeData] = useState({ receiverId: '', subject: '', content: '' });

  const allUsers = [...students, ...users];

  const myMessages = messages.filter(m => 
    (m.receiverId === currentUser?.id || m.senderId === currentUser?.id)
  );

  const inbox = myMessages.filter(m => m.receiverId === currentUser?.id && !m.isArchived);
  const sent = myMessages.filter(m => m.senderId === currentUser?.id);
  const archived = myMessages.filter(m => m.receiverId === currentUser?.id && m.isArchived);

  const displayMessages = activeTab === 'INBOX' ? inbox : activeTab === 'SENT' ? sent : archived;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const receiver = allUsers.find(s => s.id === composeData.receiverId);
    if (!receiver) return;

    sendMessage({
      senderId: currentUser?.id || '',
      senderName: currentUser?.fullName || 'Quản trị viên',
      receiverId: receiver.id,
      receiverName: receiver.fullName,
      subject: composeData.subject,
      content: composeData.content
    });

    setIsComposeOpen(false);
    setComposeData({ receiverId: '', subject: '', content: '' });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-[#92400E] flex items-center gap-3">
          <Mail size={32} className="text-[#F59E0B]" />
          Hòm Thư Hệ Thống
        </h1>
        <button 
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-2 bg-[#F59E0B] text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-[#D97706] transition-colors"
        >
          <Edit3 size={20} /> Soạn thông báo
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[24px] shadow-sm border-4 border-[#FDE68A] overflow-hidden flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-100 p-4 space-y-2 shrink-0 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab('INBOX')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold border-2 transition-colors ${activeTab === 'INBOX' ? 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]' : 'text-gray-600 hover:bg-white border-transparent'}`}
          >
            <div className="flex items-center gap-3"><Mail size={18} /> Hộp thư đến</div>
            {inbox.filter(m => !m.isRead).length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{inbox.filter(m => !m.isRead).length}</span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('SENT')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border-2 transition-colors ${activeTab === 'SENT' ? 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]' : 'text-gray-600 hover:bg-white border-transparent'}`}
          >
            <Send size={18} /> Đã gửi
          </button>
          <button 
            onClick={() => setActiveTab('ARCHIVED')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold border-2 transition-colors ${activeTab === 'ARCHIVED' ? 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]' : 'text-gray-600 hover:bg-white border-transparent'}`}
          >
            <Archive size={18} /> Lưu trữ
          </button>
        </div>

        {/* Mail List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {displayMessages.length > 0 ? displayMessages.map(mail => (
            <div 
              key={mail.id} 
              onClick={() => { if(!mail.isRead) markMessageRead(mail.id); }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                !mail.isRead && activeTab === 'INBOX'
                  ? 'bg-white border-[#FDE68A] shadow-sm' 
                  : 'bg-gray-50 border-gray-100'
              } hover:border-[#F59E0B] hover:shadow-md group`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold ${!mail.isRead && activeTab === 'INBOX' ? 'text-gray-900' : 'text-gray-600'}`}>
                  {activeTab === 'SENT' ? `Gửi đến: ${mail.receiverName}` : mail.senderName}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${!mail.isRead && activeTab === 'INBOX' ? 'text-[#F59E0B]' : 'text-gray-400'}`}>
                    {new Date(mail.timestamp).toLocaleString('vi-VN')}
                  </span>
                  {activeTab === 'INBOX' && !mail.isArchived && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); archiveMessage(mail.id); }}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#F59E0B] transition-opacity"
                      title="Lưu trữ"
                    >
                      <Archive size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className={`text-sm ${!mail.isRead && activeTab === 'INBOX' ? 'font-bold text-gray-800' : 'text-gray-500'}`}>{mail.subject}</p>
              <p className="text-sm mt-2 text-gray-600">{mail.content}</p>
            </div>
          )) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2">
              <Mail size={48} className="opacity-20" />
              <p className="font-bold">Không có tin nhắn nào</p>
            </div>
          )}
        </div>
      </div>

      <Modal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} title="Soạn thông báo hệ thống">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Gửi đến tài khoản</label>
            <select
              required
              value={composeData.receiverId}
              onChange={e => setComposeData({...composeData, receiverId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            >
              <option value="">-- Chọn người dùng --</option>
              {allUsers.map(s => (
                <option key={s.id} value={s.id}>{s.fullName} ({s.role === 'STUDENT' ? `HS - Lớp ${(s as any).class}` : s.role === 'TEACHER' ? 'GV' : 'QTV'})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Tiêu đề</label>
            <input
              required
              type="text"
              value={composeData.subject}
              onChange={e => setComposeData({...composeData, subject: e.target.value})}
              placeholder="VD: Cập nhật hệ thống..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nội dung</label>
            <textarea
              required
              value={composeData.content}
              onChange={e => setComposeData({...composeData, content: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#F59E0B] focus:outline-none h-32"
              placeholder="Nội dung tin nhắn..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsComposeOpen(false)}
              className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-[#F59E0B] hover:bg-[#D97706] shadow-md flex items-center gap-2"
            >
              <Send size={18} /> Gửi tin
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
