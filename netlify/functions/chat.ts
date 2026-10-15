import { GoogleGenAI } from '@google/genai';

interface HandlerEvent {
  httpMethod: string;
  headers: Record<string, string | undefined>;
  body: string | null;
  path: string;
}

export const handler = async (event: HandlerEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-gemini-api-key',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle status check
  if (event.httpMethod === 'GET') {
    const hasSystemKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        hasSystemKey,
        message: hasSystemKey
          ? "Đã cấu hình API Key hệ thống trên Netlify (GEMINI_API_KEY)."
          : "Chưa cấu hình API Key hệ thống trên Netlify. Người dùng có thể tự nhập API Key cá nhân trong cài đặt Chatbot."
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let bodyData: any = {};
  try {
    bodyData = event.body ? JSON.parse(event.body) : {};
  } catch {
    bodyData = {};
  }

  const userKey = event.headers['x-gemini-api-key'] || bodyData.apiKey;
  let resolvedKey = userKey && userKey.trim().length > 0 ? userKey.trim() : process.env.GEMINI_API_KEY?.trim();
  const source = userKey && userKey.trim().length > 0 ? 'user' : 'system';

  if (!resolvedKey) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Chưa có API Key Gemini. Vui lòng mở cài đặt trong Chatbot (⚙️) để nhập API Key hoặc cấu hình GEMINI_API_KEY trong Environment Variables của Netlify.',
        needsKey: true
      })
    };
  }

  const ai = new GoogleGenAI({
    apiKey: resolvedKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });

  const { isTest, prompt, context } = bodyData;

  // Test connection
  if (isTest || event.path.includes('test-connection')) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Ping test connection. Trả lời đúng 1 chữ: OK'
      });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Kết nối API Key thành công!',
          source: source === 'user' ? 'Key người dùng nhập' : 'Key hệ thống Netlify',
          model: 'gemini-3.8-flash',
          reply: response.text || 'OK'
        })
      };
    } catch (err: any) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          error: `Lỗi kết nối API Key: ${err?.message || 'Không thể xác thực'}`
        })
      };
    }
  }

  // Chat completion
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        text: response.text || '',
        source
      })
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error?.message || 'Failed to generate response'
      })
    };
  }
};
