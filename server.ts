import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import { createServer as createViteServer } from "vite";
import chatHandler from "./api/chat";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "1mb" }));

  // Forward all /api/chat and /api/chat/* endpoints directly to the Vercel handler
  // Ensuring 100% parity between local development, testing, and production deployment on Vercel
  app.all("/api/chat*", async (req, res) => {
    try {
      await chatHandler(req as any, res as any);
    } catch (err: any) {
      console.error("Error in chatHandler route:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: err?.message || "Internal Server Error" });
      }
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
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
