import type { CookieOptions, Response } from "express";
import env from "../config/env.js";
import { prisma } from "../lib/prisma.js";
import { createSessionToken } from "../lib/session.js";
import { ConflictError, UnauthorizedError } from "../utils/http.js";
import { hashPassword, verifyPassword } from "../utils/password.js";

export interface RegisteredUser {
  user: Awaited<ReturnType<typeof prisma.user.findUnique>>;
  session: { raw: string };
}

const userInclude = { settings: true };

function safeUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  createdAt: Date;
  settings?: unknown;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    settings: user.settings ?? null,
  };
}

async function issueSession(res: Response, userId: string, req: unknown) {
  const { raw, hash } = createSessionToken();
  const ttlDays = env.sessionTtlDays;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

  const session = await prisma.session.create({
    data: {
      userId,
      tokenHash: hash,
      expiresAt,
      userAgent: (req as { headers?: { "user-agent"?: string } }).headers?.["user-agent"]?.slice(0, 300),
    },
  });

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: env.cookieSecure,
    maxAge: ttlDays * 24 * 60 * 60 * 1000,
    path: "/",
  };
  res.cookie(env.cookieName, raw, cookieOptions);

  return { raw, session };
}

export async function registerUser(
  res: Response,
  name: string,
  email: string,
  password: string,
  req: unknown,
) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw ConflictError("An account with this email already exists");

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: passwordHash,
      settings: { create: {} },
    },
    include: userInclude,
  });

  await issueSession(res, user.id, req);
  return safeUser(user);
}

export async function loginUser(
  res: Response,
  email: string,
  password: string,
  req: unknown,
) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: userInclude,
  });
  if (!user) throw UnauthorizedError("Invalid email or password");

  const valid = await verifyPassword(password, user.password);
  if (!valid) throw UnauthorizedError("Invalid email or password");

  await issueSession(res, user.id, req);
  return safeUser(user);
}

export async function logoutUser(res: Response, tokenHash?: string) {
  if (tokenHash) {
    await prisma.session.delete({ where: { tokenHash } }).catch(() => undefined);
  }
  res.clearCookie(env.cookieName, { path: "/" });
}

export { safeUser, issueSession };