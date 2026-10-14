import { z } from "zod";
export const journeyDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Date invalide.",
  );
const note = z
  .string()
  .trim()
  .min(5, "Précise les éléments constatés (5 caractères minimum).")
  .max(1500);
const base = z.object({ id: z.uuid(), youthId: z.uuid() });
export const journeySchema = z.discriminatedUnion("step", [
  base.extend({
    step: z.literal("onboarding"),
    data: z.object({
      date: journeyDate,
      programExplained: z.literal(true),
      joined: z.literal(true),
      note,
    }),
  }),
  base.extend({
    step: z.literal("activation"),
    data: z.object({
      date: journeyDate,
      activityIds: z.array(z.uuid()).min(1).max(12),
      abilities: note,
      project: note,
      path: z.enum(["Formation", "Emploi", "Entrepreneuriat"]),
    }),
  }),
  base.extend({
    step: z.literal("insertion"),
    data: z.object({
      date: journeyDate,
      referralId: z.uuid(),
      organization: z.string().trim().min(2).max(150),
      position: z.string().trim().min(2).max(150),
      checkDueDate: journeyDate,
      note,
    }),
  }),
  base.extend({
    step: z.literal("stabilisation"),
    data: z.object({
      date: journeyDate,
      status: z.enum(["continuing", "interrupted"]),
      note,
    }),
  }),
]);
export type JourneyInput = z.infer<typeof journeySchema>;
export type JourneyEvent = {
  id: string;
  youth_id: string;
  actor_id: string;
  created_at: string;
} & (
  | {
      step: "onboarding";
      data: Extract<JourneyInput, { step: "onboarding" }>["data"];
    }
  | {
      step: "activation";
      data: Extract<JourneyInput, { step: "activation" }>["data"];
    }
  | {
      step: "insertion";
      data: Extract<JourneyInput, { step: "insertion" }>["data"] & {
        activityType?: "Formation" | "Emploi" | "Stage" | "Entrepreneuriat";
      };
    }
  | {
      step: "stabilisation";
      data: Extract<JourneyInput, { step: "stabilisation" }>["data"];
    }
);
export const journeyLabels = {
  onboarding: "Entrée dans le programme",
  activation: "Activation et projet",
  insertion: "Entrée effective en activité",
  stabilisation: "Suivi de stabilisation",
};
export function journeyState(events: JourneyEvent[]) {
  const onboarding = events.find((e) => e.step === "onboarding"),
    activation = events.find((e) => e.step === "activation"),
    insertion = events.find((e) => e.step === "insertion");
  const check = events
    .filter((e) => e.step === "stabilisation")
    .sort(
      (a, b) =>
        a.data.date.localeCompare(b.data.date) ||
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .at(-1);
  const interrupted = !!insertion && check?.data.status === "interrupted";
  const stabilized =
    !!insertion &&
    check?.data.status === "continuing" &&
    check.data.date >= insertion.data.checkDueDate;
  return {
    onboarding,
    activation,
    insertion,
    check,
    interrupted,
    stabilized,
    label: interrupted
      ? "Activité interrompue"
      : stabilized
        ? "Maintien confirmé"
        : insertion
          ? "En activité · suivi en cours"
          : activation
            ? "Prêt pour l’orientation"
            : onboarding
              ? "Activation à préparer"
              : "Entrée au programme à confirmer",
  };
}
export function journeyDescription(event: JourneyEvent) {
  switch (event.step) {
    case "onboarding":
      return event.data.note;
    case "activation":
      return `${event.data.path} · ${event.data.project}\nCapacités observées : ${event.data.abilities}`;
    case "insertion":
      return `${event.data.activityType || "Activité"} · ${event.data.position} · ${event.data.organization}\n${event.data.note}\nVérification prévue le ${event.data.checkDueDate}`;
    case "stabilisation":
      return `${event.data.status === "continuing" ? "Activité maintenue" : "Activité interrompue"} · ${event.data.note}`;
  }
}
