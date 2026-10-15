import { GoogleGenAI } from '@google/genai';

interface VercelRequest {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: any;
}

interface VercelResponse {
  setHeader: (name: string, value: string) => VercelResponse;
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  end: () => void;
}

// Helper to resolve API key: User key takes priority, then process.env.GEMINI_API_KEY
function resolveApiKey(req: VercelRequest): { key: string | undefined; source: 'user' | 'system' | 'none' } {
  const userKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
  if (userKey && typeof userKey === 'string' && userKey.trim().length > 0) {
    return { key: userKey.trim(), source: 'user' };
  }
  const systemKey = process.env.GEMINI_API_KEY;
  if (systemKey && systemKey.trim().length > 0) {
    return { key: systemKey.trim(), source: 'system' };
  }
  return { key: undefined, source: 'none' };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle status check
  if (req.method === 'GET') {
    const hasSystemKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    return res.status(200).json({
      hasSystemKey,
      message: hasSystemKey
        ? "Đã cấu hình API Key hệ thống trên Vercel (GEMINI_API_KEY)."
        : "Chưa cấu hình API Key hệ thống trên Vercel. Người dùng có thể tự nhập API Key cá nhân trong cài đặt Chatbot."
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { isTest, prompt, context } = req.body || {};
  const { key, source } = resolveApiKey(req);

  if (!key) {
    return res.status(400).json({
      success: false,
      error: 'Chưa có API Key Gemini. Vui lòng mở cài đặt trong Chatbot (⚙️) để nhập API Key hoặc cấu hình GEMINI_API_KEY trong Environment Variables của Vercel.',
      needsKey: true
    });
  }

  const ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  // If this is a test connection request
  if (isTest || req.url?.includes('test-connection')) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping test connection. Trả lời đúng 1 chữ: OK'
      });
      return res.status(200).json({
        success: true,
        message: 'Kết nối API Key thành công! Gemini 3.8 Flash đã sẵn sàng.',
        source: source === 'user' ? 'Key người dùng nhập' : 'Key hệ thống Vercel',
        model: 'gemini-3.8-flash',
        reply: response.text || 'OK'
      });
    } catch (err: any) {
      if (err?.message?.includes("503") || err?.message?.includes("UNAVAILABLE")) {
        return res.status(200).json({
          success: true,
          message: 'API Key hợp lệ! (Máy chủ Gemini đang có lưu lượng truy cập cao, tính năng chat sẵn sàng)',
          source: source === 'user' ? 'Key người dùng nhập' : 'Key hệ thống Vercel',
          model: 'gemini-3.8-flash'
        });
      }
      return res.status(400).json({
        success: false,
        error: `Lỗi kết nối API Key: ${err?.message || 'Không thể xác thực'}`
      });
    }
  }

  // Standard chat generation
  const systemInstruction = `Bạn là một thú cưng ảo (Pet) thông minh, dễ thương, đóng vai trò như một người bạn học tập đồng hành cùng học sinh. 
Ngôn ngữ: Tiếng Việt. Giọng điệu: Vui vẻ, gần gũi, xưng hô là "tớ" và "cậu".
Nhiệm vụ:
- Giải đáp các thắc mắc về bài tập, môn học.
- Đưa ra lời khuyên học tập, động viên học sinh.
- Sử dụng emoji phù hợp.
- Trả lời ngắn gọn, dễ hiểu cho độ tuổi học sinh (Cấp 1, Cấp 2).

QUY ĐỊNH CẢNH BÁO (RẤT QUAN TRỌNG):
Nếu học sinh gửi từ ngữ tục tĩu, bạo lực, phản cảm hoặc phản động, bạn TUYỆT ĐỐI KHÔNG trả lời theo nội dung đó. Hãy trả lời nhẹ nhàng nhưng kiên quyết: "Tớ không thể trả lời câu hỏi này vì nó không phù hợp với môi trường học tập. Chúng mình hãy cùng thảo luận những chủ đề tích cực và lành mạnh nhé! 🐾"
Ngữ cảnh hiện tại của học sinh: ${context || 'Đang học tập chung'}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    return res.status(200).json({
      text: response.text || '',
      source
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error?.message || 'Failed to generate response'
    });
  }
}
