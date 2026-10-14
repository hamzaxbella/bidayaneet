import { journeySchema, journeyState, type JourneyEvent } from "../journey";
import { recordJourney } from "./journey";
import { diagnosisSchema } from "../diagnosis-schema";
export { diagnosisSchema } from "../diagnosis-schema";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { database, type Query } from "./database";
import { HttpError } from "./auth";
import { hashPassword, verifyPassword } from "./password";
import { matchOffers } from "../matching";
import type {
  PlatformData,
  User,
  Youth,
  Offer,
  Referral,
  Role,
} from "../platform-types";

const id = z.uuid();
const text = (max = 200) => z.string().trim().min(1).max(max);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
  );
const timestamp = z.iso.datetime({ offset: true });
const offerSchema = z
  .object({
    programId:z.uuid().optional(),
    title: text(150),
    organization: text(150),
    type: z.enum(["Emploi", "Formation", "Stage", "Entrepreneuriat"]),
    commune: text(100),
    minAge: z.number().int().min(15).max(29),
    maxAge: z.number().int().min(15).max(29),
    education: z.enum(["any", "bac", "qualified"]),
    skills: text(500),
    capacity: z.number().int().min(1).max(1000),
    deadline: date,
    partTime: z.boolean(),
    childcare: z.boolean(),
    description: text(2000),
  })
  .refine((d) => d.maxAge >= d.minAge);

function roles(user: User, allowed: Role[]) {
  if (!allowed.includes(user.role))
    throw new HttpError(403, "Action non autorisée pour cet espace.");
}
async function ownYouth(q: Query, user: User, youthId: string) {
  const rows = await q<Youth>(
    "SELECT * FROM young_people WHERE id=$1 FOR UPDATE",
    [youthId],
  );
  const youth = rows[0];
  if (
    !youth ||
    (user.role !== "admin" &&
      !(user.role === "mediator" && youth.mediator_id === user.id) &&
      !(user.role === "neet" && youth.user_id === user.id))
  )
    throw new HttpError(404, "Dossier introuvable.");
  return youth;
}
async function audit(q: Query, user: User, action: string, entityId: string) {
  await q(
    "INSERT INTO audit(id,actor_id,action,entity_id) VALUES($1,$2,$3,$4)",
    [randomUUID(), user.id, action, entityId],
  );
}

