import React, { useState, useEffect } from 'react';
import { 
  X, Send, Bot, User, Loader2, Settings, Key, CheckCircle2, 
  AlertTriangle, Eye, EyeOff, ExternalLink, Trash2, ArrowLeft,
  Sparkles, Check, Server
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Student } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  needsKey?: boolean;
  source?: 'user' | 'system';
}

export default function PetAIAssistant({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'ai', text: 'Xin chào! Mình là Trợ lí Pet AI đồng hành học tập cùng bạn. Mình có thể giúp bạn giải đáp thắc mắc môn học, bài tập và cổ vũ bạn học tốt!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAppStore(state => state.currentUser);

  // Two-Tier API Key State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [inputApiKey, setInputApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasSystemKey, setHasSystemKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize API keys from localStorage and fetch server environment status
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_custom_api_key') || '';
    setUserApiKey(savedKey);
    setInputApiKey(savedKey);

    // Check if system-level API key is configured on server/deployment (Netlify/Vercel)
    fetch('/api/chat/status')
      .then(res => res.json())
      .then(data => {
        setHasSystemKey(!!data?.hasSystemKey);
      })
      .catch(err => {
        console.warn('Could not check system API key status:', err);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  // Test API Key Connection
  const handleTestConnection = async () => {
    const keyToTest = inputApiKey.trim() || userApiKey.trim();
    if (!keyToTest && !hasSystemKey) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập API Key để kiểm tra kết nối.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/chat/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': keyToTest
        },
        body: JSON.stringify({
          apiKey: keyToTest
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || 'Kết nối Gemini API thành công! Mô hình đã sẵn sàng phản hồi.'
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Kiểm tra kết nối thất bại. Vui lòng kiểm tra lại tính hợp lệ của API Key.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save API Key to localStorage
  const handleSaveApiKey = () => {
    const trimmed = inputApiKey.trim();
    if (!trimmed) {
      handleRemoveApiKey();
      return;
    }

    localStorage.setItem('gemini_custom_api_key', trimmed);
    setUserApiKey(trimmed);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Remove Custom API Key
  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_custom_api_key');
    setUserApiKey('');
    setInputApiKey('');
    setTestResult(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    const { updateUser, sendMessage, users } = useAppStore.getState();

    // Sensitive content filter for student safe environment
    const badWordsRegex = /(tục tĩu|bạo lực|phản cảm|phản động|\bdm\b|\bđm\b|\bvkl\b|\bvl\b|\bđịt\b|\bchó\b|\blồn\b|\bcặc\b|\bngu\b|\bgiết\b)/i;
    if (badWordsRegex.test(input)) {
      let currentViolations = currentUser?.violationCount || 0;
      currentViolations += 1;
      
      let aiText = '⚠️ CẢNH BÁO: Câu hỏi của bạn chứa từ ngữ không phù hợp (tục tĩu, bạo lực, phản cảm...). Nếu bạn tiếp tục vi phạm, kết quả sẽ bị báo cáo về thầy cô phụ trách và tài khoản của bạn có thể sẽ bị khóa để bảo vệ môi trường học tập trong sạch, vững mạnh.';
      
      if (currentViolations >= 3 && currentUser) {
        aiText = '⛔ TÀI KHOẢN ĐÃ BỊ KHÓA do vi phạm nội dung không chuẩn mực nhiều lần. Thông tin đã được gửi tới giáo viên phụ trách của bạn.';
        updateUser(currentUser.id, currentUser.role, { isLocked: true, violationCount: currentViolations });
        
        const teacher = users.find(u => u.role === 'TEACHER');
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
        setTimeout(() => window.location.reload(), 3000);
      }
      return;
    }

    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const activeKey = userApiKey || localStorage.getItem('gemini_custom_api_key') || '';
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': activeKey
        },
        body: JSON.stringify({
          prompt: input,
          apiKey: activeKey,
          context: `Tên học sinh: ${currentUser?.fullName || 'Bạn'}. Lớp: ${(currentUser as Student)?.class || 'Chưa cập nhật'}. Điểm số: ${(currentUser as Student)?.points || 0}.`
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        if (data.needsKey || res.status === 400) {
          const keyRequiredMsg: Message = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            text: data.error || 'Chưa cấu hình API Key Gemini. Bạn hãy mở Cài đặt để thêm API Key cá nhân hoặc thiết lập biến GEMINI_API_KEY khi triển khai.',
            needsKey: true
          };
          setMessages(prev => [...prev, keyRequiredMsg]);
          return;
        }
        throw new Error(data.error || 'Lỗi kết nối máy chủ');
      }
      
      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: data.text || 'Tớ không biết trả lời sao nữa 😅',
        source: data.source
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Xin lỗi, tớ đang gặp sự cố kết nối. Bạn có thể kiểm tra lại API Key trong cài đặt hoặc thử lại sau nhé!'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[640px] border-4 border-[#FDE68A] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#FEF3C7] px-4 py-3.5 flex items-center justify-between border-b-4 border-[#FDE68A]">
          <div className="flex items-center gap-3">
            {isSettingsOpen ? (
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setTestResult(null);
                }}
                className="w-9 h-9 bg-white text-[#92400E] rounded-full flex items-center justify-center shadow-xs border-2 border-[#F59E0B] hover:bg-amber-50 transition-colors"
                title="Quay lại chat"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner border-2 border-[#F59E0B]">
                🤖
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-[#92400E] leading-tight">
                  {isSettingsOpen ? 'Cài Đặt Gemini API Key' : 'Trợ Lí Pet AI'}
                </h3>
                {/* 2-Tier Status Badge */}
                {!isSettingsOpen && (
                  userApiKey ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs" title="Đang sử dụng API Key người dùng tự cài đặt">
                      <Key size={10} /> Key cá nhân
                    </span>
                  ) : hasSystemKey ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-blue-100 text-blue-800 rounded-full border border-blue-300 flex items-center gap-1 shadow-2xs" title="Đang sử dụng API Key cấu hình từ hệ thống (Netlify/Vercel)">
                      <Server size={10} /> Key hệ thống
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-amber-100 text-amber-800 rounded-full border border-amber-300 flex items-center gap-1 shadow-2xs" title="Chưa có API Key, nhấn bánh răng để cài đặt">
                      <AlertTriangle size={10} /> Chưa có Key
                    </span>
                  )
                )}
              </div>
              <p className="text-[11px] font-bold text-[#D97706]">
                {isSettingsOpen ? 'Mô hình 2 lớp: Cá nhân & Triển khai Netlify/Vercel' : 'Luôn sẵn sàng đồng hành cùng bạn'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isSettingsOpen && (
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-[#92400E] hover:text-black bg-white/70 hover:bg-white rounded-xl transition-all shadow-xs border border-amber-200 cursor-pointer"
                title="Cài đặt API Key"
              >
                <Settings size={18} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white/70 hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body: Chat Area OR Settings Panel */}
        {isSettingsOpen ? (
          /* =================== SETTINGS PANEL =================== */
          <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-[#FFFBEB] to-white space-y-5">
            
            {/* Overview Card: 2-Tier Architecture Explanation */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-2.5">
              <h4 className="text-xs font-black text-[#92400E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                Mô hình 2 lớp cập nhật API Key
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${userApiKey ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  <span className="font-black text-sm px-1.5 py-0.5 rounded-md bg-white border shrink-0">1</span>
                  <div>
                    <p className="font-bold">Lớp Người dùng (Ưu tiên số 1):</p>
                    <p className="text-[11px] opacity-90">Tự nhập API Key cá nhân vào ô dưới đây. Key được lưu an toàn trong trình duyệt của bạn (localStorage), không chia sẻ ra ngoài.</p>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 ${!userApiKey && hasSystemKey ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
                  <span className="font-black text-sm px-1.5 py-0.5 rounded-md bg-white border shrink-0">2</span>
                  <div>
                    <p className="font-bold">Lớp Triển khai Netlify / Vercel (Dự phòng):</p>
                    <p className="text-[11px] opacity-90">
                      Tự động sử dụng biến môi trường <code className="font-mono bg-white px-1 py-0.5 rounded border text-[10px]">GEMINI_API_KEY</code> khi deploy lên Netlify hoặc Vercel nếu người dùng chưa cài đặt key riêng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* API Key Input Section */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={14} className="text-amber-600" />
                  Gemini API Key của bạn
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                >
                  Lấy key miễn phí <ExternalLink size={12} />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={inputApiKey}
                  onChange={(e) => {
                    setInputApiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="Dán API Key (bắt đầu bằng AIzaSy...)"
                  className="w-full px-4 py-3 pr-11 text-xs font-mono bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  title={showApiKey ? "Ẩn key" : "Hiện key"}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Status Message / Test Result */}
              {testResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div className="leading-relaxed font-medium">{testResult.message}</div>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  Đã cập nhật cấu hình API Key thành công!
                </div>
              )}

              {/* Action Buttons: Test Connection & Save */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting || (!inputApiKey.trim() && !userApiKey && !hasSystemKey)}
                  className="py-3 px-3.5 bg-amber-100 hover:bg-amber-200 text-[#92400E] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors border border-amber-300 shadow-2xs cursor-pointer"
                >
                  {isTesting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Đang kiểm tra...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Kiểm tra kết nối
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveApiKey}
                  className="py-3 px-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Check size={15} /> Lưu lại
                </button>
              </div>

              {/* Reset to System Key Button */}
              {userApiKey && (
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[11px] text-gray-500 font-medium">
                    Đang lưu trữ key cá nhân trên máy
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveApiKey}
                    className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 size={12} /> Xóa key cá nhân
                  </button>
                </div>
              )}
            </div>

            {/* Deployment Guide Hint */}
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed space-y-1.5">
              <p className="font-bold flex items-center gap-1">
                <Server size={13} className="text-amber-700" /> Hướng dẫn khi Deploy lên Netlify hoặc Vercel:
              </p>
              <ul className="list-disc pl-4 space-y-1 opacity-90 text-[10.5px]">
                <li><strong>Vercel:</strong> Vào Project Settings &gt; Environment Variables &gt; thêm Key: <code className="font-mono bg-white px-1 py-0.5 rounded border">GEMINI_API_KEY</code> với giá trị API Key của bạn.</li>
                <li><strong>Netlify:</strong> Vào Site configuration &gt; Environment variables &gt; thêm Key: <code className="font-mono bg-white px-1 py-0.5 rounded border">GEMINI_API_KEY</code>.</li>
              </ul>
            </div>

            {/* Back to Chat Button */}
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                setTestResult(null);
              }}
              className="w-full py-3 bg-white border-2 border-gray-200 hover:border-amber-400 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ← Quay lại khung trò chuyện
            </button>
          </div>
        ) : (
          /* =================== CHAT VIEW =================== */
          <>
            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 text-xs p-3 rounded-xl font-medium mb-4 space-y-1.5">
                <p><strong>Lưu ý:</strong> Pet AI hỗ trợ giải đáp các câu hỏi học tập môn Toán và các môn học. Hãy luôn đối chiếu kết quả với bài giảng của thầy cô nhé!</p>
                {!userApiKey && !hasSystemKey && (
                  <p className="text-amber-700 font-bold flex items-center gap-1 pt-0.5">
                    <Key size={13} /> Bạn chưa cài đặt API Key. Nhấn biểu tượng <Settings size={12} className="inline" /> góc trên để cài đặt.
                  </p>
                )}
              </div>

              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-[#3B82F6] text-white shadow-xs' : 'bg-[#FEF3C7] text-[#D97706] shadow-xs'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`max-w-[80%] p-3.5 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-[#3B82F6] text-white rounded-tr-none shadow-xs' 
                      : 'bg-white border-2 border-[#FDE68A] text-gray-800 rounded-tl-none shadow-xs'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    
                    {/* Prompt to open settings when key is needed */}
                    {msg.needsKey && (
                      <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="mt-2.5 px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <Settings size={13} /> Mở Cài đặt API Key ngay
                      </button>
                    )}

                    {msg.sender === 'ai' && msg.text.includes('sự cố kết nối') && !msg.needsKey && (
                      <div className="mt-2 pt-2 border-t border-amber-100 flex items-center gap-2">
                        <button
                          onClick={() => setIsSettingsOpen(true)}
                          className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1"
                        >
                          <Settings size={12} /> Kiểm tra API Key trong Cài đặt
                        </button>
                      </div>
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
                    <span className="text-sm text-gray-500 font-medium">Pet AI đang suy nghĩ...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3.5 bg-white border-t-2 border-gray-100 flex gap-2 items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập câu hỏi học tập của bạn..."
                className="flex-1 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#FCD34D] text-sm"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 bg-[#F59E0B] text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#D97706] transition-colors shadow-xs cursor-pointer"
                title="Gửi câu hỏi"
              >
                <Send size={18} />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
