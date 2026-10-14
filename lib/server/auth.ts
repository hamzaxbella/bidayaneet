import { cookies } from "next/headers";
import { createHash, randomBytes } from "node:crypto";
import { database } from "./database";
import type { User } from "../platform-types";
export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
export async function currentUser(): Promise<User | null> {
  const token = (await cookies()).get("bidaya_session")?.value;
  if (!token) return null;
  const db = await database();
  const rows = await db.query<User>(
    "SELECT u.id,u.email,u.name,u.role,u.organization FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true",
    [digest(token)],
  );
  return rows[0] || null;
}
export async function requireUser() {
  const user = await currentUser();
  if (!user)
    throw new HttpError(401, "Connecte-toi pour accéder à cet espace.");
  return user;
}
export async function createSession(userId: string, request: Request) {
  const { token } = await issueSession(userId);
  (await cookies()).set("bidaya_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure:
      process.env.VERCEL === "1" || new URL(request.url).protocol === "https:",
    path: "/",
    maxAge: 8 * 3600,
  });
}
export async function issueSession(userId: string, native = false) {
  const token = (native ? "native_" : "") + randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 8 * 3600 * 1000).toISOString();
  const db = await database();
  await db.query("DELETE FROM sessions WHERE expires_at<=now()");
  await db.query(
    "INSERT INTO sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)",
    [digest(token), userId, expiresAt],
  );
  return { token, expiresAt };
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  const expected =
    process.env.APP_ORIGIN ||
    `${url.protocol}//${request.headers.get("host") || url.host}`;
  if (!origin || origin !== expected)
    throw new HttpError(403, "Origine de la requête refusée.");
}
export async function readBody(request: Request) {
  const body = await request.text();
  if (body.length > 32_000)
    throw new HttpError(413, "Formulaire trop volumineux.");
  try {
    return JSON.parse(body);
  } catch {
    throw new HttpError(400, "Formulaire invalide.");
  }
}
export function errorResponse(error: unknown) {
  if (error instanceof HttpError)
    return Response.json({ error: error.message }, { status: error.status });
  if (error && typeof error === "object" && "issues" in error)
    return Response.json(
      {
        error:
          "Vérifie les champs obligatoires, les dates et les valeurs du formulaire.",
      },
      { status: 400 },
    );
  console.error(
    "Platform request failed:",
    error instanceof Error ? error.message : "unknown error",
  );
  return Response.json(
    { error: "Une erreur est survenue. Réessaie dans un instant." },
    { status: 500 },
  );
}
