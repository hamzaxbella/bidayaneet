import { HttpError,
  errorResponse,
  readBody,
  requireUser,
  sameOrigin,
} from "@/lib/server/auth";
import { loadWorkspace, workspaceCommand } from "@/lib/server/workspace";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(await loadWorkspace(await requireUser()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const user = await requireUser();
    const expectedUser = request.headers.get("X-Workspace-User");
    if (expectedUser && expectedUser !== user.id) throw new HttpError(409, "Session changed. Reload before saving.");
    return Response.json(await workspaceCommand(user, await readBody(request)));
  } catch (e) {
    return errorResponse(e);
  }
}
