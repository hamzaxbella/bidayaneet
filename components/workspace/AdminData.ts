"use client";
import { useWorkspace } from "./LiveProvider";
import { workspaceDatasets } from "@/lib/workspace-data";
import { journeyState } from "@/lib/journey";
import { aggregateCoverage } from "@/lib/geo";
const palette = [
  "#00B8A9",
  "#2E86C1",
  "#8E44AD",
  "#F5A623",
  "#27AE60",
  "#E74C3C",
];
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const date = (s: string) =>
  new Date(s).toLocaleDateString("fr-MA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Casablanca",
  });
export function useAdminData() {
  const { data } = useWorkspace(),
    datasets = workspaceDatasets(data),
    events = data.journeys || [];
  const states = data.people.map((p) => ({
    p,
    s: journeyState(events.filter((e) => e.youth_id === p.id)),
  }));
  const n = data.people.length,
    activated = states.filter((v) => v.s.activation).length,
    integrated = states.filter((v) => v.s.insertion).length,
    stabilized = states.filter((v) => v.s.stabilized).length,
    validated = data.people.filter((p) => p.status === "validated").length;
  const metrics = {
    identified: n,
    activated,
    integrated,
    stabilized,
    validated,
    mediators: data.staff.filter((s) => s.role === "mediator").length,
    offers: data.offers.length,
    activities: data.activities.length,
    referrals: data.referrals.length,
    accepted: data.referrals.filter((r) => r.status === "accepted").length,
    pending: data.people.filter((p) => p.status === "pending").length,
  };
  const trendData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - 5 + i);
    const key = d.toISOString().slice(0, 7);
    return {
      month: d.toLocaleDateString("fr-MA", {
        month: "short",
        year: "2-digit",
        timeZone: "UTC",
      }),
      detected: data.people.filter((p) => p.created_at.startsWith(key)).length,
      activated: events.filter(
        (e) => e.step === "activation" && e.created_at.startsWith(key),
      ).length,
      integrated: events.filter(
        (e) => e.step === "insertion" && e.created_at.startsWith(key),
      ).length,
      stabilized: events.filter(
        (e) =>
          e.step === "stabilisation" &&
          e.created_at.startsWith(key) &&
          e.data.status === "continuing",
      ).length,
    };
  });
  const journeyData = trendData,
    spark1 = trendData.map((d) => ({ v: d.detected })),
    spark2 = trendData.map((d) => ({ v: d.activated })),
    spark3 = trendData.map((d) => ({ v: d.integrated })),
    spark4 = trendData.map((d) => ({ v: d.stabilized }));
  const funnelData = [
    ["Identification", n],
    ["Activation", activated],
    ["Classification", validated],
    ["Integration", integrated],
    ["Stabilisation", stabilized],
  ].map(([stage, count], i) => ({
    stage: String(stage),
    count: Number(count),
    pct: pct(Number(count), n) + "%",
    color: palette[i],
  }));
  const pipelineData = funnelData.map((f) => ({ ...f, pct: pct(f.count, n) }));
  const neetDirectory = data.people.map((p) => {
    const person = datasets.youngPeople.find((y) => y.id === p.id)!;
    return {
      id: p.id,
      name: p.data.name,
      avatar: p.data.name
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join(""),
      commune: p.data.commune,
      status: person.stage,
      trust: "Non renseignée",
      blocker: person.blocker,
      mediator: String(
        data.staff.find((u) => u.id === p.mediator_id)?.name || "Médiateur",
      ),
      action: person.next,
      date: date(p.updated_at),
      progress: person.progress,
    };
  });
  const recentNEETs = neetDirectory.slice(0, 8);
  const mediators = data.staff
    .filter((u) => u.role === "mediator")
    .map((u) => ({
      id: String(u.id),
      name: String(u.name),
      avatar: String(u.name)
        .split(" ")
        .map((s) => s[0])
        .slice(0, 2)
        .join(""),
      zone: "Souss-Massa",
      assoc: String(u.organization),
      active: data.people.filter((p) => p.mediator_id === u.id).length,
      visits: data.people.filter(
        (p) => p.mediator_id === u.id && p.data.location,
      ).length,
      lastActive: "Diagnostics enregistrés",
      status: u.active ? "active" : "inactive",
    }));
  const mediatorDonut = [
    {
      name: "Active",
      value: mediators.filter((m) => m.status === "active").length,
    },
    {
      name: "Inactive",
      value: mediators.filter((m) => m.status === "inactive").length,
    },
  ];
  const topPerformers = mediators.map((m) => ({
    name: m.name,
    avatar: m.avatar,
    visits: m.visits,
    neets: m.active,
    neetsHelped: m.active,
    score: m.active,
    zone: m.zone,
    color: "#00B8A9",
  }));
  const activityData = trendData.map((t) => ({
    month: t.month,
    visits: t.detected,
    neetsAdded: t.detected,
  }));
  const blockerRows = [
    [
      "Mobilité locale",
      data.people.filter((p) => p.data.mobility === "local").length,
    ],
    ["Garde d’enfants", data.people.filter((p) => p.data.childcare).length],
    [
      "Temps partiel",
      data.people.filter((p) => p.data.availability === "part-time").length,
    ],
  ];
  const blockers = blockerRows.map(([name, count], i) => ({
      name: String(name),
      count: Number(count),
      pct: pct(Number(count), n),
      color: palette[i],
      value: Number(count),
      icon: "📌",
      desc: "Contraintes déclarées dans les diagnostics",
      change: 0,
    })),
    commonBlockers = blockers;
  const recentActivity = data.notes.slice(0, 8).map((note) => ({
    neet: data.people.find((p) => p.id === note.youth_id)?.data.name || "",
    action: String(note.next_action),
    by: String(
      data.staff.find((s) => s.id === note.actor_id)?.name || "Médiateur",
    ),
    date: date(String(note.created_at)),
    time: "",
    icon: "📝",
  }));
  const opportunities = data.offers.map((o, i) => ({
    id: o.id,
    title: o.data.title,
    type: o.data.type,
    program: o.data.organization,
    commune: o.data.commune,
    deadline: date(o.data.deadline),
    matches: data.referrals.filter((r) => r.offer_id === o.id).length,
    status: o.active ? "active" : "inactive",
    color: palette[i % palette.length],
  }));
  const byType = [...new Set(opportunities.map((o) => o.type))].map((type) => ({
    type,
    count: opportunities.filter((o) => o.type === type).length,
  }));
  const recentMatches = data.referrals.slice(0, 8).map((r) => ({
    neet: data.people.find((p) => p.id === r.youth_id)?.data.name || "",
    opp: data.offers.find((o) => o.id === r.offer_id)?.data.title || "",
    match: r.score,
    date: date(r.created_at),
  }));
  const actions = data.activities.map((a, i) => ({
    id: a.id,
    title: a.data.title,
    type: a.data.category,
    commune: a.data.commune,
    organizer: "Médiation locale",
    date: date(a.data.date),
    capacity: a.data.capacity,
    enrolled: data.participations.filter(
      (p) => p.activity_id === a.id && p.attended,
    ).length,
    color: palette[i % palette.length],
    icon: "📄",
  }));
  const impactData = actions.map((a) => ({
    name: a.title,
    action: a.type,
    engagement: a.enrolled,
    count: a.enrolled,
    value: a.enrolled,
  }));
  const programs = data.programs.map((p, i) => {
    const d = p.data as Record<string, unknown>;
    return {
      id: String(p.id),
      name: String(d.title || ""),
      desc: String(d.description || ""),
      enrolled: data.memberships.filter(
        (m) => m.program_id === p.id && m.status === "active",
      ).length,
      capacity: Number(d.capacity || 0),
      completed: data.memberships.filter(
        (m) => m.program_id === p.id && m.status === "completed",
      ).length,
      dropout: data.memberships.filter(
        (m) => m.program_id === p.id && m.status === "interrupted",
      ).length,
      color: palette[i % palette.length],
      status: p.published ? "active" : "inactive",
      opportunities:data.offers.filter(o=>o.data.programId===p.id).length,
    };
  });
  const totalPrograms = programs.length,
    activePrograms = programs.filter((p) => p.status === "active").length,
    totalEnrolled = data.memberships.length,
    totalCompleted = programs.reduce((n, p) => n + p.completed, 0),
    completionRate = pct(totalCompleted, totalEnrolled),
    enrollmentTrend = trendData.map((t, i) => {
      const date = new Date();
      date.setUTCDate(1);
      date.setUTCMonth(date.getUTCMonth() - 5 + i);
      const key = date.toISOString().slice(0, 7);
      return {
        month: t.month,
        enrolled: data.memberships.filter((m) =>
          String(m.created_at).startsWith(key),
        ).length,
        completed: data.memberships.filter(
          (m) =>
            m.status === "completed" && String(m.updated_at).startsWith(key),
        ).length,
      };
    });
  const retentionRates = [30, 60, 90].map((days, i) => {
    const now = new Date().toISOString().slice(0, 10),
      eligible = states.filter(
        ({ s }) =>
          s.insertion &&
          new Date(new Date(s.insertion.data.date).getTime() + days * 86400000)
            .toISOString()
            .slice(0, 10) <= now,
      );
    const maintained = eligible.filter(
      ({ s }) =>
        s.check?.data.status === "continuing" &&
        s.check.data.date >=
          new Date(new Date(s.insertion!.data.date).getTime() + days * 86400000)
            .toISOString()
            .slice(0, 10),
    ).length;
    return {
      label: days + " jours",
      pct: pct(maintained, eligible.length),
      change: 0,
      color: palette[i],
      cohort: eligible.length,
    };
  });
  const allAlerts = data.followups
    .filter(
      (f) =>
        f.outcome === "planned" &&
        f.due_date < new Date().toISOString().slice(0, 10),
    )
    .map((f, i) => ({
      id: f.id,
      severity: "warning",
      title: "Suivi en retard",
      desc:
        (data.people.find((p) => p.id === f.youth_id)?.data.name || "Dossier") +
        " · " +
        f.note,
      time: date(f.due_date),
      neets: 1,
      action: "Ouvrir le dossier",
      read: data.alertReads.includes(f.id),
      youthId: f.youth_id,
    }));
  const savedReports = data.reports.map((r) => ({
    id: String(r.id),
    name: String(r.name),
    date: date(String(r.created_at)),
    type: "CSV",
    size: "Synthèse régionale",
  }));
  const communes = aggregateCoverage(data.people,data.programs),
    soussMassaHeatPoints = communes;
  const provinceTotals = communes.reduce<
    Record<string, { neets: number; mediators: number; programs: number }>
  >((a, c) => {
    const row = (a[c.province] ||= { neets: 0, mediators: 0, programs: 0 });
    row.neets += c.neets;
    row.mediators += c.mediators;
      row.programs+=c.programs;
    return a;
  }, {});
  return {
    data,
    retentionRates,
    metrics,
    journeyData,
    trendData,
    spark1,
    spark2,
    spark3,
    spark4,
    funnelData,
    pipelineData,
    neetDirectory,
    recentNEETs,
    mediators,
    mediatorDonut,
    topPerformers,
    activityData,
    blockers,
    commonBlockers,
    recentActivity,
    opportunities,
    byType,
    recentMatches,
    actions,
    impactData,
    programs,
    totalPrograms,
    activePrograms,
    totalEnrolled,
    totalCompleted,
    completionRate,
    enrollmentTrend,
    allAlerts,
    savedReports,
    communes,
    soussMassaHeatPoints,
    provinceTotals,
    localOpportunities: opportunities.slice(0, 5).map((o) => ({
      ...o,
      org: o.program,
      tag: o.type,
      match: "À évaluer",
      matchColor: o.color,
    })),
  };
}
