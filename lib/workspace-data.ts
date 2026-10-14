import {casablancaDay} from "./casablanca-time";
import type { loadWorkspace } from "./server/workspace";
import { ageAt, matchOffers } from "./matching";
import { journeyState } from "./journey";
export type WorkspaceData = Awaited<ReturnType<typeof loadWorkspace>>;
export type AppointmentView = {
  id: string;
  youthId: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  done: boolean;
};
const displayDate = (v: string) =>
  new Date(v).toLocaleDateString("fr-MA", {
    timeZone: "Africa/Casablanca",
    day: "numeric",
    month: "short",
  });
const pictures = {
  Emploi: "/editorial/opp-retail.webp",
  Formation: "/editorial/opp-web-dev.webp",
  Stage: "/editorial/opp-marketing.webp",
  Entrepreneuriat: "/editorial/opp-entrepreneur.webp",
};
export function workspaceDatasets(data: WorkspaceData) {
  const own = data.people[0];
  const profile = {
    firstName: data.user.name.split(" ")[0],
    lastName: data.user.name.split(" ").slice(1).join(" "),
    email: data.user.email,
    phone: own?.data.phone || "",
    city: own?.data.commune || "",
    goal: own?.data.interests || "",
    skills: own?.data.skills || "",
    interests: own?.data.interests || "",
    language: "",
    presentation: "",
    availability: "",
    ...data.profile,
  };
  const youngPeople = data.people.map((p) => {
    const state = journeyState(
      (data.journeys || []).filter((e) => e.youth_id === p.id),
    );
    const due = data.followups
      .filter((f) => f.youth_id === p.id && f.outcome === "planned")
      .sort((a, b) => a.due_date.localeCompare(b.due_date))[0];
    const complete = [
      "name",
      "birthDate",
      "phone",
      "commune",
      "skills",
      "interests",
      "profile",
      "consent",
    ].filter((k) => !!p.data[k as keyof typeof p.data]).length;
    const stage = state.stabilized
      ? "Stabilisé"
      : state.insertion
        ? "Intégré"
        : state.activation
          ? "Activé"
          : p.status === "validated"
            ? "Validé"
            : "Identifié";
    return {
      id: p.id,
      name: p.data.name,
      age: ageAt(p.data.birthDate),
      city: p.data.commune,
      stage,
      trust: "Non renseignée",
      priority:
        due && due.due_date < new Date().toISOString().slice(0, 10)
          ? "Prioritaire"
          : "Suivi régulier",
      progress: Math.round((complete / 8) * 100),
      goal: p.data.interests,
      next: due?.note || state.label,
      date: due ? displayDate(due.due_date) : "",
      photo: "/editorial/story-amina.webp",
      skills: p.data.skills,
      blocker:
        [
          p.data.mobility === "local" ? "Mobilité locale" : "",
          p.data.childcare ? "Garde d’enfants" : "",
          p.data.availability === "part-time" ? "Temps partiel" : "",
        ]
          .filter(Boolean)
          .join(" · ") || "Non renseigné",
    };
  });
  const youth = data.user.role === "neet" ? own : undefined;
  const matches = youth ? matchOffers(youth, data.offers, data.referrals) : [];
  const opportunities = data.offers.map((o) => ({
    id: o.id,
    title: o.data.title,
    organization: o.data.organization,
    type: o.data.type,
    location: o.data.commune,
    duration: "À préciser avec l’organisme",
    match: matches.find((m) => m.offer.id === o.id)?.score ?? 0,
    image: pictures[o.data.type as keyof typeof pictures] || pictures.Formation,
    description: o.data.description,
    skills: o.data.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    deadline: displayDate(o.data.deadline),
    details: o.data.description,
  }));
  const fieldActions = data.activities.map((a) => ({
    id: a.id,
    title: a.data.title,
    category: a.data.category,
    date: displayDate(a.data.date),
    time: "Horaire à confirmer",
    city: a.data.commune,
    duration: "À confirmer",
    description: a.data.category,
    icon: "users",
    image: "/editorial/action-cv.webp",
  }));
  const appointmentFixtures: AppointmentView[] = data.appointments.map((a) => ({
    id: a.id,
    youthId: a.youth_id,
    name: data.people.find((p) => p.id === a.youth_id)?.data.name || "",
    type: a.title,
    date: casablancaDay(a.starts_at),
    time: new Date(a.starts_at).toLocaleTimeString("fr-MA", {
      timeZone: "Africa/Casablanca",
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: a.location,
    done: !!(a as unknown as { completed: boolean }).completed,
  }));
  return {
    profile,
    profileFixtures: {
      neet: profile,
      mediator: profile,
      admin: profile,
      partner: profile,
    },
    youngPeople,
    opportunities,
    fieldActions,
    appointmentFixtures,
    stories: data.stories.map((s) => ({ ...s.data, id: s.id })),
  };
}
export function workspaceState(data: WorkspaceData): Record<string, unknown> {
  const d = workspaceDatasets(data),
    state: Record<string, unknown> = {};
  for (const role of ["admin", "mediator", "partner", "neet"])
    state[`${role}.profile`] = d.profile;
  state["neet.saved"] = data.preferences.saved;
  state["neet.applications"] = data.preferences.applications;
  state["neet.completed"] = data.preferences.completed;
  state["neet.enrolled"] = data.preferences.enrolled;
  state["mediator.appointments"] = d.appointmentFixtures;
  for (const p of data.people)
    state[`mediator.notes.${p.id}`] = data.notes
      .filter((n) => n.youth_id === p.id)
      .map((n) => ({ id: n.id, text: n.body, action: n.next_action }));
  state["mediator.referrals"] = data.drafts.map((r) => ({
    offer: r.offer_id,
    person: r.youth_id,
  }));
  const attendees: Record<string, string[]> = {};
  for (const p of data.participations)
    if (p.attended) (attendees[p.activity_id] ||= []).push(p.youth_id);
  state["mediator.attendees"] = attendees;
  const conversations: Record<
    string,
    { id: string; senderId: string; text: string; time: string }[]
  > = {};
  for (const m of [...data.messages].reverse()) {
    const peer = m.sender_id === data.user.id ? m.recipient_id : m.sender_id;
    (conversations[peer] ||= []).push({
      id: m.id,
      senderId: m.sender_id,
      text: m.body,
      time: new Date(m.created_at).toLocaleTimeString("fr-MA", {
        timeZone: "Africa/Casablanca",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }
  state[`messages.${data.user.role}`] = conversations;
  state["partner.referrals"] = data.referrals.map((r) => ({
    id: r.id,
    name: data.people.find((p) => p.id === r.youth_id)?.data.name || "",
    age: null,
    commune: data.people.find((p) => p.id === r.youth_id)?.data.commune || "",
    program: data.offers.find((o) => o.id === r.offer_id)?.data.title || "",
    match: r.score,
    status:
      r.status === "accepted"
        ? "Accepted"
        : r.status === "rejected"
          ? "Rejected"
          : (r as unknown as { partner_stage: string }).partner_stage || "New",
    priority: "Medium",
    notes: (r as unknown as { partner_note: string }).partner_note || "",
  }));
  state["partner.opportunities"] = data.offers.map((o) => ({
    id: o.id,
    title: o.data.title,
    type: o.data.type,
    commune: o.data.commune,
    capacity: o.data.capacity,
    filled: data.referrals.filter(
      (r) => r.offer_id === o.id && r.status === "accepted",
    ).length,
    deadline: o.data.deadline,
    status: o.active ? "Open" : "Draft",
  }));
  state["partner.activity"] = data.activityLog.map((a) => ({
    id: String(a.id),
    text: String(a.action),
    time: displayDate(String(a.created_at)),
    color: "#00B8A9",
  }));
  return state;
}
export type OpportunityView = ReturnType<
  typeof workspaceDatasets
>["opportunities"][number];
export type FieldActionView = ReturnType<
  typeof workspaceDatasets
>["fieldActions"][number];
