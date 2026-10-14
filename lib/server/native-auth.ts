import { database } from "./database";
import { digest, HttpError } from "./auth";
import type { User } from "../platform-types";
// Native API uses explicit bearer credentials. Browser cookies are never accepted.
export function nativeToken(request: Request) {
  const header = request.headers.get("authorization") || "";
  const match = /^Bearer (native_[a-f0-9]{64})$/.exec(header);
  if (!match) throw new HttpError(401, "Reconnecte-toi à l’application.");
  return match[1];
}
export function nativeRequest(request: Request) {
  // No CORS is enabled. Native HTTP clients do not send browser Origin headers.
  if (request.headers.has("origin"))
    throw new HttpError(403, "Utilise la connexion de l’application mobile.");
}
export async function requireNativeUser(request: Request): Promise<User> {
  nativeRequest(request);
  const token = nativeToken(request),
    db = await database();
  const rows = await db.query<User>(
    `SELECT u.id,u.email,u.name,u.role,u.organization FROM users u JOIN sessions s ON s.user_id=u.id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true`,
    [digest(token)],
  );
  if (!rows[0])
    throw new HttpError(
      401,
      "Session expirée. Reconnecte-toi ; les dossiers locaux sont conservés.",
    );
  if (rows[0].role !== "mediator")
    throw new HttpError(
      401,
      "L’application mobile est réservée aux médiateurs de terrain. Reconnecte-toi avec un compte médiateur.",
    );
  return rows[0];
}
