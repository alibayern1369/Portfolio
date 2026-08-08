import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import db from "@/db";
import { getJwtSecret } from "@/lib/jwt-secret";

export interface User {
  id: number;
  username: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(user: User): Promise<string> {
  return new SignJWT({ id: user.id, username: user.username, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(getJwtSecret());
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const id = Number(payload.id);
    const username = typeof payload.username === "string" ? payload.username : "";
    const role = typeof payload.role === "string" ? payload.role : "";
    if (!id || !username || !role) return null;
    return { id, username, role };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function login(username: string, password: string): Promise<{ success: boolean; token?: string; error?: string }> {
  const result = await db.execute({ sql: "SELECT * FROM users WHERE username = ?", args: [username] });
  const user = result.rows[0] as unknown as { id: number; username: string; password: string; role: string } | undefined;

  if (!user) {
    return { success: false, error: "نام کاربری یا رمز عبور اشتباه است" };
  }

  const valid = await verifyPassword(password, user.password);
  if (!valid) {
    return { success: false, error: "نام کاربری یا رمز عبور اشتباه است" };
  }

  const token = await createToken({ id: user.id, username: user.username, role: user.role });
  return { success: true, token };
}

export function requireAdmin(user: User | null): boolean {
  return user?.role === "admin";
}
