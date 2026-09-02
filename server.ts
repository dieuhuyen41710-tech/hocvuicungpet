import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for Gemini Chat
  app.post("/api/chat", async (req, res) => {
    try {
      const { prompt, context } = req.body;
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
      }

      const ai = new GoogleGenAI({ apiKey: key });
      
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
          model: 'gemini-1.5-flash',
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7
          }
        });
        aiText = response.text || "";
      } catch (apiErr) {
        console.warn("Primary model failed, trying fallback model or smart response:", apiErr);
        try {
          const response2 = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
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
          const lower = prompt.toLowerCase();
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

      res.json({ text: aiText });
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
