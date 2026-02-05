import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "default-secret";
const JWT_EXPIRES_IN = "7d";

// 生成 JWT Token
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

// 验证 JWT Token
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
