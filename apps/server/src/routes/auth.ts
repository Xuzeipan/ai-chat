import { Router } from "express";
import { supabase } from "../config/database.js";
import bcrypt from "bcrypt";
import {
  AuthUser,
  RegisterRequest,
  AuthResponse,
  LoginRequest,
} from "../types/auth.js";
import { generateToken } from "../utils/jwt.js";

const router = Router();

// 辅助函数：转换为前端用户格式（去除敏感字段）
function toAuthUser(user: any): AuthUser {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    created_at: user.created_at,
  };
}

// 注册
router.post("/register", async (req, res) => {
  try {
    const { email, password, nickname } = req.body as RegisterRequest;

    // 基本验证
    if (!email || !password || !nickname) {
      res.status(400).json({ error: "请提供所有必填字段" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "密码至少6位" });
      return;
    }

    // 检查邮箱是否已存在
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      res.status(409).json({ error: "邮箱已被注册" });
      return;
    }

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 10);

    // 创建用户（注意字段名匹配数据库）
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email,
        password: passwordHash,
        nickname,
        avatar: null,
      } as any)
      .select("id, email, nickname, avatar, created_at")
      .single();

    if (error || !newUser) {
      console.error("创建用户失败:", error);
      res.status(500).json({ error: "创建用户失败" });
      return;
    }

    // 生成 Token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });
    const response: AuthResponse = {
      token,
      user: toAuthUser(newUser),
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("注册错误:", error);
    res.status(500).json({ error: "服务器内部错误" });
  }
});
// 登录
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as LoginRequest;
    if (!email || !password) {
      res.status(400).json({ error: "请提供邮箱和密码" });
      return;
    }
    // 查找用户（注意：数据库字段是 password，不是 password_hash）
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, nickname, avatar, created_at, password") // 包含 password 用于验证
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(401).json({ error: "邮箱或密码错误" });
      return;
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "邮箱或密码错误" });
      return;
    }

    // 生成 Token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const response: AuthResponse = {
      token,
      user: toAuthUser(user),
    };

    res.json(response);
  } catch (error) {
    console.error("登录错误:", error);
    res.status(500).json({ error: "服务器内部错误" });
  }
});

// 获取当前用户信息（受保护的路由示例）
router.get("/me", async (req, res) => {
  // 注意：这里需要配合 authMiddleware 使用
  // 实际实现见下方的路由集成部分
  res.json({ message: "需要配合 authMiddleware" });
});

export default router;
