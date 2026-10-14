import { requestRecovery,resetPassword } from "@/lib/server/recovery";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { z } from "zod";
import { database } from "@/lib/server/database";
import { hashPassword, verifyPassword } from "@/lib/server/password";
import {
  createSession,
  digest,
  errorResponse,
  HttpError,
  readBody,
  sameOrigin,
} from "@/lib/server/auth";
import type { User } from "@/lib/platform-types";
export const runtime = "nodejs";
const fields = z.object({
  email: z
    .email()
    .max(254)
    .transform((v) => v.toLowerCase()),
  role: z.enum(["admin", "mediator", "partner", "neet"]),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(2).max(120).optional(),
  organization: z.string().trim().max(200).optional(),
});
export async function POST(
  request: Request,
  context: { params: Promise<{ action: string }> },
) {
  try {
    sameOrigin(request);
    const { action } = await context.params;
    if(action==="forgot-password")return Response.json(await requestRecovery(await readBody(request)));
    if(action==="reset-password")return Response.json(await resetPassword(await readBody(request)));
    const db = await database();
    if (action === "logout") {
      const jar = await cookies();
      const token = jar.get("bidaya_session")?.value;
      if (token)
        await db.query("DELETE FROM sessions WHERE token_hash=$1", [
          digest(token),
        ]);
      jar.delete("bidaya_session");
      return Response.json({ ok: true });
    }
    if (!["sign-in", "register"].includes(action))
      throw new HttpError(
        400,
        "Récupération par e-mail non configurée. Contacte l’administration pour réinitialiser ton accès.",
      );
    const data = fields.parse(await readBody(request));
    // Persistent rate limit, including registration. Updated atomically.
    const key = digest(data.email);
    const attempts = await db.query<{ attempts: number }>(
      `INSERT INTO auth_attempts(key,attempts,started_at) VALUES($1,1,now()) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.started_at<now()-interval '15 minutes' THEN 1 ELSE auth_attempts.attempts+1 END, started_at=CASE WHEN auth_attempts.started_at<now()-interval '15 minutes' THEN now() ELSE auth_attempts.started_at END RETURNING attempts`,
      [key],
    );
    if (attempts[0].attempts > 15)
      throw new HttpError(429, "Trop de tentatives. Réessaie dans 15 minutes.");
    if (action === "sign-in") {
      const rows = await db.query<User & { password_hash: string }>(
        "SELECT * FROM users WHERE email=$1 AND active=true",
        [data.email],
      );
      const user = rows[0];
      const valid = await verifyPassword(
        data.password,
        user?.password_hash || "invalid:",
      );
      if (!user || !valid || user.role !== data.role)
        throw new HttpError(401, "Adresse, mot de passe ou espace incorrect.");
      await db.query("DELETE FROM auth_attempts WHERE key=$1", [key]);
      await createSession(user.id, request);
      return Response.json({ ok: true, redirect: "/platform" });
    }
    if (!data.name) throw new HttpError(400, "Le nom est obligatoire.");
    const hash = await hashPassword(data.password);
    const id = randomUUID();
    if (data.role !== "neet") {
      if (!data.organization)
        throw new HttpError(400, "L’organisme est obligatoire.");
      await db.transaction(async (q) => {
        const existing = await q(
          "SELECT id FROM users WHERE email=$1 UNION ALL SELECT id FROM access_requests WHERE email=$1 AND status='pending'",
          [data.email],
        );
        if (!existing.length)
          await q(
            "INSERT INTO access_requests(id,email,name,role,organization,password_hash) VALUES($1,$2,$3,$4,$5,$6)",
            [id, data.email, data.name, data.role, data.organization, hash],
          );
      });
      return Response.json({
        ok: true,
        message:
          "Demande enregistrée. L’administration doit approuver l’accès avant la connexion.",
      });
    }
    await db.transaction(async (q) => {
      if ((await q("SELECT id FROM users WHERE email=$1", [data.email])).length)
        throw new HttpError(
          409,
          "Cette adresse est déjà utilisée. Connecte-toi ou contacte l’administration.",
        );
      await q(
        "INSERT INTO users(id,email,name,role,password_hash) VALUES($1,$2,$3,'neet',$4)",
        [id, data.email, data.name, hash],
      );
    });
    await createSession(id, request);
    return Response.json({ ok: true, redirect: "/platform" });
  } catch (error) {
    return errorResponse(error);
  }
}
