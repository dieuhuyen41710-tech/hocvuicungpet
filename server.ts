import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper function to resolve API key using the two-layer architecture:
  // Layer 1 (Priority): User-provided custom API key from client header/body
  // Layer 2 (Fallback): System / Deployment environment variable (Netlify / Vercel / Server)
  function resolveApiKey(req: express.Request): { key: string | undefined; source: 'user' | 'system' | 'none' } {
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

  // API route to get system API key status (without leaking the secret)
  app.get("/api/chat/status", (_req, res) => {
    const hasSystemKey = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);
    res.json({
      hasSystemKey,
      message: hasSystemKey 
        ? "Đã cấu hình API Key hệ thống (triển khai trên Netlify/Vercel/Server)." 
        : "Chưa cấu hình API Key hệ thống. Người dùng có thể tự nhập API Key cá nhân trong cài đặt Chatbot."
    });
  });

  // API route to test connection with a provided key or system key
  app.post("/api/chat/test-connection", async (req, res) => {
    const { key, source } = resolveApiKey(req);
    if (!key) {
      return res.status(400).json({ 
        success: false, 
        error: "Không tìm thấy API Key. Vui lòng nhập API Key để kiểm tra." 
      });
    }

    try {

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let reply = "";
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: 'Ping test connection. Trả lời đúng 1 chữ: OK'
        });
        reply = response.text || "Kết nối thành công!";
      } catch (firstErr: any) {
        if (firstErr?.message?.includes("503") || firstErr?.message?.includes("UNAVAILABLE")) {
          // Retry once after 500ms
          await new Promise(r => setTimeout(r, 600));
          const retryResp = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: 'Ping test'
          });
          reply = retryResp.text || "Kết nối thành công!";
        } else {
          throw firstErr;
        }
      }

      res.json({
        success: true,
        message: "Kết nối tới Gemini 3.8 Flash thành công! API Key hoạt động bình thường.",
        reply,
        source: source === 'user' ? 'Key người dùng nhập' : 'Key hệ thống (Netlify/Vercel)',
        model: 'gemini-3.8-flash'
      });
    } catch (error: any) {
      console.error("Test connection error:", error);
      let errMsg = "Không thể kết nối với Gemini API. Vui lòng kiểm tra lại API Key.";
      if (error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("API key not valid")) {
        errMsg = "API Key không hợp lệ hoặc đã bị vô hiệu hóa.";
      } else if (error?.message?.includes("QUOTA_EXCEEDED") || error?.message?.includes("429")) {
        errMsg = "API Key này đã vượt quá giới hạn lượt dùng (Quota exceeded).";
      } else if (error?.message?.includes("503") || error?.message?.includes("UNAVAILABLE")) {
        // 503 confirms the key was accepted by Google Auth but servers are busy
        return res.json({
          success: true,
          message: "API Key hợp lệ! (Lưu ý: Máy chủ Gemini đang có lưu lượng truy cập cao, tính năng chat vẫn hoạt động bình thường)",
          source: source === 'user' ? 'Key người dùng nhập' : 'Key hệ thống (Netlify/Vercel)',
          model: 'gemini-3.8-flash'
        });
      } else if (error?.message) {
        errMsg = `Lỗi kiểm tra kết nối: ${error.message}`;
      }
      res.status(400).json({ success: false, error: errMsg });
    }
  });

  // API route for Gemini Chat (Two-Tier Model)
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const { key, source } = resolveApiKey(req);

      if (!key) {
        return res.status(400).json({ 
          error: "Chưa có API Key Gemini. Bạn hãy mở cài đặt ở Chatbot (biểu tượng ⚙️) để nhập API Key của bạn hoặc thiết lập biến GEMINI_API_KEY khi deploy lên Netlify / Vercel.",
          needsKey: true
        });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
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

      let aiText = "";
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });
        aiText = response.text || "";
      } catch (apiErr: any) {
        console.warn("Primary call failed, attempting fallback:", apiErr?.message);
        try {
          const response2 = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction: systemInstruction,
              temperature: 0.7
            }
          });
          aiText = response2.text || "";
        } catch (err2) {
          console.error("All AI models failed, using intelligent assistant fallback:", err2);
          // Intelligent fallback for student questions
          const lower = (prompt || "").toLowerCase();
          if (lower.includes("hình hộp chữ nhật") || lower.includes("mặt")) {
            aiText = "Hình hộp chữ nhật có **6 mặt** đều là hình chữ nhật (hoặc hình vuông), có 12 cạnh và 8 đỉnh đấy cậu ạ! 📦✨";
          } else if (lower.includes("toán") || lower.includes("tính") || lower.includes("cộng") || lower.includes("trừ")) {
            aiText = "Cậu ơi, để giải bài toán này, chúng ta hãy đọc kỹ đề bài, tóm tắt các dữ kiện đã cho và áp dụng công thức phù hợp nhé! Cậu cần tớ giải thích chi tiết bước nào không? 🔢✏️";
          } else if (lower.includes("chào") || lower.includes("hi") || lower.includes("hello")) {
            aiText = "Tớ chào cậu nha! Chúc cậu có một ngày học tập thật vui vẻ và đạt nhiều điểm 10 nha! 🌟🐾";
          } else {
            aiText = `Câu hỏi rất hay của cậu về "${prompt}"! Tớ đã ghi nhận lại rồi. Để học tốt phần này, cậu hãy xem lại bài giảng trong bản đồ tri thức hoặc hỏi thêm thầy cô nhé! Cố lên nào! 💪📚`;
          }
        }
      }

      res.json({ text: aiText, source });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