export async function loadPlatform(user: User): Promise<PlatformData> {
  const db = await database();
  return db.transaction(async (q) => {
    const condition =
      user.role === "admin"
        ? "true"
        : user.role === "mediator"
          ? "mediator_id=$1"
          : user.role === "neet"
            ? "user_id=$1"
            : "id IN (SELECT r.youth_id FROM referrals r JOIN offers o ON o.id=r.offer_id WHERE o.partner_id=$1)";
    const params = user.role === "admin" ? [] : [user.id];
    const people = await q<Youth>(
      `SELECT * FROM young_people WHERE ${condition} ORDER BY created_at DESC`,
      params,
    );
    const youthIds = people.map((p) => p.id);
    const offers = await q<Offer>(
      user.role === "partner"
        ? "SELECT * FROM offers WHERE partner_id=$1 ORDER BY created_at DESC"
        : user.role === "admin"
          ? "SELECT * FROM offers ORDER BY created_at DESC"
          : "SELECT * FROM offers WHERE active=true ORDER BY created_at DESC",
      user.role === "partner" ? [user.id] : [],
    );
    const referrals = await q<Referral>(
      user.role === "partner"
        ? "SELECT r.* FROM referrals r JOIN offers o ON o.id=r.offer_id WHERE o.partner_id=$1 ORDER BY r.created_at DESC"
        : "SELECT * FROM referrals WHERE youth_id=ANY($1::text[]) ORDER BY created_at DESC",
      user.role === "partner" ? [user.id] : [youthIds],
    );
    const contacts = await q<User>(
      `SELECT id,name,role,organization,CASE WHEN $2='admin' THEN email ELSE '' END AS email FROM users WHERE id<>$1 AND active=true AND ($2='admin' OR role='admin' OR ($2='mediator' AND (role='partner' OR id IN (SELECT user_id FROM young_people WHERE mediator_id=$1))) OR ($2='neet' AND (id IN (SELECT mediator_id FROM young_people WHERE user_id=$1) OR id IN (SELECT o.partner_id FROM referrals r JOIN offers o ON o.id=r.offer_id JOIN young_people y ON y.id=r.youth_id WHERE y.user_id=$1))) OR ($2='partner' AND (id IN (SELECT y.mediator_id FROM young_people y JOIN referrals r ON r.youth_id=y.id JOIN offers o ON o.id=r.offer_id WHERE o.partner_id=$1) OR id IN (SELECT y.user_id FROM young_people y JOIN referrals r ON r.youth_id=y.id JOIN offers o ON o.id=r.offer_id WHERE o.partner_id=$1)))) ORDER BY name`,
      [user.id, user.role],
    );
    // Partner sees only the information required to evaluate referrals.
    const visiblePeople =
      user.role === "partner"
        ? (people.map((p) => ({
            ...p,
            data: {
              name: p.data.name,
              commune: p.data.commune,
              skills: p.data.skills,
              interests: p.data.interests,
            },
            review_note: "",
          })) as Youth[])
        : people;
    return {
      user,
      people: visiblePeople,
      offers,
      referrals,
      contacts,
      journeys:
        user.role === "partner"
          ? []
          : await q<JourneyEvent>(
              "SELECT * FROM journey_events WHERE youth_id=ANY($1::text[]) ORDER BY created_at",
              [youthIds],
            ),
      activities:
        user.role === "partner"
          ? []
          : await q("SELECT * FROM activities ORDER BY data->>'date'"),
      participations:
        user.role === "partner"
          ? []
          : await q(
              "SELECT * FROM participations WHERE youth_id=ANY($1::text[])",
              [youthIds],
            ),
      followups:
        user.role === "partner"
          ? []
          : await q(
              "SELECT * FROM followups WHERE youth_id=ANY($1::text[]) ORDER BY due_date",
              [youthIds],
            ),
      appointments:
        user.role === "partner"
          ? []
          : await q(
              "SELECT * FROM appointments WHERE youth_id=ANY($1::text[]) ORDER BY starts_at",
              [youthIds],
            ),
      messages: await q(
        "SELECT * FROM messages WHERE sender_id=$1 OR recipient_id=$1 ORDER BY created_at DESC LIMIT 200",
        [user.id],
      ),
      requests:
        user.role === "admin"
          ? await q(
              "SELECT id,email,name,role,organization,status FROM access_requests WHERE status='pending' ORDER BY created_at",
            )
          : [],
      audit:
        user.role === "admin"
          ? await q("SELECT * FROM audit ORDER BY created_at DESC LIMIT 50")
          : [],
    };
  });
}

