import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(apiRouter);

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
