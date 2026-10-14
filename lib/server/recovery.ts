import { randomBytes, randomUUID } from "node:crypto";
import { z } from "zod";
import { database } from "./database";
import { digest, HttpError } from "./auth";
import { hashPassword } from "./password";
import type { User } from "../platform-types";
let initialized: Promise<void> | undefined;
export function recoverySchema() {
  return (initialized ||= (async () => {
    const db = await database();
    await db.transaction(async q=>{
      if(process.env.DATABASE_URL)await q('SELECT pg_advisory_xact_lock(734903)');
      await q("CREATE TABLE IF NOT EXISTS recovery_requests(user_id TEXT PRIMARY KEY REFERENCES users(id),created_at TIMESTAMPTZ DEFAULT now())");
      await q("CREATE TABLE IF NOT EXISTS password_resets(token_hash TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),expires_at TIMESTAMPTZ NOT NULL)");
    });
  })().catch(error=>{initialized=undefined;throw error;}));
}
export async function requestRecovery(body: unknown) {
  const p = z
    .object({
      email: z.email(),
      role: z.enum(["admin", "mediator", "partner", "neet"]),
    })
    .parse(body);
  await recoverySchema();
  const db = await database();
  const u = (
    await db.query<{ id: string }>(
      "SELECT id FROM users WHERE lower(email)=lower($1) AND role=$2 AND active=true",
      [p.email, p.role],
    )
  )[0];
  if (u)
    await db.query(
      "INSERT INTO recovery_requests(user_id) VALUES($1) ON CONFLICT(user_id) DO NOTHING",
      [u.id],
    );
  return {
    ok: true,
    message:
      "Si le compte existe, la demande est enregistrée. L’administration peut te fournir un lien personnel de réinitialisation.",
  };
}
export async function createRecoveryLink(actor: User, userId: string) {
  if (actor.role !== "admin")
    throw new HttpError(403, "Réservé à l’administration.");
  const id = z.uuid().parse(userId);
  await recoverySchema();
  const token = randomBytes(32).toString("hex"),
    db = await database();
  const u = (
    await db.query<User>(
      "SELECT id,role FROM users WHERE id=$1 AND active=true",
      [id],
    )
  )[0];
  if (!u) throw new HttpError(404, "Compte introuvable.");
  await db.transaction(async (q) => {
    await q("DELETE FROM password_resets WHERE user_id=$1", [id]);
    await q(
      "INSERT INTO password_resets(token_hash,user_id,expires_at) VALUES($1,$2,$3)",
      [digest(token), id, new Date(Date.now() + 3600000).toISOString()],
    );
    await q(
      "INSERT INTO audit(id,actor_id,action,entity_id) VALUES($1,$2,$3,$4)",
      [randomUUID(), actor.id, "password-recovery-link", id],
    );
  });
  return { ok: true, path: `/auth/${u.role}/reset-password?token=${token}` };
}
export async function resetPassword(body: unknown) {
  const p = z
    .object({
      token: z.string().regex(/^[a-f0-9]{64}$/),
      password: z.string().min(8).max(128),
      role: z.enum(["admin", "mediator", "partner", "neet"]),
    })
    .parse(body);
  await recoverySchema();
  const hash = await hashPassword(p.password),
    db = await database();
  await db.transaction(async (q) => {
    const row = (
      await q<{ user_id: string }>(
        "SELECT r.user_id FROM password_resets r JOIN users u ON u.id=r.user_id WHERE r.token_hash=$1 AND r.expires_at>now() AND u.active=true AND u.role=$2 FOR UPDATE",
        [digest(p.token), p.role],
      )
    )[0];
    if (!row)
      throw new HttpError(
        400,
        "Lien invalide ou expiré. Demande un nouveau lien.",
      );
    await q("UPDATE users SET password_hash=$1 WHERE id=$2", [
      hash,
      row.user_id,
    ]);
    await q("DELETE FROM sessions WHERE user_id=$1", [row.user_id]);
    await q("DELETE FROM password_resets WHERE user_id=$1", [row.user_id]);
    await q("DELETE FROM recovery_requests WHERE user_id=$1", [row.user_id]);
  });
  return {
    ok: true,
    message:
      "Mot de passe modifié. Connecte-toi avec ton nouveau mot de passe.",
  };
}
