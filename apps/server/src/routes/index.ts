import { Router } from "express";
import authRoutes from "./auth.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// 公开路由
router.use("/auth", authRoutes);

// 受保护的路由示例
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "这是受保护的数据",
    user: req.user, // 来自 authMiddleware
  });
});

router.get("/test", (req, res) => {
  res.json({ message: "API working!" });
});

export default router;
