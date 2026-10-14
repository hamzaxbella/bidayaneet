import type { PlatformData, Youth } from "./platform-types";
export function recommendActivities(
  youth: Youth,
  data: PlatformData,
  today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Casablanca",
  }).format(new Date()),
) {
  return data.activities
    .flatMap((activity) => {
      if (activity.data.date < today) return [];
      if (
        youth.data.mobility === "local" &&
        activity.data.commune !== youth.data.commune &&
        activity.data.commune !== "En ligne"
      )
        return [];
      if (
        data.participations.filter((p) => p.activity_id === activity.id)
          .length >= activity.data.capacity
      )
        return [];
      const local = activity.data.commune === youth.data.commune;
      const appropriate =
        youth.data.profile === "C"
          ? /remobil|confiance|premier/i.test(
              `${activity.data.category} ${activity.data.title}`,
            )
          : /métier|formation|emploi|cv|employabilité/i.test(
              `${activity.data.category} ${activity.data.title}`,
            );
      const reasons = [
        local
          ? "Dans la commune du jeune"
          : "Mobilité compatible avec le diagnostic",
        "Place disponible selon les inscriptions enregistrées",
      ];
      if (appropriate)
        reasons.push(
          youth.data.profile === "C"
            ? "Premier pas vers la remobilisation"
            : "Découverte ou préparation du projet professionnel",
        );
      return [
        { activity, reasons, score: (local ? 2 : 0) + (appropriate ? 2 : 0) },
      ];
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.activity.data.date.localeCompare(b.activity.data.date),
    )
    .slice(0, 3);
}
