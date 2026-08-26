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
Ngữ cảnh hiện tại của học sinh: ${context || 'Đang học tập chung'}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash', // Or gemini-1.5-flash as the user is on the free tier normally, but the agent uses standard models. Let's use 'gemini-3.6-flash'
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7
        }
      });

      res.json({ text: response.text });
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
