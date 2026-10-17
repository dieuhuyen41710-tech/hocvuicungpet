import React, { useState, useEffect } from 'react';
import { 
  X, Send, Bot, User, Loader2, Settings, Key, CheckCircle2, 
  AlertTriangle, Eye, EyeOff, ExternalLink, Trash2, ArrowLeft,
  Sparkles, Check, Server, ShieldCheck, RefreshCw, HelpCircle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Student, PetDiagnosticContext, Scene3DCommand } from '../types';
import InteractiveQuizCard, { QuizData } from './InteractiveQuizCard';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  quiz?: QuizData | null;
  scene3DCommand?: Scene3DCommand | null;
  needsKey?: boolean;
  source?: 'personal' | 'system' | 'both';
  fallbackNotice?: string;
  errorCode?: string;
  canEnableFallback?: boolean;
}

export default function PetAIAssistant({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      sender: 'ai', 
      text: 'Xin chào! Tớ là Trợ lí Pet AI đồng hành học tập cùng cậu. Tớ có thể giải đáp bài tập, kiến thức Toán và cổ vũ cậu đạt nhiều điểm 10! Cậu muốn hỏi tớ điều gì hôm nay nào? 🐾' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const currentUser = useAppStore(state => state.currentUser);

  // Two-Tier API Key & Mode State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string>('');
  const [inputApiKey, setInputApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [hasSystemKey, setHasSystemKey] = useState<boolean>(false);
  
  // Selection mode: 'auto' | 'personal' | 'system'
  const [keyMode, setKeyMode] = useState<'auto' | 'personal' | 'system'>('auto');
  // Allow fallback when personal key fails
  const [allowFallback, setAllowFallback] = useState<boolean>(true);

  // Testing connection state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ 
    success: boolean; 
    message: string; 
    source?: string;
    model?: string;
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const petDiagnosticContext = useAppStore(state => state.petDiagnosticContext);
  const clearPetAIDiagnostic = useAppStore(state => state.clearPetAIDiagnostic);
  const setScene3DCommand = useAppStore(state => state.setScene3DCommand);

  // Helper to extract quiz block from AI response
  const parseQuizFromText = (text: string): { displayText: string; quiz: QuizData | null } => {
    if (!text) return { displayText: '', quiz: null };

    const normalizeCorrectIndex = (parsed: any): number => {
      if (typeof parsed.correctIndex === 'number') return parsed.correctIndex;
      if (typeof parsed.correctOptionIndex === 'number') return parsed.correctOptionIndex;
      const ans = parsed.correct_answer || parsed.answer || parsed.correctOption;
      if (typeof ans === 'string') {
        const letter = ans.trim().toUpperCase().charAt(0);
        if (letter === 'A') return 0;
        if (letter === 'B') return 1;
        if (letter === 'C') return 2;
        if (letter === 'D') return 3;
      }
      return 0;
    };

    // 1. Match ```quiz ... ``` or ```json ... ```
    const codeBlockMatch = text.match(/```(?:quiz|json)?\s*(\{[\s\S]*?"question"[\s\S]*?\})\s*```/i);
    if (codeBlockMatch) {
      try {
        const parsed = JSON.parse(codeBlockMatch[1]);
        if (parsed.question && Array.isArray(parsed.options) && parsed.options.length > 0) {
          const displayText = text.replace(codeBlockMatch[0], '').trim();
          return {
            displayText,
            quiz: {
              question: parsed.question,
              options: parsed.options,
              correctIndex: normalizeCorrectIndex(parsed),
              explanation: parsed.explanation || ''
            }
          };
        }
      } catch (e) {
        // Fallback
      }
    }

    // 2. Match raw JSON object if model omitted backticks
    const rawJsonMatch = text.match(/\{[\s\n\r]*"question":[\s\S]*?"options":[\s\S]*?\}/);
    if (rawJsonMatch) {
      try {
        const parsed = JSON.parse(rawJsonMatch[0]);
        if (parsed.question && Array.isArray(parsed.options) && parsed.options.length > 0) {
          const displayText = text.replace(rawJsonMatch[0], '').trim();
          return {
            displayText,
            quiz: {
              question: parsed.question,
              options: parsed.options,
              correctIndex: normalizeCorrectIndex(parsed),
              explanation: parsed.explanation || ''
            }
          };
        }
      } catch (e) {
        // Fallback
      }
    }

    return { displayText: text, quiz: null };
  };

  const parse3DCommandFromText = (text: string): { displayText: string; command: Scene3DCommand | null } => {
    if (!text) return { displayText: '', command: null };
    const cmdBlockMatch = text.match(/```3d_cmd\s*([\s\S]*?)\s*```/i);
    if (cmdBlockMatch) {
      try {
        const parsed = JSON.parse(cmdBlockMatch[1]);
        if (parsed.command) {
          return {
            displayText: text.replace(cmdBlockMatch[0], '').trim(),
            command: parsed
          };
        }
      } catch (e) {
        console.error("Error parsing 3D command:", e);
      }
    }
    return { displayText: text, command: null };
  };

  // Mask helper for displaying saved personal key securely (e.g. AIzaSy...****abcd)
  const getMaskedKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 10) return '********';
    return `${key.slice(0, 6)}...****${key.slice(-4)}`;
  };

  // Diagnostic handler when student clicks "Hỏi Pet vì sao sai"
  const handleSendDiagnostic = async (ctx: PetDiagnosticContext) => {
    const diagnosticPrompt = `🐾 Pet ơi, tớ đang làm bài "${ctx.lessonName}" và trả lời câu này nhưng bị chọn nhầm:
- Đề bài: ${ctx.questionContent}
- Các phương án trắc nghiệm:
${ctx.options.map(opt => `  ${opt}`).join('\n')}
- Phương án tớ đã chọn (BỊ SAI): ${ctx.selectedOptionText}
${ctx.correctOptionText ? `- Phương án đúng: ${ctx.correctOptionText}` : ''}

Nhờ Pet:
1. Chỉ ra tớ đã nhầm lẫn ở đâu (ví dụ: nhầm công thức diện tích xung quanh với diện tích toàn phần hoặc thể tích, quên đổi đơn vị đo, nhầm số đối với nghịch đảo, hay sai bước tính nào).
2. Hướng dẫn từng bước tư duy theo phương pháp gợi mở (Socratic) để tớ tự hiểu bản chất.
3. Tạo cho tớ một câu hỏi tương tự có 4 đáp án A, B, C, D bọc trong khối \`\`\`quiz JSON để tớ làm lại và kiểm tra kiến thức nhé!`;

    const userBubble: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: `🐾 Pet ơi, tớ vừa làm câu này trong bài "${ctx.lessonName}" nhưng bị chọn sai: "${ctx.questionContent}". Cậu chỉ ra chỗ tớ nhầm và hướng dẫn tớ với nhé!`
    };

    setMessages(prev => [...prev, userBubble]);
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
          prompt: diagnosticPrompt,
          apiKey: activeKey,
          mode: keyMode,
          allowFallback,
          isDiagnostic: true,
          context: `Bài học: ${ctx.lessonName}. Học sinh: ${currentUser?.fullName || 'Học sinh'}.`
        })
      });

      const data = await res.json();
      if (!res.ok) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.error || 'Đã xảy ra sự cố khi gọi Gemini AI.',
          needsKey: data.needsConfig || data.errorCode === 'NO_KEY_CONFIGURED' || data.errorCode === 'NO_PERSONAL_KEY' || data.errorCode === 'NO_SYSTEM_KEY',
          errorCode: data.errorCode,
          canEnableFallback: data.canEnableFallback
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      const { displayText, quiz } = parseQuizFromText(data.text || '');
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: displayText || data.text || 'Tớ đã phân tích chỗ nhầm lẫn cho cậu rồi nè!',
        quiz,
        source: data.source,
        fallbackNotice: data.fallbackNotice
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Xin lỗi cậu, tớ đang gặp sự cố kết nối mạng đến máy chủ. Cậu kiểm tra lại kết nối mạng hoặc thử lại sau ít phút nhé!'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Watch for diagnostic requests from lesson view
  useEffect(() => {
    if (isOpen && petDiagnosticContext) {
      const ctx = { ...petDiagnosticContext };
      clearPetAIDiagnostic();
      setIsSettingsOpen(false);
      handleSendDiagnostic(ctx);
    }
  }, [isOpen, petDiagnosticContext]);

  // Load preferences from localStorage and check Vercel system key status
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_custom_api_key') || '';
    const savedMode = (localStorage.getItem('gemini_key_mode') as 'auto' | 'personal' | 'system') || 'auto';
    const savedFallback = localStorage.getItem('gemini_allow_fallback') !== 'false'; // default true

    setUserApiKey(savedKey);
    setInputApiKey(savedKey);
    setKeyMode(savedMode);
    setAllowFallback(savedFallback);

    // Fetch system-level API key availability from backend /api/chat or /api/chat/status
    fetch('/api/chat')
      .then(res => res.json())
      .then(data => {
        setHasSystemKey(!!data?.hasSystemKey);
      })
      .catch(err => {
        console.warn('Không thể kiểm tra trạng thái API Key hệ thống:', err);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  // Active Key Source description for display
  const getActiveSourceLabel = () => {
    if (keyMode === 'system') {
      return hasSystemKey ? 'Khóa mặc định (Vercel)' : 'Khóa hệ thống (Chưa cấu hình)';
    }
    if (keyMode === 'personal') {
      return userApiKey ? 'Khóa cá nhân' : 'Khóa cá nhân (Chưa nhập)';
    }
    // Auto
    if (userApiKey) return 'Khóa cá nhân (Tự động)';
    if (hasSystemKey) return 'Khóa mặc định (Tự động)';
    return 'Chưa có khóa';
  };

  // Test API Key Connection
  const handleTestConnection = async (specificSource?: 'personal' | 'system') => {
    const targetSource = specificSource || (keyMode === 'system' ? 'system' : 'personal');
    const keyToTest = (inputApiKey || userApiKey).trim();

    if (targetSource === 'personal' && !keyToTest) {
      setTestResult({
        success: false,
        message: 'Vui lòng nhập API Key cá nhân vào ô bên trên để kiểm tra kết nối.'
      });
      return;
    }

    if (targetSource === 'system' && !hasSystemKey) {
      setTestResult({
        success: false,
        message: 'Chưa cấu hình biến môi trường GEMINI_API_KEY trên Vercel. Hãy thiết lập trên Vercel Dashboard trước khi kiểm tra.'
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': targetSource === 'personal' ? keyToTest : ''
        },
        body: JSON.stringify({
          isTest: true,
          testSource: targetSource,
          mode: targetSource,
          apiKey: targetSource === 'personal' ? keyToTest : ''
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: data.message || 'Kết nối Gemini API thành công! Mô hình đã sẵn sàng phản hồi.',
          source: data.source,
          model: data.model
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || 'Kiểm tra kết nối thất bại. Vui lòng kiểm tra lại khóa.'
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Không thể kết nối đến máy chủ hoặc dịch vụ Google. Vui lòng kiểm tra lại đường truyền.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Save Settings to localStorage
  const handleSaveSettings = () => {
    const trimmed = inputApiKey.trim();
    localStorage.setItem('gemini_custom_api_key', trimmed);
    localStorage.setItem('gemini_key_mode', keyMode);
    localStorage.setItem('gemini_allow_fallback', allowFallback ? 'true' : 'false');
    
    setUserApiKey(trimmed);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Remove Personal Key
  const handleRemoveApiKey = () => {
    localStorage.removeItem('gemini_custom_api_key');
    setUserApiKey('');
    setInputApiKey('');
    setTestResult(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Send Chat Message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    const { updateUser, sendMessage, users } = useAppStore.getState();

    // Sensitive content filter for student safety
    const badWordsRegex = /(tục tĩu|bạo lực|phản cảm|phản động|\bdm\b|\bđm\b|\bvkl\b|\bvl\b|\bđịt\b|\bchó\b|\blồn\b|\bcặc\b|\bngu\b|\bgiết\b)/i;
    if (badWordsRegex.test(input)) {
      let currentViolations = currentUser?.violationCount || 0;
      currentViolations += 1;
      
      let aiText = '⚠️ CẢNH BÁO: Tin nhắn chứa từ ngữ không phù hợp với chuẩn mực học đường. Hãy giữ gìn môi trường học tập lành mạnh nhé bạn nhỏ! 🐾';
      
      if (currentViolations >= 3 && currentUser) {
        aiText = '⛔ TÀI KHOẢN ĐÃ BỊ TẠM KHÓA do gửi nội dung vi phạm nhiều lần. Báo cáo đã được gửi tới giáo viên phụ trách.';
        updateUser(currentUser.id, currentUser.role, { isLocked: true, violationCount: currentViolations });
        
        const teacher = users.find(u => u.role === 'TEACHER');
        if (teacher) {
          sendMessage({
            senderId: 'SYSTEM',
            senderName: 'Hệ thống Pet AI',
            receiverId: teacher.id,
            receiverName: teacher.fullName,
            subject: `BÁO CÁO VI PHẠM: Học sinh ${currentUser.fullName}`,
            content: `Học sinh ${currentUser.fullName} đã liên tục gửi nội dung không phù hợp cho Pet AI (lần thứ ${currentViolations}).\nNội dung: "${input}".\nTài khoản đã được tự động tạm khóa.`
          });
        }
      } else if (currentUser) {
        updateUser(currentUser.id, currentUser.role, { violationCount: currentViolations });
      }

      const warningMsg: Message = { 
        id: (Date.now() + 1).toString(), 
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
          mode: keyMode,
          allowFallback,
          context: `Tên học sinh: ${currentUser?.fullName || 'Bạn'}. Lớp: ${(currentUser as Student)?.class || 'Chưa cập nhật'}. Điểm số: ${(currentUser as Student)?.points || 0}.`
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: data.error || 'Đã xảy ra sự cố khi gọi Gemini AI.',
          needsKey: data.needsConfig || data.errorCode === 'NO_KEY_CONFIGURED' || data.errorCode === 'NO_PERSONAL_KEY' || data.errorCode === 'NO_SYSTEM_KEY',
          errorCode: data.errorCode,
          canEnableFallback: data.canEnableFallback
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }
      
      const { displayText, quiz } = parseQuizFromText(data.text || '');
      const { displayText: finalDisplayText, command } = parse3DCommandFromText(displayText || data.text || '');
      if (command) setScene3DCommand(command);
      
      const aiResponse: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: finalDisplayText || data.text || 'Tớ đã nhận được câu hỏi nhưng chưa có câu trả lời phù hợp 🐾',
        quiz,
        scene3DCommand: command,
        source: data.source,
        fallbackNotice: data.fallbackNotice
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Xin lỗi cậu, tớ đang gặp sự cố kết nối mạng đến máy chủ. Cậu kiểm tra lại kết nối mạng hoặc thử lại sau ít phút nhé!'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col h-[650px] border-4 border-[#FDE68A] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#FEF3C7] px-4 py-3 flex items-center justify-between border-b-4 border-[#FDE68A]">
          <div className="flex items-center gap-3">
            {isSettingsOpen ? (
              <button
                onClick={() => {
                  setIsSettingsOpen(false);
                  setTestResult(null);
                }}
                className="w-9 h-9 bg-white text-[#92400E] rounded-full flex items-center justify-center shadow-xs border-2 border-[#F59E0B] hover:bg-amber-50 transition-colors cursor-pointer"
                title="Quay lại chat"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner border-2 border-[#F59E0B]">
                🐾
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-[#92400E] leading-tight text-base">
                  {isSettingsOpen ? 'Cài Đặt Gemini API Key' : 'Trợ Lí Pet AI'}
                </h3>
                {/* Status Badge */}
                {!isSettingsOpen && (
                  (keyMode === 'personal' && userApiKey) ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
                      <Key size={10} /> Key cá nhân
                    </span>
                  ) : (keyMode === 'system' && hasSystemKey) ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-blue-100 text-blue-800 rounded-full border border-blue-300 flex items-center gap-1 shadow-2xs">
                      <Server size={10} /> Key mặc định Vercel
                    </span>
                  ) : (keyMode === 'auto' && (userApiKey || hasSystemKey)) ? (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-purple-100 text-purple-800 rounded-full border border-purple-300 flex items-center gap-1 shadow-2xs">
                      <Sparkles size={10} /> Tự động: {userApiKey ? 'Cá nhân' : 'Vercel'}
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-black bg-rose-100 text-rose-800 rounded-full border border-rose-300 flex items-center gap-1 shadow-2xs">
                      <AlertTriangle size={10} /> Chưa có Key
                    </span>
                  )
                )}
              </div>
              <p className="text-[11px] font-bold text-[#D97706]">
                {isSettingsOpen ? 'Cơ chế 2 lớp: Cá nhân & Triển khai Vercel' : 'Đồng hành học tập cùng bạn mọi lúc'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {!isSettingsOpen && (
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-[#92400E] hover:text-black bg-white/80 hover:bg-white rounded-xl transition-all shadow-xs border border-amber-200 cursor-pointer"
                title="Mở cài đặt API Key"
              >
                <Settings size={18} />
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white/80 hover:bg-white rounded-xl transition-colors cursor-pointer"
              title="Đóng cửa sổ"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isSettingsOpen ? (
          /* =================== SETTINGS VIEW =================== */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 bg-gradient-to-b from-[#FFFBEB] to-white space-y-4">
            
            {/* Mode Selection Cards */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-3">
              <label className="text-xs font-black text-[#92400E] uppercase tracking-wider flex items-center justify-between">
                <span>Chế độ sử dụng API Key</span>
                <span className="text-[10px] normal-case font-semibold text-gray-500">Mô hình 2 lớp độc lập</span>
              </label>

              <div className="space-y-2">
                {/* Option 1: Auto */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  keyMode === 'auto' ? 'border-purple-400 bg-purple-50/70 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input 
                    type="radio" 
                    name="keyMode" 
                    value="auto" 
                    checked={keyMode === 'auto'} 
                    onChange={() => setKeyMode('auto')} 
                    className="mt-0.5 text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-purple-600" />
                      Chế độ Tự Động (Khuyến nghị)
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Ưu tiên dùng Khóa cá nhân nếu bạn có nhập; nếu chưa có sẽ tự động dùng Khóa mặc định Vercel của hệ thống.
                    </p>
                  </div>
                </label>

                {/* Option 2: Personal Key */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  keyMode === 'personal' ? 'border-emerald-400 bg-emerald-50/70 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input 
                    type="radio" 
                    name="keyMode" 
                    value="personal" 
                    checked={keyMode === 'personal'} 
                    onChange={() => setKeyMode('personal')} 
                    className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Key size={13} className="text-emerald-600" />
                      Chỉ dùng API Key Cá Nhân của tôi
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Tất cả yêu cầu AI sẽ sử dụng khóa của bạn. Không dùng khóa hệ thống.
                    </p>
                  </div>
                </label>

                {/* Option 3: System Key */}
                <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  keyMode === 'system' ? 'border-blue-400 bg-blue-50/70 shadow-xs' : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <input 
                    type="radio" 
                    name="keyMode" 
                    value="system" 
                    checked={keyMode === 'system'} 
                    onChange={() => setKeyMode('system')} 
                    className="mt-0.5 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-gray-800 flex items-center gap-1.5">
                      <Server size={13} className="text-blue-600" />
                      Dùng API Key Mặc Định của Thầy/Cô (Vercel)
                    </p>
                    <p className="text-[11px] text-gray-600 mt-0.5 leading-snug">
                      Sử dụng biến <code className="bg-white px-1 py-0.5 rounded border font-mono">GEMINI_API_KEY</code> do giáo viên cấu hình trên Vercel. 
                      {hasSystemKey ? ' (✅ Đã sẵn sàng)' : ' (⚠️ Chưa cấu hình trên Vercel)'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Fallback Checkbox */}
              <div className="pt-2 border-t border-amber-100">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={allowFallback} 
                    onChange={(e) => setAllowFallback(e.target.checked)} 
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-[11.5px] text-gray-700 leading-snug">
                    <strong>Chính sách dự phòng an toàn:</strong> Tự động chuyển sang Khóa mặc định hệ thống nếu Khóa cá nhân bị hết hạn mức (Quota 429) hoặc gặp lỗi tạm thời.
                  </span>
                </label>
              </div>
            </div>

            {/* Personal Key Input Section */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={14} className="text-amber-600" />
                  API Key Cá Nhân của bạn
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

              {/* Masked status if key is already saved */}
              {userApiKey && !inputApiKey && (
                <div className="p-2.5 bg-gray-50 rounded-xl border flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-700">{getMaskedKey(userApiKey)}</span>
                  <button
                    type="button"
                    onClick={() => setInputApiKey(userApiKey)}
                    className="text-xs font-sans text-blue-600 hover:underline font-bold"
                  >
                    Thay đổi
                  </button>
                </div>
              )}

              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={inputApiKey}
                  onChange={(e) => {
                    setInputApiKey(e.target.value);
                    setTestResult(null);
                  }}
                  placeholder="Dán API Key (bắt đầu bằng AIzaSy...)"
                  className="w-full px-3.5 py-2.5 pr-11 text-xs font-mono bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all"
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

              {/* Privacy Notice */}
              <p className="text-[10.5px] text-gray-500 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600 shrink-0" />
                Khóa cá nhân được lưu an toàn trong trình duyệt (localStorage), không lưu vào database và không chia sẻ cho người khác.
              </p>

              {/* Test Result Box */}
              {testResult && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                  testResult.success 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}>
                  {testResult.success ? (
                    <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertTriangle size={16} className="shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div className="leading-relaxed font-medium">
                    <p>{testResult.message}</p>
                    {testResult.model && (
                      <p className="text-[10px] opacity-80 mt-0.5">Model: {testResult.model}</p>
                    )}
                  </div>
                </div>
              )}

              {saveSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check size={16} className="text-emerald-600" />
                  Đã lưu cấu hình thành công!
                </div>
              )}

              {/* Action Buttons: Test Connection & Save */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleTestConnection()}
                  disabled={isTesting}
                  className="py-2.5 px-3 bg-amber-100 hover:bg-amber-200 text-[#92400E] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 transition-colors border border-amber-300 shadow-2xs cursor-pointer"
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
                  onClick={handleSaveSettings}
                  className="py-2.5 px-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs hover:shadow-md transition-all cursor-pointer"
                >
                  <Check size={15} /> Lưu cài đặt
                </button>
              </div>

              {/* Delete Key option */}
              {userApiKey && (
                <div className="pt-2 border-t border-gray-100 flex justify-between items-center text-[11px]">
                  <span className="text-gray-500">Đang lưu khóa cá nhân</span>
                  <button
                    type="button"
                    onClick={handleRemoveApiKey}
                    className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Trash2 size={12} /> Xóa khóa cá nhân
                  </button>
                </div>
              )}
            </div>

            {/* Vercel Deployment Guide for Teachers */}
            <div className="bg-blue-50/80 p-3.5 rounded-2xl border border-blue-200 text-blue-950 text-xs leading-relaxed space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold flex items-center gap-1.5 text-blue-900">
                  <Server size={14} className="text-blue-700" />
                  Hướng dẫn Triển khai trên Vercel:
                </p>
                <button
                  type="button"
                  onClick={() => handleTestConnection('system')}
                  disabled={isTesting || !hasSystemKey}
                  className="text-[10px] bg-white border border-blue-300 text-blue-800 font-bold px-2 py-1 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition-colors"
                >
                  Test Key Vercel
                </button>
              </div>
              <p className="text-[11px] text-blue-800">
                Để cả lớp cùng sử dụng mà học sinh không cần tự tạo key, Thầy/Cô cấu hình biến môi trường trên Vercel:
              </p>
              <ol className="list-decimal pl-4 space-y-1 text-[11px] text-blue-900 font-medium">
                <li>Đăng nhập <strong>Vercel Dashboard</strong> &gt; chọn Project.</li>
                <li>Vào tab <strong>Settings</strong> &gt; <strong>Environment Variables</strong>.</li>
                <li>Thêm biến <code>GEMINI_API_KEY</code> với giá trị là Gemini API Key từ AI Studio.</li>
                <li>Nhấn <strong>Save</strong> và Redeploy để áp dụng.</li>
              </ol>
            </div>

            {/* Return to Chat Button */}
            <button
              onClick={() => {
                setIsSettingsOpen(false);
                setTestResult(null);
              }}
              className="w-full py-2.5 bg-white border-2 border-gray-200 hover:border-amber-400 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              ← Quay lại khung trò chuyện
            </button>
          </div>
        ) : (
          /* =================== CHAT VIEW =================== */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              
              {/* Notice Banner */}
              <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-2xl font-medium space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1 text-[#92400E]">
                    <Sparkles size={13} className="text-amber-600" /> Nguồn kết nối hiện tại:
                  </span>
                  <span className="text-[11px] font-bold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-300">
                    {getActiveSourceLabel()}
                  </span>
                </div>
                {!userApiKey && !hasSystemKey && (
                  <p className="text-rose-700 font-bold text-[11px] pt-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Chưa có API Key nào được cài đặt. Nhấn biểu tượng ⚙️ góc trên để cài đặt.
                  </p>
                )}
              </div>

              {/* Chat Message List */}
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user' ? 'bg-[#3B82F6] text-white shadow-xs' : 'bg-[#FEF3C7] text-[#D97706] shadow-xs'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>

                  <div className={`max-w-[82%] p-3.5 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-[#3B82F6] text-white rounded-tr-none shadow-xs' 
                      : 'bg-white border-2 border-[#FDE68A] text-gray-800 rounded-tl-none shadow-xs'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    
                    {/* Interactive Quiz Card generated by Pet AI */}
                    {msg.quiz && (
                      <InteractiveQuizCard quiz={msg.quiz} />
                    )}
                    
                    {/* 3D Visualization Command Handling */}
                    {msg.scene3DCommand && (
                      <div 
                        className="mt-3 p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => setScene3DCommand(msg.scene3DCommand || null)}
                      >
                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white shrink-0">
                          <Eye size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-blue-900">Mô phỏng 3D: {msg.scene3DCommand.shape}</p>
                          <p className="text-[11px] text-blue-700">Bấm để xem lại mô phỏng!</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Fallback Notice Badge */}
                    {msg.fallbackNotice && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
                        <RefreshCw size={12} className="text-amber-600 shrink-0" />
                        <span>{msg.fallbackNotice}</span>
                      </div>
                    )}

                    {/* Action buttons if configuration is needed */}
                    {msg.needsKey && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        <button
                          onClick={() => setIsSettingsOpen(true)}
                          className="px-3 py-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Settings size={13} /> Mở Cài đặt API Key
                        </button>
                      </div>
                    )}

                    {msg.canEnableFallback && (
                      <div className="mt-2.5 p-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1.5">
                        <p className="font-semibold text-[11px]">Hệ thống có sẵn Khóa mặc định Vercel. Bạn có muốn bật dự phòng không?</p>
                        <button
                          onClick={() => {
                            setAllowFallback(true);
                            localStorage.setItem('gemini_allow_fallback', 'true');
                            handleSend();
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs"
                        >
                          <RefreshCw size={11} /> Bật dự phòng & Thử lại ngay
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
                    <span className="text-sm text-gray-500 font-medium">Pet AI đang suy nghĩ câu trả lời...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3.5 bg-white border-t-2 border-gray-100 flex gap-2 items-center">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Hỏi Pet AI về bài học, công thức Toán..."
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
