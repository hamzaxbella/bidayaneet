import { z } from "zod";
import { database } from "@/lib/server/database";
import {
  digest,
  errorResponse,
  HttpError,
  issueSession,
  readBody,
} from "@/lib/server/auth";
import {
  nativeRequest,
  nativeToken,
  requireNativeUser,
} from "@/lib/server/native-auth";
import { verifyPassword } from "@/lib/server/password";
import type { User } from "@/lib/platform-types";
export const runtime = "nodejs";
export async function POST(
  request: Request,
  context: { params: Promise<{ action: string }> },
) {
  try {
    nativeRequest(request);
    const { action } = await context.params,
      db = await database();
    if (action === "logout") {
      await requireNativeUser(request);
      await db.query("DELETE FROM sessions WHERE token_hash=$1", [
        digest(nativeToken(request)),
      ]);
      return Response.json(
        { ok: true },
        { headers: { "Cache-Control": "no-store" } },
      );
    }
    if (action !== "sign-in") throw new HttpError(404, "Action inconnue.");
    const data = z
      .object({
        email: z
          .email()
          .max(254)
          .transform((v) => v.toLowerCase()),
        password: z.string().min(8).max(128),
        role: z.enum(["mediator", "admin", "partner", "neet"]),
      })
      .parse(await readBody(request));
    if (data.role !== "mediator")
      throw new HttpError(
        403,
        "L’application mobile est réservée aux médiateurs de terrain.",
      );
    const key = digest(data.email);
    const attempts = await db.query<{ attempts: number }>(
      `INSERT INTO auth_attempts(key,attempts,started_at) VALUES($1,1,now()) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.started_at<now()-interval '15 minutes' THEN 1 ELSE auth_attempts.attempts+1 END, started_at=CASE WHEN auth_attempts.started_at<now()-interval '15 minutes' THEN now() ELSE auth_attempts.started_at END RETURNING attempts`,
      [key],
    );
    if (attempts[0].attempts > 15)
      throw new HttpError(429, "Trop de tentatives. Réessaie dans 15 minutes.");
    const rows = await db.query<User & { password_hash: string }>(
      "SELECT id,email,name,role,organization,password_hash FROM users WHERE email=$1",
      [data.email],
    );
    const row = rows[0],
      valid = await verifyPassword(
        data.password,
        row?.password_hash || "invalid:",
      );
    if (!row || !valid || row.role !== data.role)
      throw new HttpError(401, "Adresse, mot de passe ou espace incorrect.");
    await db.query("DELETE FROM auth_attempts WHERE key=$1", [key]);
    const user: User = {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role,
      organization: row.organization,
    };
    return Response.json(
      { ...(await issueSession(user.id, true)), user },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
