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

// Simple in-memory rate limiting to prevent abuse and runaway Vercel/Gemini costs
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function checkRateLimit(identifier: string, maxRequests: number, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: maxRequests - record.count };
}

// Classify errors from Gemini API into clear, actionable categories
function classifyGeminiError(err: any): { errorCode: string; message: string; httpStatus: number } {
  const rawMsg = err?.message || String(err || '');
  const lowerMsg = rawMsg.toLowerCase();

  if (
    lowerMsg.includes('api_key_invalid') ||
    lowerMsg.includes('api key not valid') ||
    lowerMsg.includes('invalid api key') ||
    lowerMsg.includes('key expired') ||
    rawMsg.includes('401') ||
    (rawMsg.includes('403') && lowerMsg.includes('key'))
  ) {
    return {
      errorCode: 'INVALID_API_KEY',
      message: 'API Key không hợp lệ hoặc đã bị vô hiệu hóa. Vui lòng kiểm tra lại API Key trên Google AI Studio.',
      httpStatus: 400
    };
  }

  if (
    lowerMsg.includes('quota') ||
    lowerMsg.includes('resource_exhausted') ||
    rawMsg.includes('429') ||
    lowerMsg.includes('rate limit')
  ) {
    return {
      errorCode: 'QUOTA_EXCEEDED',
      message: 'API Key đã vượt quá hạn mức yêu cầu của Google (Quota Exceeded / Rate Limit 429). Bạn có thể thử lại sau hoặc chuyển sang nguồn khóa khác.',
      httpStatus: 429
    };
  }

  if (
    rawMsg.includes('503') ||
    lowerMsg.includes('unavailable') ||
    lowerMsg.includes('high traffic') ||
    lowerMsg.includes('overloaded')
  ) {
    return {
      errorCode: 'SERVICE_BUSY',
      message: 'Máy chủ Google Gemini đang tạm thời bận hoặc có lưu lượng truy cập cao (503). Vui lòng thử lại sau vài giây.',
      httpStatus: 503
    };
  }

  if (
    lowerMsg.includes('fetch failed') ||
    lowerMsg.includes('enotfound') ||
    lowerMsg.includes('etimedout') ||
    lowerMsg.includes('network')
  ) {
    return {
      errorCode: 'NETWORK_ERROR',
      message: 'Lỗi mạng khi kết nối đến dịch vụ Google AI. Vui lòng kiểm tra kết nối Internet của thiết bị.',
      httpStatus: 502
    };
  }

  return {
    errorCode: 'GEMINI_ERROR',
    message: `Lỗi xử lý Gemini AI: ${rawMsg}`,
    httpStatus: 500
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-gemini-api-key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sanitizeApiKey = (val?: string) => {
    if (!val) return '';
    return val.trim().replace(/^["']|["']$/g, '').trim();
  };

  const detectedEnvVar = process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY'
    : process.env.GOOGLE_API_KEY ? 'GOOGLE_API_KEY'
    : process.env.VITE_GEMINI_API_KEY ? 'VITE_GEMINI_API_KEY'
    : null;

  const systemKey = sanitizeApiKey(
    process.env.GEMINI_API_KEY || 
    process.env.GOOGLE_API_KEY || 
    process.env.VITE_GEMINI_API_KEY
  );
  const hasSystemKey = systemKey.length > 0;

  // Handle GET status check: /api/chat or /api/chat/status
  if (req.method === 'GET') {
    const maskedKey = hasSystemKey
      ? `${systemKey.substring(0, 6)}...${systemKey.slice(-4)} (${systemKey.length} ký tự)`
      : 'Chưa có';

    return res.status(200).json({
      hasSystemKey,
      envVarSource: detectedEnvVar,
      maskedKeyHint: maskedKey,
      defaultModel: 'gemini-3.8-flash',
      message: hasSystemKey
        ? `Đã nhận diện API Key hệ thống trên Vercel qua biến [${detectedEnvVar}].`
        : 'Chưa phát hiện biến môi trường GEMINI_API_KEY trên Vercel. Lưu ý: Sau khi thêm biến trong Settings > Environment Variables, bạn bắt buộc phải REDEPLOY dự án để Vercel nạp biến.'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Phương thức không được hỗ trợ (Method Not Allowed)' });
  }

  const body = req.body || {};
  const isTest = !!body.isTest || !!req.url?.includes('test-connection');
  const userKeyHeader = (req.headers['x-gemini-api-key'] as string) || '';
  const userKeyBody = (body.apiKey as string) || '';
  const personalKey = sanitizeApiKey(userKeyHeader || userKeyBody);

  // Mode: 'personal' | 'system' | 'auto' (default 'auto')
  const requestedMode: 'personal' | 'system' | 'auto' = body.mode || 'auto';
  const allowFallback: boolean = !!body.allowFallback;
  const testSource: 'personal' | 'system' | undefined = body.testSource;

  // Identify client for rate limiting
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 'unknown';

  // ==========================================
  // CASE 1: TEST CONNECTION REQUEST
  // ==========================================
  if (isTest) {
    let keyToTest = '';
    let sourceUsed: 'personal' | 'system' = 'personal';

    if (testSource === 'system' || (requestedMode === 'system' && !personalKey)) {
      if (!hasSystemKey) {
        return res.status(400).json({
          success: false,
          errorCode: 'NO_SYSTEM_KEY',
          error: 'Chưa cấu hình biến môi trường GEMINI_API_KEY trên Vercel. Thầy/cô hãy vào Settings > Environment Variables trên Vercel để thêm biến này.',
          source: 'system'
        });
      }
      keyToTest = systemKey;
      sourceUsed = 'system';
    } else {
      if (!personalKey) {
        return res.status(400).json({
          success: false,
          errorCode: 'NO_PERSONAL_KEY',
          error: 'Chưa nhập API Key cá nhân để kiểm tra. Vui lòng dán khóa vào ô nhập trước.',
          source: 'personal'
        });
      }
      keyToTest = personalKey;
      sourceUsed = 'personal';
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: keyToTest,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      let activeModel = 'gemini-3.8-flash';
      let response;
      try {
        response = await ai.models.generateContent({
          model: activeModel,
          contents: 'Ping test connection. Trả lời đúng 1 chữ: OK'
        });
      } catch (testErr: any) {
        if (String(testErr?.message || '').includes('404') || String(testErr?.message || '').toLowerCase().includes('not found')) {
          activeModel = 'gemini-2.5-flash';
          response = await ai.models.generateContent({
            model: activeModel,
            contents: 'Ping test connection. Trả lời đúng 1 chữ: OK'
          });
        } else {
          throw testErr;
        }
      }

      return res.status(200).json({
        success: true,
        source: sourceUsed,
        message: `Kết nối thành công! Mô hình ${activeModel} đã sẵn sàng hoạt động với ${sourceUsed === 'personal' ? 'Khóa cá nhân' : 'Khóa mặc định hệ thống (Vercel)'}.`,
        model: activeModel,
        reply: response.text?.trim() || 'OK'
      });
    } catch (err: any) {
      const classified = classifyGeminiError(err);
      // If Google server is overloaded (503), the key itself is authenticated
      if (classified.errorCode === 'SERVICE_BUSY') {
        return res.status(200).json({
          success: true,
          source: sourceUsed,
          message: `API Key hợp lệ! (Lưu ý: Máy chủ Gemini đang có lưu lượng truy cập cao, tính năng chat vẫn sẽ thử lại khi sử dụng)`,
          model: 'gemini-3.8-flash'
        });
      }

      return res.status(classified.httpStatus).json({
        success: false,
        source: sourceUsed,
        errorCode: classified.errorCode,
        error: `[Kiểm tra ${sourceUsed === 'personal' ? 'Khóa cá nhân' : 'Khóa hệ thống'}] ${classified.message}`
      });
    }
  }

  // ==========================================
  // CASE 2: REGULAR CHAT REQUEST
  // ==========================================
  const prompt = (body.prompt || '').trim();
  const context = (body.context || '').trim();

  if (!prompt) {
    return res.status(400).json({
      success: false,
      errorCode: 'EMPTY_PROMPT',
      error: 'Nội dung tin nhắn không được để trống.'
    });
  }

  // Payload size security check: Reject prompts exceeding 2000 chars
  if (prompt.length > 2000) {
    return res.status(400).json({
      success: false,
      errorCode: 'PROMPT_TOO_LONG',
      error: 'Câu hỏi quá dài (tối đa 2000 ký tự). Vui lòng rút ngắn nội dung để tiếp tục.'
    });
  }

  // Resolve which key to attempt based on user mode
  let primaryKey = '';
  let primarySource: 'personal' | 'system' = 'personal';

  if (requestedMode === 'system') {
    if (!hasSystemKey) {
      return res.status(400).json({
        success: false,
        errorCode: 'NO_SYSTEM_KEY',
        needsConfig: true,
        error: 'Chưa cấu hình API Key mặc định của hệ thống trên Vercel. Bạn có thể chuyển sang chế độ "Dùng API Key cá nhân" trong cài đặt Chatbot (⚙️).'
      });
    }
    primaryKey = systemKey;
    primarySource = 'system';
  } else if (requestedMode === 'personal') {
    if (!personalKey) {
      return res.status(400).json({
        success: false,
        errorCode: 'NO_PERSONAL_KEY',
        needsConfig: true,
        error: 'Bạn đang chọn chế độ "Dùng API Key cá nhân" nhưng chưa nhập khóa. Vui lòng mở Cài đặt Chatbot (⚙️) để nhập khóa hoặc chuyển sang chế độ "Khóa mặc định".'
      });
    }
    primaryKey = personalKey;
    primarySource = 'personal';
  } else {
    // Mode 'auto': Prefer personal if provided, else system
    if (personalKey) {
      primaryKey = personalKey;
      primarySource = 'personal';
    } else if (hasSystemKey) {
      primaryKey = systemKey;
      primarySource = 'system';
    } else {
      return res.status(400).json({
        success: false,
        errorCode: 'NO_KEY_CONFIGURED',
        needsConfig: true,
        error: 'Chưa có API Key nào được thiết lập. Vui lòng mở Cài đặt Chatbot (biểu tượng ⚙️) để nhập API Key cá nhân, hoặc giáo viên cấu hình GEMINI_API_KEY trên Vercel.'
      });
    }
  }

  // Anti-abuse rate limit: 25 req/min for system key, 60 req/min for personal key
  const rateLimitMax = primarySource === 'system' ? 25 : 60;
  const rateKey = `${clientIp}:${primarySource}`;
  const rateCheck = checkRateLimit(rateKey, rateLimitMax, 60000);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      success: false,
      errorCode: 'RATE_LIMITED',
      error: `Bạn đang gửi câu hỏi quá nhanh. Vui lòng đợi 1 phút trước khi tiếp tục (Giới hạn bảo vệ hệ thống).`
    });
  }

  const systemInstruction = `Bạn là một thú cưng ảo (Pet) thông minh, dễ thương, đóng vai trò như một người bạn học tập đồng hành cùng học sinh trong ứng dụng Vương Quốc Pet Tri Thức. 
Ngôn ngữ: Tiếng Việt. Giọng điệu: Vui vẻ, gần gũi, xưng hô là "tớ" và "cậu" hoặc "bạn nhỏ".
Nhiệm vụ:
- Giải đáp các thắc mắc về bài tập, môn học Toán và các kiến thức bổ ích.
- Đưa ra lời khuyên học tập, động viên học sinh kiên trì rèn luyện.
- Sử dụng emoji sinh động, thân thiện.
- Trả lời ngắn gọn, dễ hiểu cho độ tuổi học sinh (Cấp 1, Cấp 2).

CHỨC NĂNG SƯ PHẠM ĐẶC BIỆT - PHÂN TÍCH LỖI SAI BÀI TẬP:
Khi học sinh hỏi vì sao làm sai bài toán hoặc bấm nút "Hỏi Pet vì sao sai", hãy đối chiếu với "BỘ TÌNH HUỐNG LỖI SAI" sau đây để đưa ra phản hồi chính xác và sư phạm:

[BỘ TÌNH HUỐNG LỖI SAI & KỊCH BẢN PHẢN HỒI]:
1. Nhầm số mặt hình hộp chữ nhật (đếm mặt khuất): Phản hồi: "Em đang đếm những mặt nhìn thấy trên hình vẽ thôi. Hãy tưởng tượng một chiếc hộp kín có 6 mặt (trên, dưới, trước, sau, 2 bên).".
2. Nhầm đỉnh/cạnh hình lập phương: Phản hồi: "Đỉnh là điểm gặp nhau, cạnh là đoạn thẳng nối hai đỉnh. Hình lập phương có 8 đỉnh, 12 cạnh.".
3. Đồng nhất cạnh với mặt (12 cạnh = 12 mặt): Phản hồi: "Số cạnh không bằng số mặt đâu em. Mặt là phần phẳng bao quanh, cạnh là đường giao nhau. Hình hộp có 6 mặt, 12 cạnh.".
4. Sai diện tích xung quanh (Sxq = a*b): Phản hồi: "a*b là diện tích 1 mặt đáy. Sxq gồm 4 mặt bên, tính bằng 2(a+b)*h.".
5. Quên nhân đôi diện tích đáy (Stp = Sxq + a*b): Phản hồi: "Hình hộp có 2 mặt đáy bằng nhau. Stp = Sxq + 2*a*b.".
6. Quên hệ số 6 diện tích lập phương (Stp = a^2): Phản hồi: "a^2 là diện tích 1 mặt. Lập phương có 6 mặt bằng nhau, nên Stp = 6*a^2.".
7. Nhầm chiều cao đáy/lăng trụ: Phản hồi: "Chiều cao đáy nằm trong mặt phẳng đáy. Chiều cao lăng trụ là khoảng cách giữa 2 đáy, bằng cạnh bên.".
8. Sai Sxq lăng trụ (Cộng Cđáy+h): Phản hồi: "Sxq lăng trụ đứng = Chu vi đáy * Chiều cao.".
9. Quên cộng 2 đáy lăng trụ (Stp = Sxq): Phản hồi: "Stp = Sxq + 2 * Diện tích đáy.".
10. Nhầm lăng trụ tứ giác là đáy vuông: Phản hồi: "Đáy tứ giác có thể là hình bất kỳ. Chỉ khi đề bài cho thêm dữ kiện thì mới là hình vuông.".
11. Nhầm bán kính/đường kính trụ: Phản hồi: "Đường kính = 2 * Bán kính. Đề cho d thì r = d/2.".
12. Quên Pi tính Sxq trụ (2*r*h): Phản hồi: "Chu vi đáy là 2*Pi*r, nên Sxq = 2*Pi*r*h.".
13. Nhầm Sxq hình nón (Pi*r*h): Phản hồi: "Sxq nón = Pi*r*l (l là đường sinh). h là chiều cao từ đỉnh xuống tâm đáy.".
14. Nhầm diện tích/thể tích cầu (V=4*Pi*r^2): Phản hồi: "Diện tích mặt cầu S = 4*Pi*r^2. Thể tích V = 4/3*Pi*r^3.".
15. Quên đổi đơn vị: Phản hồi: "Cần đổi các kích thước về cùng một đơn vị trước khi tính diện tích/thể tích.".

[CÁC CÂU HỎI KIẾN THỨC CƠ BẢN]:
- Hình hộp: 6 mặt, 12 cạnh, 8 đỉnh.
- Stp = Sxq + 2*Sđáy.
- Lập phương: 6 mặt vuông, 12 cạnh bằng nhau.
- Sxq trụ = 2*Pi*r*h.
- Thể tích cầu = 4/3*Pi*r^3.

HƯỚNG DẪN CÁCH TRẢ LỜI:
- Phân tích lỗi cụ thể dựa trên [BỘ TÌNH HUỐNG LỖI SAI].
- Gợi ý từng bước (Phương pháp Socratic), đừng đưa ngay đáp án.
- Cuối câu trả lời, tạo 1 câu hỏi tương tự bọc trong khối mã \`\`\`quiz (JSON).

QUY ĐỊNH CẢNH BÁO (RẤT QUAN TRỌNG):
Nếu học sinh gửi từ ngữ tục tĩu, bạo lực, phản cảm hoặc phản động, bạn TUYỆT ĐỐI KHÔNG trả lời theo nội dung đó. Hãy trả lời nhẹ nhàng nhưng kiên quyết: "Tớ không thể trả lời câu hỏi này vì nó không phù hợp với môi trường học tập. Chúng mình hãy cùng thảo luận những chủ đề tích cực và lành mạnh nhé! 🐾"
Ngữ cảnh hiện tại của học sinh: ${context || 'Đang học tập chung'}`;

  // Helper to call Gemini model with retry on transient 503
  const callGemini = async (key: string) => {
    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      return response.text || '';
    } catch (firstErr: any) {
      // If 404 / Model not found, fallback to gemini-2.5-flash
      if (String(firstErr?.message || '').includes('404') || String(firstErr?.message || '').toLowerCase().includes('not found')) {
        const fallbackModelResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.7
          }
        });
        return fallbackModelResponse.text || '';
      }

      const isTransient = String(firstErr?.message || '').includes('503') || 
                          String(firstErr?.message || '').includes('UNAVAILABLE') ||
                          String(firstErr?.message || '').toLowerCase().includes('overloaded');
      if (isTransient) {
        // Wait 1000ms and retry once with gemini-3.8-flash
        try {
          await new Promise(res => setTimeout(res, 1000));
          const retryResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              temperature: 0.7
            }
          });
          return retryResponse.text || '';
        } catch (secondErr: any) {
          // If still busy, fallback to gemini-2.5-flash
          try {
            const fallbackModelResponse = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: prompt,
              config: {
                systemInstruction,
                temperature: 0.7
              }
            });
            return fallbackModelResponse.text || '';
          } catch (thirdErr) {
            throw secondErr;
          }
        }
      }
      throw firstErr;
    }
  };

  try {
    const aiText = await callGemini(primaryKey);
    return res.status(200).json({
      success: true,
      text: aiText,
      source: primarySource,
      model: 'gemini-3.8-flash'
    });
  } catch (primaryErr: any) {
    const primaryClassified = classifyGeminiError(primaryErr);

    // Check if fallback is allowed:
    // Fallback is only allowed IF:
    // 1) The failed key was a personal key (primarySource === 'personal')
    // 2) User explicitly enabled allowFallback (or mode was auto without strict personal lockdown)
    // 3) A valid systemKey exists
    const canAttemptFallback = primarySource === 'personal' && allowFallback && hasSystemKey;

    if (canAttemptFallback) {
      try {
        const fallbackText = await callGemini(systemKey);
        return res.status(200).json({
          success: true,
          text: fallbackText,
          source: 'system',
          model: 'gemini-3.8-flash',
          fallbackTriggered: true,
          fallbackNotice: `Khóa cá nhân gặp lỗi (${primaryClassified.errorCode}). Hệ thống đã tự động dự phòng sang Khóa mặc định Vercel theo cài đặt của bạn.`
        });
      } catch (fallbackErr: any) {
        const fallbackClassified = classifyGeminiError(fallbackErr);
        return res.status(500).json({
          success: false,
          errorCode: 'BOTH_KEYS_FAILED',
          error: `Cả hai khóa đều không phản hồi: Khóa cá nhân (${primaryClassified.message}) và Khóa hệ thống (${fallbackClassified.message}).`,
          source: 'both'
        });
      }
    }

    // Do NOT fallback automatically if user didn't allow it. Return clear, distinct error!
    return res.status(primaryClassified.httpStatus).json({
      success: false,
      source: primarySource,
      errorCode: primaryClassified.errorCode,
      error: primaryClassified.message,
      canEnableFallback: !allowFallback && hasSystemKey && primarySource === 'personal'
    });
  }
}
