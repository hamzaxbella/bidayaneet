import { randomUUID } from "node:crypto";
import { database } from "./database";
import { hashPassword } from "./password";
import type { Diagnosis, OfferData } from "../platform-types";

export async function seedDemo(password: string) {
  if (password.length < 12)
    throw new Error("Use a demo password with at least 12 characters.");
  const db = await database();
  const hash = await hashPassword(password);
  return db.transaction(async (q) => {
    if ((await q("SELECT id FROM users LIMIT 1")).length)
      throw new Error("Database already contains users; seed refused.");
    const roles = ["admin", "mediator", "partner", "neet"] as const;
    const names = [
      "Amina El Mansouri",
      "Imane Rami",
      "OFPPT Souss-Massa",
      "Salma Aït Ali",
    ];
    const ids: Record<string, string> = {};
    for (let i = 0; i < roles.length; i++) {
      ids[roles[i]] = randomUUID();
      await q(
        "INSERT INTO users(id,email,name,role,password_hash,organization) VALUES($1,$2,$3,$4,$5,$6)",
        [
          ids[roles[i]],
          `${roles[i]}@bidayaneet.demo`,
          names[i],
          roles[i],
          hash,
          roles[i] === "partner" ? "OFPPT Souss-Massa" : "BidayaNeet",
        ],
      );
    }
    const communes = ["Taroudant", "Inezgane", "Aït Baha", "Agadir"];
    const firstNames = [
      "Salma",
      "Fatima",
      "Amina",
      "Youssef",
      "Khadija",
      "Omar",
      "Nadia",
      "Imane",
      "Kamal",
      "Hajar",
    ];
    const people: string[] = [];
    for (let i = 0; i < 30; i++) {
      const id = randomUUID();
      people.push(id);
      const data: Diagnosis = {
        name:
          i === 0
            ? names[3]
            : `${firstNames[i % 10]} ${["Aït Ali", "El Amrani", "Bennani"][Math.floor(i / 10)]}`,
        birthDate: `${1998 + (i % 8)}-04-12`,
        gender: [3, 5, 8].includes(i % 10) ? "M" : "F",
        phone: `060000${String(i).padStart(4, "0")}`,
        commune: communes[i % 4],
        rural: i % 4 !== 3,
        education: ["qualified", "college", "none"][
          i % 3
        ] as Diagnosis["education"],
        situation: i % 3 === 0 ? "seeking" : "inactive",
        skills:
          i % 3 === 0 ? "communication français vente" : "artisanat cuisine",
        interests:
          i % 3 === 0 ? "emploi tourisme vente" : "formation entrepreneuriat",
        mobility: "local",
        childcare: i % 3 === 2,
        availability: i % 3 === 2 ? "part-time" : "flexible",
        profile: (["A", "B", "C"] as const)[i % 3],
        consent: true,
        partnerConsent: true,
        guardianName: "",
        consentAt: new Date().toISOString(),
      };
      await q(
        "INSERT INTO young_people(id,mediator_id,user_id,data,status) VALUES($1,$2,$3,$4,$5)",
        [
          id,
          ids.mediator,
          i === 0 ? ids.neet : null,
          JSON.stringify(data),
          i < 24 ? "validated" : "pending",
        ],
      );
      await q(
        "INSERT INTO followups(id,youth_id,actor_id,due_date,note,outcome) VALUES($1,$2,$3,$4,$5,$6)",
        [
          randomUUID(),
          id,
          ids.mediator,
          i % 3 === 0 ? "2026-10-01" : "2026-10-15",
          "Premier contact et préparation du parcours",
          i % 5 === 0 ? "completed" : "planned",
        ],
      );
    }
    for (let i = 0; i < 10; i++) {
      const data: OfferData = {
        title: [
          "Formation cuisine et hôtellerie",
          "Conseiller vente",
          "Coopérative artisanale",
          "Initiation numérique",
        ][i % 4],
        organization:
          i % 2 ? "ANAPEC · offre fictive" : "OFPPT · offre fictive",
        type: (
          ["Formation", "Emploi", "Entrepreneuriat", "Formation"] as const
        )[i % 4],
        commune: i < 8 ? communes[i % 4] : "En ligne",
        minAge: 18,
        maxAge: 29,
        education: "any",
        skills: "cuisine artisanat vente communication numérique",
        capacity: 12,
        deadline: "2026-12-31",
        partTime: true,
        childcare: true,
        description:
          "Offre fictive de démonstration. Aucun accord partenaire ou recrutement réel n’est annoncé.",
      };
      await q("INSERT INTO offers(id,partner_id,data) VALUES($1,$2,$3)", [
        randomUUID(),
        ids.partner,
        JSON.stringify(data),
      ]);
    }
    for (let i = 0; i < 12; i++) {
      const id = randomUUID();
      await q("INSERT INTO activities(id,data) VALUES($1,$2)", [
        id,
        JSON.stringify({
          title: [
            "Atelier CV",
            "Confiance et premier pas",
            "Découverte des métiers",
          ][i % 3],
          commune: communes[i % 4],
          date: `2026-10-${String(10 + i).padStart(2, "0")}`,
          capacity: 15,
          category: i % 3 === 1 ? "Remobilisation" : "Employabilité",
        }),
      ]);
      if (i < 4)
        await q(
          "INSERT INTO participations(id,youth_id,activity_id,attended) VALUES($1,$2,$3,true)",
          [randomUUID(), people[i], id],
        );
    }
    return ids;
  });
}
