import { requireUser, errorResponse, HttpError } from "@/lib/server/auth";
import { workspaceSchema } from "@/lib/server/workspace";
import { database } from "@/lib/server/database";
import { z } from "zod";
export const runtime = "nodejs";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    if (user.role !== "admin")
      throw new HttpError(403, "Réservé à l’administration.");
    const id = z.uuid().parse((await params).id);
    await workspaceSchema();
    const row = (
      await (
        await database()
      ).query<{ name: string; content: string }>(
        "SELECT name,content FROM report_exports WHERE id=$1 AND owner_id=$2",
        [id, user.id],
      )
    )[0];
    if (!row) throw new HttpError(404, "Rapport introuvable.");
    return new Response(row.content, {
      headers: {
        "Content-Type": "text/csv;charset=utf-8",
        "Content-Disposition": `attachment; filename="${row.name}"`,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
