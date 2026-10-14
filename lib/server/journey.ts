import { HttpError } from "./auth";
import type { Query } from "./database";
import type { User, Referral, Offer } from "../platform-types";
import {
  journeySchema,
  journeyState,
  type JourneyInput,
  type JourneyEvent,
} from "../journey";
function canonical(value: unknown): string {
  return JSON.stringify(value, (_, v) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v).sort(([a], [b]) => a.localeCompare(b)),
        )
      : v,
  );
}
export async function recordJourney(q: Query, user: User, input: JourneyInput) {
  const events = await q<JourneyEvent>(
    "SELECT * FROM journey_events WHERE youth_id=$1 ORDER BY created_at",
    [input.youthId],
  );
  const existing = await q<JourneyEvent>(
    "SELECT * FROM journey_events WHERE id=$1",
    [input.id],
  );
  if (existing.length) {
    const e = existing[0];
    if (
      e.youth_id === input.youthId &&
      e.actor_id === user.id &&
      e.step === input.step &&
      canonical(
        journeySchema.parse({
          id: e.id,
          youthId: e.youth_id,
          step: e.step,
          data: e.data,
        }).data,
      ) === canonical(input.data)
    )
      return { retried: true };
    throw new HttpError(409, "Identifiant déjà utilisé. Actualise le dossier.");
  }
  let savedData: Record<string, unknown> = input.data;
  const state = journeyState(events),
    today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Africa/Casablanca",
    }).format(new Date());
  if (input.data.date > today)
    throw new HttpError(
      400,
      "Une étape constatée ne peut pas être datée dans le futur.",
    );
  if (
    input.step !== "stabilisation" &&
    events.some((e) => e.step === input.step)
  )
    throw new HttpError(
      409,
      "Cette étape est déjà documentée. Actualise le dossier.",
    );
  if (input.step !== "onboarding" && !state.onboarding)
    throw new HttpError(409, "Confirme d’abord l’entrée dans le programme.");
  if (state.onboarding && input.data.date < state.onboarding.data.date)
    throw new HttpError(400, "La date précède l’entrée dans le programme.");
  if (input.step === "activation") {
    const rows = await q<{ id: string; data: { date: string } }>(
      "SELECT a.* FROM activities a JOIN participations p ON p.activity_id=a.id WHERE p.youth_id=$1 AND p.attended=true AND a.id=ANY($2::text[])",
      [input.youthId, input.data.activityIds],
    );
    if (
      new Set(rows.map((r) => r.id)).size !==
      new Set(input.data.activityIds).size
    )
      throw new HttpError(
        409,
        "Confirme la présence du jeune aux activités choisies avant l’activation.",
      );
    if (
      rows.some(
        (r) =>
          r.data.date > input.data.date ||
          r.data.date < state.onboarding!.data.date,
      )
    )
      throw new HttpError(
        400,
        "Les activités doivent avoir lieu entre l’entrée au programme et le constat d’activation.",
      );
  }
  if (input.step === "insertion") {
    if (!state.activation)
      throw new HttpError(
        409,
        "Documente d’abord le résultat de l’activation.",
      );
    if (input.data.date < state.activation.data.date)
      throw new HttpError(400, "L’entrée en activité précède l’activation.");
    if (input.data.checkDueDate <= input.data.date)
      throw new HttpError(
        400,
        "La vérification de maintien doit suivre l’entrée en activité.",
      );
    const refs = await q<Referral>(
      "SELECT * FROM referrals WHERE id=$1 AND youth_id=$2 AND status='accepted'",
      [input.data.referralId, input.youthId],
    );
    if (!refs.length)
      throw new HttpError(
        409,
        "L’entrée effective doit être liée à une orientation acceptée par le partenaire.",
      );
    const offers = await q<Offer>("SELECT * FROM offers WHERE id=$1", [
      refs[0].offer_id,
    ]);
    if (!offers.length)
      throw new HttpError(409, "L’opportunité liée est introuvable.");
    savedData = { ...input.data, activityType: offers[0].data.type };
    await q(
      "INSERT INTO followups(id,youth_id,actor_id,due_date,note) VALUES($1,$2,$3,$4,$5)",
      [
        input.id,
        input.youthId,
        user.id,
        input.data.checkDueDate,
        `Vérification de maintien · ${input.data.position} · ${input.data.organization}`,
      ],
    );
  }
  if (input.step === "stabilisation") {
    if (!state.insertion)
      throw new HttpError(
        409,
        "Documente d’abord l’entrée effective en activité.",
      );
    if (
      input.data.date < state.insertion.data.date ||
      (state.check && input.data.date < state.check.data.date)
    )
      throw new HttpError(
        400,
        "La vérification doit suivre l’entrée en activité et le dernier suivi.",
      );
    if (input.data.date >= state.insertion.data.checkDueDate) {
      await q(
        "UPDATE followups SET outcome=$1,note=$2 WHERE id=$3 AND outcome='planned'",
        [
          input.data.status === "continuing" ? "completed" : "dropout",
          input.data.note,
          state.insertion.id,
        ],
      );
    }
  }
  await q(
    "INSERT INTO journey_events(id,youth_id,actor_id,step,data) VALUES($1,$2,$3,$4,$5)",
    [input.id, input.youthId, user.id, input.step, JSON.stringify(savedData)],
  );
  return { retried: false };
}
