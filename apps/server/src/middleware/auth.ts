import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.js";

// 验证 JWT 中间件
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    // 从 Header 获取 Token
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "未提供认证令牌" });
      return;
    }

    const token = authHeader.substring(7); // 移除 "Bearer "

    // 验证 Token
    const payload = verifyToken(token);
    req.user = payload; // 将用户信息附加到请求对象

    next();
  } catch (error) {
    res.status(401).json({ error: "令牌无效或已过期" });
  }
}