export async function mutatePlatform(user: User, body: unknown) {
  const envelope = z
    .object({ action: text(40), payload: z.unknown() })
    .parse(body);
  const { action, payload } = envelope;
  // Check contact authorization before entering the mutation transaction.
  let recipient: string | undefined;
  if (action === "message") {
    const data = z.object({ recipientId: id, body: text(2000) }).parse(payload);
    if (
      !(await loadPlatform(user)).contacts.some(
        (c) => c.id === data.recipientId,
      )
    )
      throw new HttpError(403, "Destinataire non autorisé.");
    recipient = data.recipientId;
  }
  const db = await database();
  return db.transaction(async (q) => {
    let entity: string = randomUUID();
    if (action === "journey-step") {
      roles(user, ["admin", "mediator"]);
      const input = journeySchema.parse(payload);
      await ownYouth(q, user, input.youthId);
      const result = await recordJourney(q, user, input);
      if (result.retried) return { ok: true, id: input.id };
      entity = input.id;
    } else if (action === "save-youth") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({
          id: id,
          data: diagnosisSchema,
          version: z.number().int().min(0),
          userId: id.nullable().optional(),
        })
        .parse(payload);
      entity = data.id;
      const existing = await q<Youth>(
        "SELECT * FROM young_people WHERE id=$1 FOR UPDATE",
        [data.id],
      );
      if (existing.length) {
        const youth = await ownYouth(q, user, data.id);
        if (
          data.version === 0 &&
          JSON.stringify(
            Object.fromEntries(Object.entries(data.data).sort()),
          ) ===
            JSON.stringify(
              Object.fromEntries(Object.entries(youth.data).sort()),
            )
        )
          return { ok: true, id: data.id };
        if (data.version !== youth.version)
          throw new HttpError(
            409,
            "Ce dossier a changé. Actualise la page avant de modifier.",
          );
        if (youth.status === "validated")
          throw new HttpError(
            409,
            "Un dossier validé doit être remis en révision par l’administration avant modification.",
          );
        await q(
          "UPDATE young_people SET data=$1,status='pending',review_note='',updated_at=now(),version=version+1 WHERE id=$2",
          [JSON.stringify(data.data), data.id],
        );
      } else {
        if (data.version !== 0)
          throw new HttpError(409, "Dossier introuvable pour cette version.");
        await q(
          "INSERT INTO young_people(id,mediator_id,data) VALUES($1,$2,$3)",
          [data.id, user.id, JSON.stringify(data.data)],
        );
      }
      // Linking a youth account is a separate administrator-only operation.
    } else if (action === "review") {
      roles(user, ["admin"]);
      const data = z
        .object({
          youthId: id,
          status: z.enum(["validated", "revision"]),
          note: z.string().trim().max(1000),
        })
        .parse(payload);
      const youth = await ownYouth(q, user, data.youthId);
      if (data.status === "validated") diagnosisSchema.parse(youth.data);
      if (data.status === "revision" && !data.note)
        throw new HttpError(400, "Indique le motif de révision.");
      entity = data.youthId;
      await q(
        "UPDATE young_people SET status=$1,review_note=$2,updated_at=now(),version=version+1 WHERE id=$3",
        [data.status, data.note, entity],
      );
    } else if (action === "link-account") {
      roles(user, ["admin"]);
      const data = z.object({ youthId: id, userId: id }).parse(payload);
      await ownYouth(q, user, data.youthId);
      const account = await q(
        "SELECT id FROM users WHERE id=$1 AND role='neet'",
        [data.userId],
      );
      if (!account.length)
        throw new HttpError(400, "Compte jeune introuvable.");
      if (
        (
          await q("SELECT id FROM young_people WHERE user_id=$1 AND id<>$2", [
            data.userId,
            data.youthId,
          ])
        ).length
      )
        throw new HttpError(409, "Ce compte est déjà lié à un dossier.");
      entity = data.youthId;
      await q(
        "UPDATE young_people SET user_id=$1,version=version+1,updated_at=now() WHERE id=$2",
        [data.userId, entity],
      );
    } else if (action === "save-offer") {
      roles(user, ["admin", "partner"]);
      const data = z
        .object({ id: id.optional(), partnerId:id.optional(), data: offerSchema })
        .parse(payload);
      if(data.data.programId){const program=(await q<{owner_id:string}>("SELECT owner_id FROM editorial_content WHERE id=$1 AND kind='program'",[data.data.programId]))[0];if(!program||(user.role==='partner'&&program.owner_id!==user.id))throw new HttpError(400,'Programme introuvable pour cet organisme.');}
      if (data.id) {
        entity = data.id;
        const offers = await q<Offer>(
          "SELECT * FROM offers WHERE id=$1 FOR UPDATE",
          [entity],
        );
        if (
          !offers[0] ||
          (user.role !== "admin" && offers[0].partner_id !== user.id)
        )
          throw new HttpError(404, "Offre introuvable.");
        const count = await q<{ count: string }>(
          "SELECT count(*) FROM referrals WHERE offer_id=$1 AND status IN ('proposed','accepted')",
          [entity],
        );
        if (data.data.capacity < Number(count[0].count))
          throw new HttpError(
            409,
            "Capacité inférieure aux orientations actives.",
          );
        await q("UPDATE offers SET data=$1 WHERE id=$2", [
          JSON.stringify(data.data),
          entity,
        ]);
      } else {
        const owner=user.role==='admin'?(data.partnerId||user.id):user.id;
        if(data.partnerId&&user.role!=='admin')throw new HttpError(403,"Seul l’administrateur peut choisir un autre partenaire.");
        if(data.partnerId&&!(await q("SELECT id FROM users WHERE id=$1 AND role='partner' AND active=true",[owner])).length)throw new HttpError(400,"Partenaire introuvable.");
        await q("INSERT INTO offers(id,partner_id,data) VALUES($1,$2,$3)",[entity,owner,JSON.stringify(data.data)]);
      }
    } else if (action === "toggle-offer") {
      roles(user, ["admin", "partner"]);
      const data = z
        .object({ offerId: id, active: z.boolean() })
        .parse(payload);
      entity = data.offerId;
      const rows = await q<Offer>(
        "SELECT * FROM offers WHERE id=$1 FOR UPDATE",
        [entity],
      );
      if (!rows[0] || (user.role !== "admin" && rows[0].partner_id !== user.id))
        throw new HttpError(404, "Offre introuvable.");
      await q("UPDATE offers SET active=$1 WHERE id=$2", [data.active, entity]);
    } else if (action === "refer") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({ youthId: id, offerId: id, youthAgreed: z.literal(true) })
        .parse(payload);
      const youth = await ownYouth(q, user, data.youthId);
      if (youth.status !== "validated" || !youth.data.partnerConsent)
        throw new HttpError(
          409,
          "Le dossier doit être validé et la transmission aux partenaires autorisée.",
        );
      const progress = journeyState(
        await q<JourneyEvent>(
          "SELECT * FROM journey_events WHERE youth_id=$1 ORDER BY created_at",
          [data.youthId],
        ),
      );
      if (!progress.onboarding || !progress.activation)
        throw new HttpError(
          409,
          "Confirme l’entrée au programme et le résultat de l’activation avant orientation.",
        );
      const offers = await q<Offer>(
        "SELECT * FROM offers WHERE id=$1 FOR UPDATE",
        [data.offerId],
      );
      const refs = await q<Referral>(
        "SELECT * FROM referrals WHERE offer_id=$1",
        [data.offerId],
      );
      if (refs.some((r) => r.youth_id === data.youthId))
        throw new HttpError(409, "Cette orientation existe déjà.");
      const match = matchOffers(
        youth,
        offers,
        refs,
        new Date(),
        progress.activation.data,
      )[0];
      if (!match)
        throw new HttpError(
          409,
          "Cette offre n’est plus éligible ou disponible.",
        );
      await q(
        "INSERT INTO referrals(id,youth_id,offer_id,actor_id,score,reasons,youth_agreed) VALUES($1,$2,$3,$4,$5,$6,true)",
        [
          entity,
          data.youthId,
          data.offerId,
          user.id,
          match.score,
          JSON.stringify(match.reasons),
        ],
      );
      for (const days of [7, 30])
        await q(
          "INSERT INTO followups(id,youth_id,actor_id,due_date,note) VALUES($1,$2,$3,$4,$5)",
          [
            randomUUID(),
            data.youthId,
            user.id,
            new Date(Date.now() + days * 86400000).toISOString().slice(0, 10),
            `Suivi J+${days} · ${match.offer.data.title}`,
          ],
        );
    } else if (action === "referral-status") {
      roles(user, ["admin", "partner", "mediator", "neet"]);
      const data = z
        .object({
          referralId: id,
          status: z.enum(["accepted", "rejected", "withdrawn"]),
        })
        .parse(payload);
      entity = data.referralId;
      const refs = await q<Referral & { partner_id: string }>(
        "SELECT r.*,o.partner_id FROM referrals r JOIN offers o ON o.id=r.offer_id WHERE r.id=$1 FOR UPDATE OF r",
        [entity],
      );
      const ref = refs[0];
      if (!ref) throw new HttpError(404, "Orientation introuvable.");
      if (user.role === "partner") {
        if (ref.partner_id !== user.id || data.status === "withdrawn")
          throw new HttpError(403, "Action non autorisée.");
      } else if (user.role !== "admin") {
        await ownYouth(q, user, ref.youth_id);
        if (data.status !== "withdrawn")
          throw new HttpError(
            403,
            "Seul le partenaire peut accepter ou refuser.",
          );
      }
      if (
        ref.status !== "proposed" &&
        !(ref.status === "accepted" && data.status === "withdrawn")
      )
        throw new HttpError(409, "Cette orientation est déjà traitée.");
      await q("UPDATE referrals SET status=$1 WHERE id=$2", [
        data.status,
        entity,
      ]);
    } else if (action === "activity") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({
          title: text(150),
          commune: text(100),
          date,
          capacity: z.number().int().min(1).max(1000),
          category: text(100),
        })
        .parse(payload);
      await q("INSERT INTO activities(id,data) VALUES($1,$2)", [
        entity,
        JSON.stringify(data),
      ]);
    } else if (action === "participation") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({ youthId: id, activityId: id, attended: z.boolean() })
        .parse(payload);
      await ownYouth(q, user, data.youthId);
      const activities = await q<{ data: { capacity: number } }>(
        "SELECT * FROM activities WHERE id=$1 FOR UPDATE",
        [data.activityId],
      );
      if (!activities.length) throw new HttpError(404, "Activité introuvable.");
      const existing = await q(
        "SELECT id FROM participations WHERE youth_id=$1 AND activity_id=$2",
        [data.youthId, data.activityId],
      );
      const count = await q<{ count: string }>(
        "SELECT count(*) FROM participations WHERE activity_id=$1",
        [data.activityId],
      );
      if (
        !existing.length &&
        Number(count[0].count) >= activities[0].data.capacity
      )
        throw new HttpError(409, "Activité complète.");
      await q(
        "INSERT INTO participations(id,youth_id,activity_id,attended) VALUES($1,$2,$3,$4) ON CONFLICT(youth_id,activity_id) DO UPDATE SET attended=excluded.attended",
        [entity, data.youthId, data.activityId, data.attended],
      );
    } else if (action === "followup") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({
          youthId: id,
          dueDate: date,
          note: text(1500),
          outcome: z.enum([
            "planned",
            "completed",
            "unreachable",
            "dropout",
            "inserted",
          ]),
        })
        .parse(payload);
      await ownYouth(q, user, data.youthId);
      await q(
        "INSERT INTO followups(id,youth_id,actor_id,due_date,note,outcome) VALUES($1,$2,$3,$4,$5,$6)",
        [entity, data.youthId, user.id, data.dueDate, data.note, data.outcome],
      );
    } else if (action === "complete-followup") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({
          id,
          outcome: z.enum(["completed", "unreachable", "dropout", "inserted"]),
          note: text(1500),
        })
        .parse(payload);
      entity = data.id;
      const rows = await q<{ youth_id: string }>(
        "SELECT youth_id FROM followups WHERE id=$1 FOR UPDATE",
        [entity],
      );
      if (!rows.length) throw new HttpError(404, "Suivi introuvable.");
      await ownYouth(q, user, rows[0].youth_id);
      await q("UPDATE followups SET outcome=$1,note=$2 WHERE id=$3", [
        data.outcome,
        data.note,
        entity,
      ]);
    } else if (action === "appointment") {
      roles(user, ["admin", "mediator"]);
      const data = z
        .object({
          youthId: id,
          startsAt: timestamp,
          title: text(200),
          location: text(200),
        })
        .parse(payload);
      await ownYouth(q, user, data.youthId);
      await q(
        "INSERT INTO appointments(id,youth_id,actor_id,starts_at,title,location) VALUES($1,$2,$3,$4,$5,$6)",
        [
          entity,
          data.youthId,
          user.id,
          data.startsAt,
          data.title,
          data.location,
        ],
      );
    } else if (action === "message") {
      const data = z
        .object({ recipientId: id, body: text(2000) })
        .parse(payload);
      await q(
        "INSERT INTO messages(id,sender_id,recipient_id,body) VALUES($1,$2,$3,$4)",
        [entity, user.id, recipient, data.body],
      );
    } else if (action === "access-request") {
      roles(user, ["admin"]);
      const data = z
        .object({ requestId: id, approve: z.boolean() })
        .parse(payload);
      entity = data.requestId;
      const rows = await q<User & { password_hash: string; status: string }>(
        "SELECT * FROM access_requests WHERE id=$1 FOR UPDATE",
        [entity],
      );
      const row = rows[0];
      if (!row || row.status !== "pending")
        throw new HttpError(409, "Demande déjà traitée.");
      if (data.approve) {
        if (
          (await q("SELECT id FROM users WHERE email=$1", [row.email])).length
        )
          throw new HttpError(409, "Un compte utilise déjà cette adresse.");
        await q(
          "INSERT INTO users(id,email,name,role,password_hash,organization) VALUES($1,$2,$3,$4,$5,$6)",
          [
            randomUUID(),
            row.email,
            row.name,
            row.role,
            row.password_hash,
            row.organization,
          ],
        );
      }
      await q("UPDATE access_requests SET status=$1 WHERE id=$2", [
        data.approve ? "approved" : "rejected",
        entity,
      ]);
    } else if (action === "password") {
      const data = z
        .object({
          currentPassword: z.string().min(1).max(128),
          password: z.string().min(12).max(128),
        })
        .parse(payload);
      const rows = await q<{ password_hash: string }>(
        "SELECT password_hash FROM users WHERE id=$1 FOR UPDATE",
        [user.id],
      );
      if (!(await verifyPassword(data.currentPassword, rows[0].password_hash)))
        throw new HttpError(400, "Le mot de passe actuel est incorrect.");
      entity = user.id;
      await q("UPDATE users SET password_hash=$1 WHERE id=$2", [
        await hashPassword(data.password),
        user.id,
      ]);
      await q("DELETE FROM sessions WHERE user_id=$1", [user.id]);
    } else if (action === "reset-account") {
      roles(user, ["admin"]);
      const data = z
        .object({ userId: id, password: z.string().min(12).max(128) })
        .parse(payload);
      entity = data.userId;
      if (!(await q("SELECT id FROM users WHERE id=$1", [entity])).length)
        throw new HttpError(404, "Compte introuvable.");
      await q("UPDATE users SET password_hash=$1 WHERE id=$2", [
        await hashPassword(data.password),
        entity,
      ]);
      await q("DELETE FROM sessions WHERE user_id=$1", [entity]);
    } else throw new HttpError(400, "Action inconnue.");
    await audit(q, user, action, entity);
    return { ok: true, id: entity };
  });
}
