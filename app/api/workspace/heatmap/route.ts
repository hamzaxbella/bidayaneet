import { requireUser, errorResponse, HttpError } from "@/lib/server/auth";
import {loadWorkspace} from "@/lib/server/workspace";
import { aggregateCoverage } from "@/lib/geo";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const user = await requireUser();
    if (!["admin", "mediator"].includes(user.role))
      throw new HttpError(403, "Carte réservée aux équipes de médiation.");
    const data = await loadWorkspace(user);
    return Response.json(
      {
        cells: aggregateCoverage(data.people,data.programs),
        withoutLocation: data.people.filter((p) => !p.data.location).length,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
