import { database } from "@/lib/server/database";
import {
  requireUser,
  sameOrigin,
  errorResponse,
  HttpError,
} from "@/lib/server/auth";
import { workspaceSchema } from "@/lib/server/workspace";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser();
    if (user.role !== "neet")
      throw new HttpError(403, "Dépôt réservé au titulaire du profil.");
    const reader = request.body?.getReader();
    if (!reader) throw new HttpError(400, "Fichier manquant.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4 * 1024 * 1024 + 100000) {
        await reader.cancel();
        throw new HttpError(413, "Le PDF doit être inférieur à 4 Mo.");
      }
      chunks.push(value);
    }
    const body = Buffer.concat(chunks);
    const form = await new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type") || "" },
      body,
    }).formData();
    const file = form.get("file");
    if (
      !(file instanceof File) ||
      file.size > 4 * 1024 * 1024 ||
      !file.name.toLowerCase().endsWith(".pdf")
    )
      throw new HttpError(400, "Choisis un fichier PDF de moins de 4 Mo.");
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.subarray(0, 5).toString() !== "%PDF-")
      throw new HttpError(400, "Ce fichier n’est pas un PDF valide.");
    await workspaceSchema();
    const name = file.name.replace(/[\r\n\\/]/g, "_").slice(0, 180);
    await (
      await database()
    ).query(
      "INSERT INTO private_documents(user_id,filename,content) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET filename=excluded.filename,content=excluded.content,updated_at=now()",
      [user.id, name, bytes],
    );
    return Response.json({ ok: true, filename: name });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function GET() {
  try {
    const user = await requireUser();
    await workspaceSchema();
    const row = (
      await (
        await database()
      ).query<{ filename: string; content: Uint8Array }>(
        "SELECT filename,content FROM private_documents WHERE user_id=$1",
        [user.id],
      )
    )[0];
    if (!row) throw new HttpError(404, "Aucun CV déposé.");
    return new Response(new Uint8Array(row.content), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(row.filename)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "sandbox; default-src 'none'",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
