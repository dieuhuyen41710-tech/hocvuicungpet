import React, { useState } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Student } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

export default function PetAIAssistant({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Xin chào! Mình là Trợ lí Pet AI. Mình có thể giúp gì cho bạn hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAppStore(state => state.currentUser);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    
    const { updateUser, sendMessage, users } = useAppStore.getState();

    const badWordsRegex = /(tục tĩu|bạo lực|phản cảm|phản động|\bdm\b|\bđm\b|\bvkl\b|\bvl\b|\bđịt\b|\bchó\b|\blồn\b|\bcặc\b|\bngu\b|\bgiết\b)/i;
    if (badWordsRegex.test(input)) {
      let currentViolations = currentUser?.violationCount || 0;
      currentViolations += 1;
      
      let aiText = '⚠️ CẢNH BÁO: Câu hỏi của bạn chứa từ ngữ không phù hợp (tục tĩu, bạo lực, phản cảm...). Nếu bạn tiếp tục vi phạm, kết quả sẽ bị báo cáo về thầy cô phụ trách và tài khoản của bạn có thể sẽ bị khóa để bảo vệ môi trường học tập trong sạch, vững mạnh.';
      
      if (currentViolations >= 3 && currentUser) {
        aiText = '⛔ TÀI KHOẢN ĐÃ BỊ KHÓA do vi phạm nội dung không chuẩn mực nhiều lần. Thông tin đã được gửi tới giáo viên phụ trách của bạn.';
        
        // Lock account
        updateUser(currentUser.id, currentUser.role, { isLocked: true, violationCount: currentViolations });
        
        // Report to teacher
        const teacher = users.find(u => u.role === 'TEACHER'); // Get any teacher or specific if class matches
        if (teacher) {
          sendMessage({
            senderId: 'SYSTEM',
            senderName: 'Hệ thống Pet AI',
            receiverId: teacher.id,
            receiverName: teacher.fullName,
            subject: `BÁO CÁO VI PHẠM: Học sinh ${currentUser.fullName}`,
            content: `Học sinh ${currentUser.fullName} đã liên tục gửi nội dung không phù hợp cho Pet AI (lần thứ ${currentViolations}).\nNội dung vi phạm: "${input}".\nTài khoản của học sinh này đã bị tạm khóa tự động.`
          });
        }
      } else if (currentUser) {
        updateUser(currentUser.id, currentUser.role, { violationCount: currentViolations });
      }

      const warningMsg: Message = { 
        id: Date.now().toString() + 'ai', 
        sender: 'ai', 
        text: aiText
      };
      setMessages(prev => [...prev, newMsg, warningMsg]);
      setInput('');
      
      if (currentViolations >= 3) {
        setTimeout(() => window.location.reload(), 3000); // refresh to trigger login redirect if locked
      }
      return;
    }

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: input,
          context: `Tên học sinh: ${currentUser?.fullName || 'Bạn'}. Lớp: ${(currentUser as Student)?.class || 'Chưa cập nhật'}. Điểm số: ${(currentUser as Student)?.points || 0}.`
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Lỗi kết nối máy chủ');
      }
      
      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: data.text || 'Tớ không biết trả lời sao nữa 😅'
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Xin lỗi, tớ đang gặp sự cố kết nối. Cậu vui lòng thử lại sau nhé!'
      };
      setMessages(prev => [...prev, errorMsg]);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[600px] border-4 border-[#FDE68A] overflow-hidden">
        {/* Header */}
        <div className="bg-[#FEF3C7] p-4 flex items-center justify-between border-b-4 border-[#FDE68A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner border-2 border-[#F59E0B]">
              🤖
            </div>
            <div>
              <h3 className="font-black text-[#92400E]">Trợ Lí Pet AI</h3>
              <p className="text-xs font-bold text-[#D97706]">Luôn sẵn sàng giúp đỡ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white/50 hover:bg-white rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-3 rounded-xl font-medium mb-4 space-y-2">
            <p><strong>Lưu ý 1:</strong> Đây là công cụ AI hỗ trợ, có thể mắc sai sót. Bạn hãy hỏi lại thầy (cô) giáo của mình trước khi sử dụng các kết quả của AI nhé!</p>
            <p><strong>Lưu ý 2:</strong> Hãy hỏi văn minh để đảm bảo môi trường học tập lành mạnh. Nếu bạn vi phạm sẽ bị khoá tài khoản và báo cáo tới giáo viên phụ trách. Hãy cùng Pet học hiệu quả và lành mạnh bạn nhé!</p>
          </div>

          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-[#3B82F6] text-white' : 'bg-[#FEF3C7] text-[#D97706]'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`max-w-[75%] p-3 rounded-2xl ${
                msg.sender === 'user' 
                  ? 'bg-[#3B82F6] text-white rounded-tr-none' 
                  : 'bg-white border-2 border-[#FDE68A] text-gray-700 rounded-tl-none shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                {msg.sender === 'ai' && msg.text.includes('sự cố kết nối') && (
                  <a 
                    href="https://chatgpt.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 block text-xs font-bold text-blue-600 hover:underline"
                  >
                    👉 Thử dùng ChatGPT tại đây
                  </a>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border-2 border-[#FDE68A] p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-[#D97706]" />
                <span className="text-sm text-gray-500 font-medium">Đang suy nghĩ...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t-2 border-gray-100 flex gap-2">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhập câu hỏi của bạn..."
            className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-[#FCD34D] text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 bg-[#F59E0B] text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#D97706] transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
