import { requireUser, errorResponse } from "@/lib/server/auth";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(
      { user: await requireUser() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
