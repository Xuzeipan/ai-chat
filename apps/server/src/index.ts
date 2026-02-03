import "./config/env.js";

import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.js";
import { supabase } from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(apiRouter);

// 健康检查
app.get("/health", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("count");
    if (error) throw error;
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }

  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
