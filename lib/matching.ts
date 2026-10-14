import type { Offer, Youth, Referral } from "./platform-types";
export function ageAt(birthDate: string, today = new Date()) {
  const date = new Date(`${birthDate}T00:00:00Z`);
  let age = today.getUTCFullYear() - date.getUTCFullYear();
  if (
    today.getUTCMonth() < date.getUTCMonth() ||
    (today.getUTCMonth() === date.getUTCMonth() &&
      today.getUTCDate() < date.getUTCDate())
  )
    age--;
  return age;
}
export function matchOffers(
  youth: Youth,
  offers: Offer[],
  referrals: Referral[],
  today = new Date(),
  activation?: { abilities: string; project: string; path: string },
) {
  const person = activation
    ? {
        ...youth.data,
        skills: `${youth.data.skills}, ${activation.abilities}`,
        interests: `${youth.data.interests}, ${activation.project}`,
      }
    : youth.data;
  const age = ageAt(person.birthDate, today);
  return offers
    .flatMap((offer) => {
      const data = offer.data;
      const used = referrals.filter(
        (r) =>
          r.offer_id === offer.id &&
          ["proposed", "accepted"].includes(r.status),
      ).length;
      if (
        !offer.active ||
        age < data.minAge ||
        age > data.maxAge ||
        data.deadline < today.toISOString().slice(0, 10) ||
        used >= data.capacity
      )
        return [];
      if (data.education === "qualified" && person.education !== "qualified")
        return [];
      if (
        data.education === "bac" &&
        !["bac", "qualified"].includes(person.education)
      )
        return [];
      if (
        person.mobility === "local" &&
        data.commune !== person.commune &&
        data.commune !== "En ligne"
      )
        return [];
      if (person.availability === "part-time" && !data.partTime) return [];
      if (person.childcare && !data.childcare) return [];
      const reasons = ["Âge et prérequis compatibles", "Places disponibles"];
      let score = 40;
      if (data.commune === person.commune || data.commune === "En ligne") {
        score += 20;
        reasons.push("Accessible depuis le lieu de résidence");
      }
      const words = `${person.skills} ${person.interests}`
        .toLocaleLowerCase("fr")
        .split(/[,;\s]+/)
        .filter((w) => w.length > 2);
      const offerText =
        `${data.skills} ${data.title} ${data.description}`.toLocaleLowerCase(
          "fr",
        );
      const common = [...new Set(words.filter((w) => offerText.includes(w)))];
      if (common.length) {
        score += Math.min(20, common.length * 5);
        reasons.push(`Compétences / intérêts : ${common.join(", ")}`);
      }
      if (
        (person.profile === "A" && ["Emploi", "Stage"].includes(data.type)) ||
        (person.profile === "B" && data.type === "Formation") ||
        (person.profile === "C" &&
          ["Formation", "Entrepreneuriat"].includes(data.type))
      ) {
        score += 10;
        reasons.push(`Parcours adapté au profil ${person.profile}`);
      }
      if (person.profile === "C" || person.rural) {
        score += 10;
        reasons.push(
          "Priorité d’accompagnement : éloignement / territoire rural",
        );
      }
      if (
        activation &&
        (data.type === activation.path ||
          (activation.path === "Emploi" && data.type === "Stage"))
      ) {
        score += 5;
        reasons.push(
          `Projet clarifié lors de l’activation : ${activation.path}`,
        );
      }
      return [{ offer, score: Math.min(100, score), reasons }];
    })
    .sort((a, b) => b.score - a.score || a.offer.id.localeCompare(b.offer.id))
    .slice(0, 3);
}
