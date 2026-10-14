import { reportSummary, reportCsv } from "../reporting";
import { journeyDate } from "../journey";
import { createRecoveryLink, recoverySchema } from "./recovery";
import { hashPassword } from "./password";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { database } from "./database";
import { HttpError } from "./auth";
import { loadPlatform, mutatePlatform } from "./platform";
import type { User } from "../platform-types";
import { stories as storyFixtures } from "../editorial-fixtures";

const uuid = z.uuid();
const text = (n = 200) => z.string().trim().min(1).max(n);
export const roleHome = {
  admin: "/",
  mediator: "/mediator",
  partner: "/partner",
  neet: "/neet",
};
let ready: Promise<void> | undefined;
export function workspaceSchema() {
  return (ready ||= (async () => {
    const db = await database();
    const statements = `
      CREATE TABLE IF NOT EXISTS user_profiles(user_id TEXT PRIMARY KEY REFERENCES users(id),data JSONB NOT NULL DEFAULT '{}');
      CREATE TABLE IF NOT EXISTS youth_bookmarks(user_id TEXT REFERENCES users(id),offer_id TEXT REFERENCES offers(id),PRIMARY KEY(user_id,offer_id));
      CREATE TABLE IF NOT EXISTS youth_applications(id TEXT PRIMARY KEY,user_id TEXT REFERENCES users(id),youth_id TEXT REFERENCES young_people(id),offer_id TEXT REFERENCES offers(id),status TEXT NOT NULL DEFAULT 'submitted',created_at TIMESTAMPTZ DEFAULT now(),UNIQUE(user_id,offer_id));
      CREATE TABLE IF NOT EXISTS action_progress(user_id TEXT PRIMARY KEY REFERENCES users(id),steps JSONB NOT NULL DEFAULT '[]');
      CREATE TABLE IF NOT EXISTS activity_enrollments(user_id TEXT REFERENCES users(id),activity_id TEXT REFERENCES activities(id),created_at TIMESTAMPTZ DEFAULT now(),PRIMARY KEY(user_id,activity_id));
      CREATE TABLE IF NOT EXISTS case_notes(id TEXT PRIMARY KEY,youth_id TEXT REFERENCES young_people(id),actor_id TEXT REFERENCES users(id),body TEXT NOT NULL,next_action TEXT NOT NULL,created_at TIMESTAMPTZ DEFAULT now());
      CREATE TABLE IF NOT EXISTS referral_drafts(id TEXT PRIMARY KEY,youth_id TEXT REFERENCES young_people(id),offer_id TEXT REFERENCES offers(id),actor_id TEXT REFERENCES users(id),created_at TIMESTAMPTZ DEFAULT now(),UNIQUE(youth_id,offer_id,actor_id));
      CREATE TABLE IF NOT EXISTS editorial_content(id TEXT PRIMARY KEY,kind TEXT NOT NULL CHECK(kind IN ('story','program')),owner_id TEXT REFERENCES users(id),data JSONB NOT NULL,published BOOLEAN NOT NULL DEFAULT true,created_at TIMESTAMPTZ DEFAULT now());
      CREATE TABLE IF NOT EXISTS program_memberships(program_id TEXT REFERENCES editorial_content(id),youth_id TEXT REFERENCES young_people(id),status TEXT NOT NULL CHECK(status IN ('active','completed','interrupted')),created_at TIMESTAMPTZ DEFAULT now(),updated_at TIMESTAMPTZ DEFAULT now(),PRIMARY KEY(program_id,youth_id));
      CREATE TABLE IF NOT EXISTS alert_reads(user_id TEXT REFERENCES users(id),followup_id TEXT REFERENCES followups(id),PRIMARY KEY(user_id,followup_id));
      CREATE TABLE IF NOT EXISTS report_exports(id TEXT PRIMARY KEY,owner_id TEXT REFERENCES users(id),name TEXT NOT NULL,content TEXT NOT NULL,start_date DATE NOT NULL,end_date DATE NOT NULL,created_at TIMESTAMPTZ DEFAULT now());
      CREATE TABLE IF NOT EXISTS workspace_settings(id TEXT PRIMARY KEY,data JSONB NOT NULL,updated_at TIMESTAMPTZ DEFAULT now());
      CREATE TABLE IF NOT EXISTS private_documents(user_id TEXT PRIMARY KEY REFERENCES users(id),filename TEXT NOT NULL,content BYTEA NOT NULL,updated_at TIMESTAMPTZ DEFAULT now());
      ALTER TABLE youth_applications ADD COLUMN IF NOT EXISTS feedback TEXT NOT NULL DEFAULT '';
      ALTER TABLE appointments ADD COLUMN IF NOT EXISTS completed BOOLEAN NOT NULL DEFAULT false;
      ALTER TABLE referrals ADD COLUMN IF NOT EXISTS partner_stage TEXT NOT NULL DEFAULT 'New';
      ALTER TABLE referrals ADD COLUMN IF NOT EXISTS partner_note TEXT NOT NULL DEFAULT '';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;
      CREATE INDEX IF NOT EXISTS case_notes_youth ON case_notes(youth_id);
    `;
    await recoverySchema();
    await db.transaction(async q=>{
      if(process.env.DATABASE_URL)await q('SELECT pg_advisory_xact_lock(734902)');
      for(const sql of statements.split(';').filter(s=>s.trim()))await q(sql);
      for(const s of storyFixtures)await q("INSERT INTO editorial_content(id,kind,data) VALUES($1,'story',$2) ON CONFLICT(id) DO NOTHING",[s.id,JSON.stringify({...s,fictitious:true})]);
    });
  })().catch(error=>{ready=undefined;throw error;}));
}
function allow(user: User, roles: string[]) {
  if (!roles.includes(user.role))
    throw new HttpError(403, "Action non autorisée.");
}
export async function loadWorkspace(user: User) {
  await workspaceSchema();
  const platform = await loadPlatform(user),
    db = await database();
  const ids = platform.people.map((p) => p.id);
  const profile =
    (
      await db.query<{ data: Record<string, string> }>(
        "SELECT data FROM user_profiles WHERE user_id=$1",
        [user.id],
      )
    )[0]?.data || {};
  const ownPreferences =
    user.role === "neet"
      ? {
          saved: (
            await db.query<{ offer_id: string }>(
              "SELECT offer_id FROM youth_bookmarks WHERE user_id=$1",
              [user.id],
            )
          ).map((r) => r.offer_id),
          applications: (
            await db.query<{ offer_id: string }>(
              "SELECT offer_id FROM youth_applications WHERE user_id=$1",
              [user.id],
            )
          ).map((r) => r.offer_id),
          completed:
            (
              await db.query<{ steps: number[] }>(
                "SELECT steps FROM action_progress WHERE user_id=$1",
                [user.id],
              )
            )[0]?.steps || [],
          enrolled: (
            await db.query<{ activity_id: string }>(
              "SELECT activity_id FROM activity_enrollments WHERE user_id=$1",
              [user.id],
            )
          ).map((r) => r.activity_id),
        }
      : { saved: [], applications: [], completed: [], enrolled: [] };
  const professional = ["admin", "mediator"].includes(user.role);
  return {
    ...platform,
    now:new Date().toISOString(),
    profile,
    preferences: ownPreferences,
    notes: professional
      ? await db.query(
          "SELECT * FROM case_notes WHERE youth_id=ANY($1::text[]) ORDER BY created_at DESC",
          [ids],
        )
      : [],
    drafts: professional
      ? await db.query(
          "SELECT * FROM referral_drafts WHERE youth_id=ANY($1::text[])",
          [ids],
        )
      : [],
    stories: await db.query<{
      id: string;
      data: (typeof storyFixtures)[number];
    }>(
      "SELECT id,data FROM editorial_content WHERE kind='story' AND published=true ORDER BY created_at,id",
    ),
    programs: await db.query(
      "SELECT id,owner_id,data,published FROM editorial_content WHERE kind='program' AND ($1='admin' OR published=true OR owner_id=$2) ORDER BY created_at DESC",
      [user.role, user.id],
    ),
    reports:
      user.role === "admin"
        ? await db.query(
            "SELECT id,name,start_date,end_date,created_at FROM report_exports WHERE owner_id=$1 ORDER BY created_at DESC LIMIT 50",
            [user.id],
          )
        : [],
    alertReads: (
      await db.query<{ followup_id: string }>(
        "SELECT followup_id FROM alert_reads WHERE user_id=$1",
        [user.id],
      )
    ).map((r) => r.followup_id),
    memberships:
      user.role === "admin"
        ? await db.query("SELECT * FROM program_memberships")
        : user.role === "partner"
          ? await db.query(
              "SELECT m.* FROM program_memberships m JOIN editorial_content e ON e.id=m.program_id WHERE e.owner_id=$1",
              [user.id],
            )
          : await db.query(
              "SELECT * FROM program_memberships WHERE youth_id=ANY($1::text[])",
              [ids],
            ),
    applications:
      user.role === "admin"
        ? await db.query(
            "SELECT * FROM youth_applications ORDER BY created_at DESC",
          )
        : user.role === "partner"
          ? await db.query(
              "SELECT a.*,y.data->>'name' AS name,y.data->>'commune' AS commune FROM youth_applications a JOIN offers o ON o.id=a.offer_id JOIN young_people y ON y.id=a.youth_id WHERE o.partner_id=$1 ORDER BY a.created_at DESC",
              [user.id],
            )
          : user.role === "neet"
            ? await db.query(
                "SELECT * FROM youth_applications WHERE user_id=$1 ORDER BY created_at DESC",
                [user.id],
              )
            : [],
    staff:
      user.role === "admin"
        ? await db.query(
            "SELECT id,name,email,role,organization,active,created_at FROM users WHERE role<>'neet' ORDER BY name",
          )
        : [],
    settings:
      user.role === "admin"
        ? (
            await db.query<{ data: Record<string, unknown> }>(
              "SELECT data FROM workspace_settings WHERE id='regional'",
            )
          )[0]?.data || {}
        : {},
    recovery:
      user.role === "admin"
        ? await db.query(
            "SELECT r.user_id,u.name,u.email,u.role,r.created_at FROM recovery_requests r JOIN users u ON u.id=r.user_id ORDER BY r.created_at",
          )
        : [],
    activityLog: await db.query(
      "SELECT id,action,entity_id,created_at FROM audit WHERE actor_id=$1 ORDER BY created_at DESC LIMIT 7",
      [user.id],
    ),
    document:
      (
        await db.query(
          "SELECT filename,updated_at FROM private_documents WHERE user_id=$1",
          [user.id],
        )
      )[0] || null,
  };
}
export async function workspaceCommand(user: User, body: unknown) {
  await workspaceSchema();
  const { action, payload } = z
    .object({ action: text(40), payload: z.unknown() })
    .parse(body);
  const db = await database();
  if (action === "application-status") {
    allow(user, ["partner"]);
    const p = z
      .object({
        id: uuid,
        status: z.enum([
          "submitted",
          "shortlisted",
          "interview",
          "accepted",
          "rejected",
        ]),
        feedback: z.string().max(2000),
      })
      .parse(payload);
    const rows = await db.query(
      "UPDATE youth_applications SET status=$1,feedback=$2 WHERE id=$3 AND offer_id IN (SELECT id FROM offers WHERE partner_id=$4) RETURNING id",
      [p.status, p.feedback, p.id, user.id],
    );
    if (!rows.length) throw new HttpError(404, "Candidature introuvable.");
    return { ok: true };
  }
  if (action === "report-export") {
    allow(user, ["admin"]);
    const p = z
        .object({ start: journeyDate, end: journeyDate })
        .refine((p) => p.start <= p.end)
        .parse(payload),
      id = randomUUID(),
      summary = reportSummary(await loadPlatform(user), p.start, p.end),
      name = `BidayaNeet-${p.start}-${p.end}.csv`;
    await db.query(
      "INSERT INTO report_exports(id,owner_id,name,content,start_date,end_date) VALUES($1,$2,$3,$4,$5,$6)",
      [id, user.id, name, reportCsv(summary, p.start, p.end), p.start, p.end],
    );
    return { ok: true, url: "/api/workspace/reports/" + id };
  }
  if (action === "alert-read") {
    allow(user, ["admin", "mediator"]);
    const ids = z.array(uuid).max(500).parse(payload),
      platform = await loadPlatform(user);
    if (ids.some((id) => !platform.followups.some((f) => f.id === id)))
      throw new HttpError(404, "Alerte introuvable.");
    await db.transaction(async (q) => {
      for (const id of new Set(ids))
        await q(
          "INSERT INTO alert_reads(user_id,followup_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
          [user.id, id],
        );
    });
    return { ok: true };
  }
  if (action === "program-member") {
    allow(user, ["admin", "mediator"]);
    const p = z
      .object({
        programId: uuid,
        youthId: uuid,
        status: z.enum(["active", "completed", "interrupted"]),
      })
      .parse(payload);
    await db.transaction(async (q) => {
      const youth = (
        await q<{ mediator_id: string }>(
          "SELECT mediator_id FROM young_people WHERE id=$1 FOR UPDATE",
          [p.youthId],
        )
      )[0];
      if (!youth || (user.role !== "admin" && youth.mediator_id !== user.id))
        throw new HttpError(404, "Dossier introuvable.");
      const program = (
        await q<{ data: { capacity: number }; published: boolean }>(
          "SELECT data,published FROM editorial_content WHERE id=$1 AND kind='program' FOR UPDATE",
          [p.programId],
        )
      )[0];
      if (!program || (p.status === "active" && !program.published))
        throw new HttpError(404, "Programme indisponible.");
      const old = (
        await q<{ status: string }>(
          "SELECT status FROM program_memberships WHERE program_id=$1 AND youth_id=$2",
          [p.programId, p.youthId],
        )
      )[0];
      if (p.status === "active" && old?.status !== "active") {
        const count = (
          await q<{ count: string }>(
            "SELECT count(*) FROM program_memberships WHERE program_id=$1 AND status='active'",
            [p.programId],
          )
        )[0];
        if (Number(count.count) >= program.data.capacity)
          throw new HttpError(409, "Ce programme est complet.");
      }
      if (p.status !== "active" && !old)
        throw new HttpError(409, "Inscris d’abord ce jeune au programme.");
      await q(
        "INSERT INTO program_memberships(program_id,youth_id,status) VALUES($1,$2,$3) ON CONFLICT(program_id,youth_id) DO UPDATE SET status=excluded.status,updated_at=now()",
        [p.programId, p.youthId, p.status],
      );
    });
    await db.query(
      "INSERT INTO audit(id,actor_id,action,entity_id) VALUES($1,$2,$3,$4)",
      [randomUUID(), user.id, action, p.youthId],
    );
    return { ok: true };
  }
  if (action === "reset-link")
    return createRecoveryLink(
      user,
      z.object({ userId: uuid }).parse(payload).userId,
    );
  if (action === "professional-create") {
    allow(user, ["admin"]);
    const p = z
      .object({
        name: text(120),
        email: z.email(),
        role: z.enum(["mediator", "partner"]),
        organization: text(200),
        password: z.string().min(8).max(128),
      })
      .parse(payload);
    const id = randomUUID(),
      hash = await hashPassword(p.password);
    await db.query(
      "INSERT INTO users(id,name,email,role,organization,password_hash) VALUES($1,$2,$3,$4,$5,$6)",
      [id, p.name, p.email.toLowerCase(), p.role, p.organization, hash],
    );
    return { ok: true, id };
  }
  if (action === "workspace-profile") {
    const profile = z.record(z.string(), z.string().max(1500)).parse(payload);
    const permitted = [
      "firstName",
      "lastName",
      "phone",
      "city",
      "goal",
      "skills",
      "interests",
      "language",
      "presentation",
      "availability",
    ];
    const values = Object.fromEntries(
      Object.entries(profile).filter(([k]) => permitted.includes(k)),
    );
    const name = [values.firstName, values.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (name.length < 2 || name.length > 120)
      throw new HttpError(400, "Vérifie ton nom.");
    await db.transaction(async (q) => {
      await q("UPDATE users SET name=$1 WHERE id=$2", [name, user.id]);
      await q(
        "INSERT INTO user_profiles(user_id,data) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET data=excluded.data",
        [user.id, JSON.stringify(values)],
      );
    });
  } else if (action === "bookmark-set") {
    allow(user, ["neet"]);
    const ids = z.array(uuid).max(200).parse(payload),
      platform = await loadPlatform(user);
    if (ids.some((id) => !platform.offers.some((o) => o.id === id)))
      throw new HttpError(400, "Une offre sélectionnée est indisponible.");
    await db.transaction(async (q) => {
      await q("DELETE FROM youth_bookmarks WHERE user_id=$1", [user.id]);
      for (const id of new Set(ids))
        await q("INSERT INTO youth_bookmarks(user_id,offer_id) VALUES($1,$2)", [
          user.id,
          id,
        ]);
    });
  } else if (action === "checklist-set") {
    allow(user, ["neet"]);
    const steps = z
      .array(z.number().int().min(0).max(20))
      .max(21)
      .parse(payload);
    await db.query(
      "INSERT INTO action_progress(user_id,steps) VALUES($1,$2) ON CONFLICT(user_id) DO UPDATE SET steps=excluded.steps",
      [user.id, JSON.stringify([...new Set(steps)])],
    );
  } else if (action === "application") {
    allow(user, ["neet"]);
    const { offerId } = z.object({ offerId: uuid }).parse(payload);
    await db.transaction(async (q) => {
      const young = (
        await q<{ id: string; data: { partnerConsent: boolean } }>(
          "SELECT id,data FROM young_people WHERE user_id=$1 FOR UPDATE",
          [user.id],
        )
      )[0];
      if (!young)
        throw new HttpError(
          409,
          "Ton compte doit être relié à un dossier par ton médiateur.",
        );
      if (!young.data.partnerConsent)
        throw new HttpError(
          400,
          "Confirme avec ton médiateur l’accord de transmission au partenaire.",
        );
      const offer = (
        await q<{ id: string }>(
          "SELECT id FROM offers WHERE id=$1 AND active=true AND data->>'deadline'>=$2 FOR UPDATE",
          [offerId, new Date().toISOString().slice(0, 10)],
        )
      )[0];
      if (!offer) throw new HttpError(404, "Offre indisponible.");
      await q(
        "INSERT INTO youth_applications(id,user_id,youth_id,offer_id) VALUES($1,$2,$3,$4) ON CONFLICT(user_id,offer_id) DO NOTHING",
        [randomUUID(), user.id, young.id, offerId],
      );
    });
  } else if (action === "enrollment-set") {
    allow(user, ["neet"]);
    const ids = z.array(uuid).max(100).parse(payload);
    await db.transaction(async (q) => {
      await q("SELECT id FROM users WHERE id=$1 FOR UPDATE", [user.id]);
      for (const activityId of [...new Set(ids)].sort()) {
        const a = (
          await q<{ data: { capacity: number } }>(
            "SELECT data FROM activities WHERE id=$1 FOR UPDATE",
            [activityId],
          )
        )[0];
        if (!a) throw new HttpError(404, "Activité introuvable.");
        const exists = await q(
          "SELECT user_id FROM activity_enrollments WHERE user_id=$1 AND activity_id=$2",
          [user.id, activityId],
        );
        const count = (
          await q<{ count: string }>(
            "SELECT count(*) FROM activity_enrollments WHERE activity_id=$1",
            [activityId],
          )
        )[0];
        if (!exists.length && Number(count.count) >= a.data.capacity)
          throw new HttpError(409, "Cette activité est complète.");
        await q(
          "INSERT INTO activity_enrollments(user_id,activity_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
          [user.id, activityId],
        );
      }
      await q(
        "DELETE FROM activity_enrollments WHERE user_id=$1 AND NOT(activity_id=ANY($2::text[]))",
        [user.id, ids],
      );
    });
  } else if (action === "case-note" || action === "referral-draft") {
    allow(user, ["mediator", "admin"]);
    const input =
      action === "case-note"
        ? z
            .object({
              id: uuid,
              youthId: uuid,
              body: text(3000),
              nextAction: text(200),
            })
            .parse(payload)
        : z.object({ id: uuid, youthId: uuid, offerId: uuid }).parse(payload);
    await db.transaction(async (q) => {
      const youth = (
        await q<{ mediator_id: string }>(
          "SELECT mediator_id FROM young_people WHERE id=$1 FOR UPDATE",
          [input.youthId],
        )
      )[0];
      if (!youth || (user.role !== "admin" && youth.mediator_id !== user.id))
        throw new HttpError(404, "Dossier introuvable.");
      if ("body" in input)
        await q(
          "INSERT INTO case_notes(id,youth_id,actor_id,body,next_action) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO NOTHING",
          [input.id, input.youthId, user.id, input.body, input.nextAction],
        );
      else {
        if (
          !(
            await q("SELECT id FROM offers WHERE id=$1 AND active=true", [
              input.offerId,
            ])
          ).length
        )
          throw new HttpError(404, "Offre introuvable.");
        await q(
          "INSERT INTO referral_drafts(id,youth_id,offer_id,actor_id) VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING",
          [input.id, input.youthId, input.offerId, user.id],
        );
      }
    });
  } else if (action === "appointment-done") {
    allow(user, ["mediator", "admin"]);
    const p = z.object({ id: uuid, done: z.boolean() }).parse(payload);
    const rows = await db.query(
      "UPDATE appointments SET completed=$1 WHERE id=$2 AND ($3='admin' OR actor_id=$4) RETURNING id",
      [p.done, p.id, user.role, user.id],
    );
    if (!rows.length) throw new HttpError(404, "Rendez-vous introuvable.");
  } else if (action === "referral-stage") {
    allow(user, ["partner"]);
    const p = z
      .object({
        id: uuid,
        status: z.enum([
          "New",
          "Shortlisted",
          "Interview",
          "Accepted",
          "Rejected",
        ]),
        notes: z.string().max(2000),
      })
      .parse(payload);
    const owned = await db.query(
      "SELECT r.id FROM referrals r JOIN offers o ON o.id=r.offer_id WHERE r.id=$1 AND o.partner_id=$2",
      [p.id, user.id],
    );
    if (!owned.length) throw new HttpError(404, "Orientation introuvable.");
    if (["Accepted", "Rejected"].includes(p.status))
      await mutatePlatform(user, {
        action: "referral-status",
        payload: {
          referralId: p.id,
          status: p.status === "Accepted" ? "accepted" : "rejected",
        },
      });
    await db.query(
      "UPDATE referrals SET partner_stage=$1,partner_note=$2 WHERE id=$3",
      [p.status, p.notes, p.id],
    );
  } else if (action === "partner-offer") {
    allow(user, ["partner"]);
    const p = z
      .object({
        id: uuid,
        title: text(150),
        programId:uuid.optional(),
        type: z.preprocess(
          (v) =>
            ({
              Training: "Formation",
              Internship: "Stage",
              Job: "Emploi",
              Program: "Entrepreneuriat",
            })[String(v) as "Training"] || v,
          z.enum(["Emploi", "Formation", "Stage", "Entrepreneuriat"]),
        ),
        commune: text(100),
        capacity: z.number().int().min(1).max(1000),
        deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        status: z.enum(["Open", "Full", "Draft"]),
      })
      .parse(payload);
    const previous = (
      await db.query<{ data: Record<string, unknown> }>(
        "SELECT data FROM offers WHERE id=$1 AND partner_id=$2",
        [p.id, user.id],
      )
    )[0];
    const data = {
      minAge: 15,
      maxAge: 29,
      education: "any",
      skills: "Tous profils",
      partTime: false,
      childcare: false,
      description: p.title,
      ...previous?.data,
      title: p.title,
      type: p.type,
      commune: p.commune,
      capacity: p.capacity,
      deadline: p.deadline,
      organization: user.organization || user.name,
      programId:p.programId??previous?.data.programId,
    };
    const saved = await mutatePlatform(user, {
      action: "save-offer",
      payload: { id: previous ? p.id : undefined, data },
    });
    await mutatePlatform(user, {
      action: "toggle-offer",
      payload: { offerId: saved.id, active: p.status !== "Draft" },
    });
  } else if (action === "editorial-save") {
    allow(user, ["admin", "partner"]);
    const p = z
      .object({
        id: z.string().min(1).max(80),
        ownerId:uuid.optional(),
        kind: z.enum(["story", "program"]),
        published: z.boolean(),
        data: z.union([
          z.object({
            title: text(200),
            description: text(4000),
            organization: text(200).optional(),
            commune: text(100),
            capacity: z.number().int().min(1).max(10000),
            location:z.object({latitude:z.number().min(-90).max(90),longitude:z.number().min(-180).max(180)}).optional(),
            image: z.string().startsWith("/").max(250).optional(),
          }),
          z.object({
            name: text(120),
            role: text(150),
            city: text(100),
            quote: text(1000),
            text: text(4000),
            image: z.string().startsWith("/").max(250),
          }),
        ]),
      })
      .parse(payload);
    if (
      (p.kind === "program" && !("title" in p.data)) ||
      (p.kind === "story" && !("name" in p.data))
    )
      throw new HttpError(400, "Vérifie les champs du contenu.");
    if (p.kind === "story" && user.role !== "admin")
      throw new HttpError(403, "Réservé à l’administration.");
    await db.transaction(async (q) => {
      const old = (
        await q<{ owner_id: string; kind: string }>(
          "SELECT owner_id,kind FROM editorial_content WHERE id=$1 FOR UPDATE",
          [p.id],
        )
      )[0];
      if (old && user.role !== "admin" && old.owner_id !== user.id)
        throw new HttpError(404, "Contenu introuvable.");
      if (old && old.kind !== p.kind)
        throw new HttpError(409, "Ce contenu appartient à un autre type.");
      if (p.kind === "program" && "capacity" in p.data) {
        const count = (
          await q<{ count: string }>(
            "SELECT count(*) FROM program_memberships WHERE program_id=$1 AND status='active'",
            [p.id],
          )
        )[0];
        if (Number(count.count) > p.data.capacity)
          throw new HttpError(
            409,
            "Capacité inférieure aux inscriptions actives.",
          );
      }
      const owner=p.ownerId||old?.owner_id||user.id;
      if(p.ownerId&&p.ownerId!==user.id){if(user.role!=='admin'||!(await q("SELECT id FROM users WHERE id=$1 AND role='partner' AND active=true",[p.ownerId])).length)throw new HttpError(403,'Organisme responsable non autorisé.');}
      await q(
        "INSERT INTO editorial_content(id,kind,owner_id,data,published) VALUES($1,$2,$3,$4,$5) ON CONFLICT(id) DO UPDATE SET data=excluded.data,published=excluded.published,owner_id=excluded.owner_id",
        [p.id, p.kind, owner, JSON.stringify(p.data), p.published],
      );
    });
  } else if (action === "workspace-settings") {
    allow(user, ["admin"]);
    const p = z
      .object({
        region: text(120),
        organization: text(120),
        language: z.enum(["fr", "ar"]),
        followupDays: z.number().int().min(1).max(365),
      })
      .parse(payload);
    await db.query(
      "INSERT INTO workspace_settings(id,data) VALUES('regional',$1) ON CONFLICT(id) DO UPDATE SET data=excluded.data,updated_at=now()",
      [JSON.stringify(p)],
    );
  } else if (action === "user-active") {
    allow(user, ["admin"]);
    const p = z.object({ id: uuid, active: z.boolean() }).parse(payload);
    if (p.id === user.id)
      throw new HttpError(400, "Tu ne peux pas désactiver ton propre compte.");
    await db.transaction(async (q) => {
      if (
        !(
          await q("UPDATE users SET active=$1 WHERE id=$2 RETURNING id", [
            p.active,
            p.id,
          ])
        ).length
      )
        throw new HttpError(404, "Compte introuvable.");
      if (!p.active) await q("DELETE FROM sessions WHERE user_id=$1", [p.id]);
    });
  } else return mutatePlatform(user, body);
  await db.query(
    "INSERT INTO audit(id,actor_id,action,entity_id) VALUES($1,$2,$3,$4)",
    [randomUUID(), user.id, action, user.id],
  );
  return { ok: true };
}
