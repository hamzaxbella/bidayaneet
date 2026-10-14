import {casablancaDay} from "./casablanca-time";
import { journeyState } from "./journey";
import type { PlatformData } from "./platform-types";
export function reportSummary(data: PlatformData, start: string, end: string) {
  const people = data.people.filter(
    (p) =>
      casablancaDay(p.created_at) >= start &&
      casablancaDay(p.created_at) <= end,
  );
  const states = people.map((p) =>
    journeyState(
      (data.journeys || []).filter(
        (e) => e.youth_id === p.id && e.data.date <= end,
      ),
    ),
  );
  const identified = people.length,
    activated = states.filter((s) => s.activation).length,
    integrated = states.filter((s) => s.insertion).length,
    stabilized = states.filter((s) => s.stabilized).length;
  return {
    identified,
    activated,
    integrated,
    stabilized,
    integrationRate: identified
      ? Math.round((integrated / identified) * 100)
      : 0,
    stabilizationRate: integrated
      ? Math.round((stabilized / integrated) * 100)
      : 0,
  };
}
export function reportCsv(
  summary: ReturnType<typeof reportSummary>,
  start: string,
  end: string,
) {
  return (
    "\uFEFF" +
    [
      ["Indicateur", "Valeur", "Début", "Fin"],
      ["Dossiers reçus", summary.identified, start, end],
      ["Activation confirmée", summary.activated, start, end],
      ["Insertion constatée", summary.integrated, start, end],
      ["Maintien confirmé", summary.stabilized, start, end],
      ["Taux d’insertion (%)", summary.integrationRate, start, end],
      ["Taux de maintien (%)", summary.stabilizationRate, start, end],
    ]
      .map((r) =>
        r.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
      )
      .join("\r\n")
  );
}
