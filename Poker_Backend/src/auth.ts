import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "./config";
import { getCookie } from "./cookies";
import { prisma } from "./prisma";

const AUTH_COOKIE = "poker_auth";
const OAUTH_STATE_COOKIE = "google_oauth_state";
const CALLBACK_PATH = "/auth/google/callback";
type AuthToken = JwtPayload & { sub: string; email: string };

const googleClient = new OAuth2Client(
  config.googleClientId,
  config.googleClientSecret,
  `${config.backendUrl}${CALLBACK_PATH}`,
);

function cookieOptions() {
  return { httpOnly: true, sameSite: "lax" as const, secure: config.nodeEnv === "production", path: "/" };
}

function sendAuthError(response: Response, reason: string) {
  return response.redirect(`${config.frontendUrl}/?authError=${encodeURIComponent(reason)}`);
}

export function startGoogleAuth(_request: Request, response: Response) {
  const state = randomUUID();
  response.cookie(OAUTH_STATE_COOKIE, state, { ...cookieOptions(), maxAge: 600_000, path: CALLBACK_PATH });
  response.redirect(googleClient.generateAuthUrl({
    access_type: "online",
    prompt: "select_account",
    scope: ["openid", "email"],
    state,
  }));
}

export async function finishGoogleAuth(request: Request, response: Response) {
  const state = typeof request.query.state === "string" ? request.query.state : undefined;
  const code = typeof request.query.code === "string" ? request.query.code : undefined;
  const expectedState = getCookie(request, OAUTH_STATE_COOKIE);
  response.clearCookie(OAUTH_STATE_COOKIE, { ...cookieOptions(), path: CALLBACK_PATH });
  if (!state || !code || !expectedState || state !== expectedState) return sendAuthError(response, "oauth_state_mismatch");

  try {
    const { tokens } = await googleClient.getToken(code);
    if (!tokens.id_token) return sendAuthError(response, "missing_identity_token");
    const ticket = await googleClient.verifyIdToken({ idToken: tokens.id_token, audience: config.googleClientId });
    const profile = ticket.getPayload();
    if (!profile?.sub || !profile.email || !profile.email_verified) return sendAuthError(response, "unverified_google_account");

    const emailOwner = await prisma.user.findUnique({ where: { email: profile.email }, select: { googleId: true } });
    if (emailOwner && emailOwner.googleId !== profile.sub) return sendAuthError(response, "email_already_in_use");
    const user = await prisma.user.upsert({
      where: { googleId: profile.sub },
      update: { email: profile.email },
      create: { googleId: profile.sub, email: profile.email },
    });
    const token = jwt.sign({ email: user.email }, config.jwtSecret, { subject: user.id, expiresIn: "7d" });
    response.cookie(AUTH_COOKIE, token, { ...cookieOptions(), maxAge: 604_800_000 });
    return response.redirect(`${config.frontendUrl}/`);
  } catch (error) {
    console.error("Google OAuth callback failed", error);
    return sendAuthError(response, "google_sign_in_failed");
  }
}

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const token = getCookie(request, AUTH_COOKIE);
  if (!token) return response.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (typeof decoded === "string" || !decoded.sub || !decoded.email) return response.status(401).json({ error: "Unauthorized" });
    response.locals.auth = decoded as AuthToken;
    return next();
  } catch {
    return response.status(401).json({ error: "Unauthorized" });
  }
}

export async function currentUser(_request: Request, response: Response) {
  const auth = response.locals.auth as AuthToken;
  const user = await prisma.user.findUnique({ where: { id: auth.sub }, select: { id: true, email: true } });
  if (!user) return response.status(401).json({ error: "Unauthorized" });
  return response.json({ user });
}

export function logout(_request: Request, response: Response) {
  response.clearCookie(AUTH_COOKIE, cookieOptions());
  return response.status(204).send();
}
