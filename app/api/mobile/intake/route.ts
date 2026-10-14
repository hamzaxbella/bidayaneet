import { errorResponse, readBody, HttpError } from "@/lib/server/auth";
import { requireNativeUser } from "@/lib/server/native-auth";
import { mutatePlatform } from "@/lib/server/platform";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    return Response.json(
      { user: await requireNativeUser(request) },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(request: Request) {
  try {
    const user = await requireNativeUser(request),
      body = await readBody(request);
    if (
      !body ||
      typeof body !== "object" ||
      !("action" in body) ||
      body.action !== "save-youth"
    )
      throw new HttpError(
        403,
        "Cette application permet uniquement de collecter un diagnostic.",
      );
    return Response.json(await mutatePlatform(user, body), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (e) {
    return errorResponse(e);
  }
}
