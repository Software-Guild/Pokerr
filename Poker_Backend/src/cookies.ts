import type { Request } from "express";

export function getCookie(request: Request, name: string): string | undefined {
  const cookies = request.headers.cookie;
  if (!cookies) return undefined;
  const prefix = `${encodeURIComponent(name)}=`;
  for (const part of cookies.split(";")) {
    const cookie = part.trim();
    if (cookie.startsWith(prefix)) return decodeURIComponent(cookie.slice(prefix.length));
  }
  return undefined;
}
