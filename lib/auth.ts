import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = "habit_tracker_session";

function getCredentials() {
  return {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
  };
}

function getSessionSecret() {
  const { username, password } = getCredentials();

  if (!username || !password) {
    throw new Error("Missing ADMIN_USERNAME/ADMIN_PASSWORD env vars.");
  }

  return `${username}:${password}`;
}

export function createSessionToken() {
  return createHmac("sha256", getSessionSecret())
    .update("habit-tracker-session")
    .digest("hex");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  const expected = createSessionToken();
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  return (
    tokenBuffer.length === expectedBuffer.length &&
    timingSafeEqual(tokenBuffer, expectedBuffer)
  );
}

export function validateCredentials(username: string, password: string) {
  const credentials = getCredentials();

  return username === credentials.username && password === credentials.password;
}
