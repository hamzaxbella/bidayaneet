import { errorResponse, readBody } from "@/lib/server/auth";
import { requireNativeUser } from "@/lib/server/native-auth";
import { loadPlatform, mutatePlatform } from "@/lib/server/platform";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return Response.json(await loadPlatform(await requireNativeUser(request)), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
export async function POST(request: Request) {
  try {
    return Response.json(
      await mutatePlatform(
        await requireNativeUser(request),
        await readBody(request),
      ),
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
