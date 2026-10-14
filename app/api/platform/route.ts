import {
  requireUser,
  sameOrigin,
  errorResponse,
  readBody,
} from "@/lib/server/auth";
import { loadPlatform, mutatePlatform } from "@/lib/server/platform";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(await loadPlatform(await requireUser()), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    return Response.json(
      await mutatePlatform(await requireUser(), await readBody(request)),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
