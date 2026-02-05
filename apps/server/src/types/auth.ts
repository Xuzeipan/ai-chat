// 用户角色
export type UserRole = "user" | "admin";

// 数据库用户表结构
export interface User {
  id: string;
  email: string;
  password: string;
  nickname: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

// 注册请求
export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// JWT Payload（注意：数据库没有 role 字段，JWT 里也不加）
export interface JWTPayload {
  userId: string;
  email: string;
}

// 认证响应中的用户信息（返回给前端，不含 password）
export interface AuthUser {
  id: string;
  email: string;
  nickname: string | null;
  avatar: string | null;
  created_at: string;
}

// 认证响应
export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}
