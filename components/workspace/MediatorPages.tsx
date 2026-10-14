"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import BusinessAction from "./BusinessAction";
import JourneyPanel from "@/components/platform/JourneyPanel";
import { useWorkspace, useWorkspaceDatasets } from "./LiveProvider";
import type {
  AppointmentView,
  OpportunityView,
  FieldActionView,
} from "@/lib/workspace-data";

import { useState,useRef, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Download,
  MapPin,
  Plus,
  Search,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { downloadCsv } from "@/lib/export-csv";
import { useWorkspaceState as useSimulatedState } from "./LiveProvider";
import { EmptyState, Metric, PageIntro, Panel, Tag } from "./UI";

export { default as MediatorDashboard } from "./MediatorOverview";

export function CaseloadPage() {
  const { text: uiText } = useUiTranslation();

  const { youngPeople } = useWorkspaceDatasets();

  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("Tous les parcours");
  const [priority, setPriority] = useState("Tous les suivis");
  const filtered = youngPeople.filter(
    (person) =>
      `${person.name} ${person.city} ${person.goal}`
        .toLocaleLowerCase("fr")
        .includes(query.toLocaleLowerCase("fr")) &&
      (stage === "Tous les parcours" || person.stage === stage) &&
      (priority === "Tous les suivis" || person.priority === priority),
  );
  return (
    <>
      <PageIntro
        eyebrow={uiText("DES PERSONNES, DES POSSIBILITÉS")}
        title={uiText("Mes jeunes accompagnés")}
        description={uiText(
          "Garde le lien avec chaque jeune et prépare la prochaine étape de son parcours.",
        )}
        action={
          <button
            className="button button-secondary"
            onClick={() =>
              downloadCsv("bidayaneet-jeunes-demo.csv", [
                ["Nom", "Ville", "Étape", "Priorité", "Prochaine action"],
                ...filtered.map((person) => [
                  person.name,
                  person.city,
                  person.stage,
                  person.priority,
                  person.next,
                ]),
              ])
            }
          >
            <Download size={15} />
            <Translated value="Exporter la sélection" />
          </button>
        }
      />
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label={uiText("Rechercher un jeune")}
            placeholder={uiText("Un nom, une ville, un projet…")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          aria-label={uiText("Étape du parcours")}
          value={stage}
          onChange={(event) => setStage(event.target.value)}
        >
          {[
            "Tous les parcours",
            "Identifié",
            "Activé",
            "Orientation",
            "Intégré",
          ].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
        <select
          aria-label={uiText("Priorité du suivi")}
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          {["Tous les suivis", "Prioritaire", "Suivi régulier"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <p className="results-count">
        {filtered.length}
        <Translated value="jeune" />
        {filtered.length > 1 ? "s" : ""}
        <Translated value="dans cette sélection" />
      </p>
      {filtered.length ? (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                {[
                  "Jeune",
                  "Parcours",
                  "Avancement",
                  "Suivi",
                  "Prochaine action",
                  "Dossier",
                ].map((title) => (
                  <th scope="col" key={title}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((person) => (
                <tr key={person.id}>
                  <td>
                    <Link
                      className="table-person"
                      href={`/mediator/caseload/${person.id}`}
                    >
                      <Image
                        src={person.photo}
                        alt={uiText("")}
                        width={38}
                        height={38}
                      />
                      <span>
                        <b>{person.name}</b>
                        <small>
                          {person.age}
                          <Translated value="ans ·" />
                          {person.city}
                        </small>
                      </span>
                    </Link>
                  </td>
                  <td>
                    <Tag
                      tone={
                        person.stage === "Intégré"
                          ? "teal"
                          : person.stage === "Identifié"
                            ? "muted"
                            : "blue"
                      }
                    >
                      {person.stage}
                    </Tag>
                  </td>
                  <td>
                    <div className="table-progress">
                      <progress value={person.progress} max={100} />
                      <span>
                        {person.progress}
                        <Translated value="% du profil" />
                      </span>
                    </div>
                  </td>
                  <td>
                    <Tag
                      tone={
                        person.priority === "Prioritaire" ? "orange" : "muted"
                      }
                    >
                      {person.priority}
                    </Tag>
                  </td>
                  <td>
                    <span style={{ fontSize: 11 }}>{person.next}</span>
                    <small
                      style={{
                        display: "block",
                        fontSize: 10,
                        color: "var(--muted)",
                        marginTop: 4,
                      }}
                    >
                      {person.date}
                    </small>
                  </td>
                  <td>
                    <Link
                      className="text-link"
                      href={`/mediator/caseload/${person.id}`}
                    >
                      <Translated value="Ouvrir" />
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title={uiText("Aucun dossier dans cette sélection")}
          description={uiText(
            "Modifie tes filtres ou recherche une autre ville.",
          )}
        />
      )}
    </>
  );
}

export function CaseloadDetail({ id }: { id: string }) {
  const { text: uiText } = useUiTranslation();

  const { data, command } = useWorkspace();
  const original = data.people.find((p) => p.id === id)!;
  const { opportunities, youngPeople } = useWorkspaceDatasets();

  const person = youngPeople.find((item) => item.id === id)!;
  const [notes] = useSimulatedState<
    { text: string; action: string }[]
  >(`mediator.notes.${id}`, []);
  const [note, setNote] = useState("");
  const [action, setAction] = useState("Appel de suivi");
  const noteId=useRef<string|undefined>(undefined);
  async function save(event:FormEvent){event.preventDefault();if(!note.trim())return;const value=note.trim();noteId.current??=crypto.randomUUID();if(await command({action:'case-note',payload:{id:noteId.current,youthId:id,body:value,nextAction:action}})){setNote('');noteId.current=undefined;}}

  return (
    <>
      <Link href="/mediator/caseload" className="back-link">
        <ArrowLeft size={15} />
        <Translated value="Mes jeunes accompagnés" />
      </Link>
      <div className="page-intro">
        <div className="caseload-detail-header">
          <Image src={person.photo} alt={uiText("")} width={75} height={75} />
          <div>
            <h1>{person.name}</h1>
            <p>
              {person.age}
              <Translated value="ans ·" />
              {person.city}
              <Translated value="· Dossier" />
              {person.id}
            </p>
            <Tag>{person.stage}</Tag>
            {person.priority === "Prioritaire" && (
              <span style={{ marginLeft: 7 }}>
                <Tag tone="orange">
                  <Translated value="Suivi prioritaire" />
                </Tag>
              </span>
            )}
          </div>
        </div>
        <Link href="/mediator/appointments" className="button button-primary">
          <CalendarDays size={15} />
          <Translated value="Préparer un rendez-vous" />
        </Link>
      </div>
      <div className="nominal-panel" style={{ marginBottom: 24 }}>
        <JourneyPanel
          youth={original}
          data={data}
          editable={original.status === "validated"}
          mutate={(action, payload) => command({ action, payload })}
        />
        <div style={{ marginTop: 16 }}>
          <BusinessAction kind="referral" id={id}>
            <Translated value="Transmettre une orientation" />
          </BusinessAction>
        </div>
      </div>
      <div className="two-column">
        <div className="stack">
          <Panel title={uiText("Ce qui compte pour ce parcours")}>
            <dl className="definition-grid">
              <div>
                <dt>
                  <Translated value="Projet" />
                </dt>
                <dd>{person.goal}</dd>
              </div>
              <div>
                <dt>
                  <Translated value="Compétences" />
                </dt>
                <dd>{person.skills}</dd>
              </div>
              <div>
                <dt>
                  <Translated value="Confiance" />
                </dt>
                <dd>{person.trust}</dd>
              </div>
              <div>
                <dt>
                  <Translated value="Frein à accompagner" />
                </dt>
                <dd>{person.blocker}</dd>
              </div>
            </dl>
            <div className="progress-caption">
              <span>
                <Translated value="Profil complété" />
              </span>
              <span>{person.progress}%</span>
            </div>
            <progress value={person.progress} max={100} />
          </Panel>
          <Panel
            title={uiText("Ajouter une note de suivi")}
            note={uiText(
              "Une trace claire pour préparer la prochaine rencontre.",
            )}
          >
            <form onSubmit={save}>
              <label className="form-field">
                <Translated value="Note" />
                <textarea
                  className="field-input"
                  rows={4}
                  value={note}
                  onChange={(event) => { noteId.current=undefined; setNote(event.target.value); }}
                  placeholder={uiText(
                    "Ce qui a été discuté, les besoins et les prochaines étapes…",
                  )}
                  required
                  maxLength={3000}
                />
              </label>
              <label className="form-field" style={{ marginTop: 18 }}>
                <Translated value="Prochaine action" />
                <select
                  className="field-input"
                  value={action}
                  onChange={(event) => setAction(event.target.value)}
                >
                  {[
                    "Appel de suivi",
                    "Entretien d’orientation",
                    "Atelier CV",
                    "Visite de proximité",
                    "Orientation vers une offre",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="button button-primary"
                style={{ marginTop: 20 }}
              >
                <Translated value="Enregistrer la note" />
                <Check size={15} />
              </button>
              <p className="form-note">
                <Translated value="La note est enregistrée dans le dossier et accessible aux professionnels autorisés." />
              </p>
            </form>
          </Panel>
        </div>
        <div className="stack">
          <Panel title={uiText("Prochaine rencontre")}>
            <Tag tone="blue">{person.date}</Tag>
            <h3 style={{ fontSize: 16, margin: "14px 0 8px", fontWeight: 500 }}>
              {person.next}
            </h3>
            <p className="detail-text">
              <Translated value="Préparer le point sur :" />
              {person.blocker.toLowerCase()}.
            </p>
            <Link
              href="/mediator/opportunities"
              className="text-link"
              style={{ marginTop: 20 }}
            >
              <Translated value="Explorer les orientations" />
              <ArrowRight size={15} />
            </Link>
          </Panel>
          <Panel title={uiText('Suivis programmés')}>{data.followups.filter(f=>f.youth_id===id).map(f=><div key={f.id} style={{padding:'12px 0',borderBottom:'1px solid #E8ECF0'}}><Tag>{f.outcome}</Tag><p>{f.due_date.slice(0,10)} · {f.note}</p>{f.outcome==='planned'&&<BusinessAction kind="followup-result" id={f.id}>Enregistrer le constat</BusinessAction>}</div>)}</Panel>
          <Panel title={uiText("Historique du suivi")}>
            <div className="timeline">
              {notes.map((item, index) => (
                <div className="timeline-item done" key={index}>
                  <div className="timeline-marker">
                    <Check size={13} />
                  </div>
                  <div>
                    <h3>{item.action}</h3>
                    <p>{item.text}</p>
                    <small>
                      <Translated value="Note enregistrée dans le dossier" />
                    </small>
                  </div>
                </div>
              ))}
              {!notes.length && (
                <p>
                  <Translated value="Aucune note de suivi enregistrée." />
                </p>
              )}
            </div>
            {notes.length > 0 && (
              <p className="form-note" role="status">
                <Translated value="Note enregistrée au dossier." />
              </p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

type Appointment = AppointmentView;

export function AppointmentsPage() {
  const { data } = useWorkspace();
  const { text: uiText } = useUiTranslation();

  const { appointmentFixtures } = useWorkspaceDatasets();
  const { youngPeople } = useWorkspaceDatasets();

  const [appointments, setAppointments] = useSimulatedState(
    "mediator.appointments",
    appointmentFixtures,
  );
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("À venir");
  const [status, setStatus] = useState("");
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      name:
        youngPeople.find((p) => p.id === String(data.get("name")))?.name || "",
      youthId: String(data.get("name")),
      type: String(data.get("type")),
      date: String(data.get("date")),
      time: String(data.get("time")),
      location: String(data.get("location")),
      done: false,
    };
    setAppointments((current) => [...current, appointment]);
    setShowForm(false);
    setStatus("Demande d’enregistrement du rendez-vous envoyée.");
  }
  const filtered = appointments
    .filter(
      (item) =>
        filter === "Tout l’agenda" ||
        (filter === "Terminés" ? item.done : !item.done),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <>
      <PageIntro
        eyebrow={uiText("FAIRE DE LA PLACE AUX RENCONTRES")}
        title={uiText("Mon agenda")}
        description={uiText(
          "Prépare tes entretiens, tes appels et tes visites de terrain.",
        )}
        action={
          <button
            className="button button-primary"
            aria-expanded={showForm}
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} />
            {showForm ? "Fermer le formulaire" : "Ajouter un rendez-vous"}
          </button>
        }
      />
      {showForm && (
        <Panel
          title={uiText("Un nouveau rendez-vous")}
          className="appointment-form"
        >
          <form onSubmit={add}>
            <div className="form-grid">
              <label className="form-field">
                <Translated value="Jeune accompagné" />
                <select name="name" className="field-input">
                  {youngPeople.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <Translated value="Type de rencontre" />
                <select name="type" className="field-input">
                  {[
                    "Entretien d’orientation",
                    "Appel de suivi",
                    "Préparation d’entretien",
                    "Visite de proximité",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <Translated value="Date" />
                <input
                  type="date"
                  name="date"
                  className="field-input"
                  required
                  defaultValue={new Intl.DateTimeFormat("en-CA", {timeZone:"Africa/Casablanca",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(data.now))}
                />
              </label>
              <label className="form-field">
                <Translated value="Heure" />
                <input
                  type="time"
                  name="time"
                  className="field-input"
                  required
                  defaultValue="10:00"
                />
              </label>
              <label className="form-field wide">
                <Translated value="Lieu" />
                <input
                  name="location"
                  className="field-input"
                  required
                  placeholder={uiText("Bureau, appel ou adresse de visite…")}
                  maxLength={200}
                />
              </label>
            </div>
            <div className="form-actions">
              <button className="button button-primary">
                <Translated value="Ajouter à l’agenda" />
                <Check size={15} />
              </button>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowForm(false)}
              >
                <Translated value="Annuler" />
              </button>
            </div>
          </form>
        </Panel>
      )}
      {status && (
        <div className="inline-alert" role="status">
          {status}
        </div>
      )}
      <div
        className="filter-tabs"
        style={{ margin: "22px 0" }}
        role="group"
        aria-label={uiText("Filtrer les rendez-vous")}
      >
        {["À venir", "Terminés", "Tout l’agenda"].map((value) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={filter === value ? "active" : ""}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="appointment-list">
        {filtered.map((appointment) => {
          const date = new Date(`${appointment.date}T12:00:00Z`);
          return (
            <article className="appointment-card" key={appointment.id}>
              <div className="date-tile">
                <span>
                  {new Intl.DateTimeFormat("fr", {
                    month: "short",
                    timeZone: "UTC",
                  })
                    .format(date)
                    .toUpperCase()}
                </span>
                <strong>{date.getUTCDate()}</strong>
                <span>
                  {new Intl.DateTimeFormat("fr", {
                    weekday: "short",
                    timeZone: "UTC",
                  })
                    .format(date)
                    .toUpperCase()}
                </span>
              </div>
              <div>
                <Tag tone={appointment.done ? "muted" : "blue"}>
                  {appointment.done ? "Terminé" : appointment.time}
                </Tag>
                <h3>{appointment.type}</h3>
                <p>{appointment.name}</p>
                <p>
                  <MapPin
                    size={12}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />{" "}
                  {appointment.location}
                </p>
              </div>
              <button
                className="button button-secondary button-small"
                onClick={() => {
                  setAppointments((current) =>
                    current.map((item) =>
                      item.id === appointment.id
                        ? { ...item, done: !item.done }
                        : item,
                    ),
                  );
                  setStatus("Demande de mise à jour envoyée.");
                }}
              >
                {appointment.done ? "Remettre à venir" : "Marquer terminé"}
                <Check size={14} />
              </button>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <EmptyState
          title={uiText("Un agenda qui respire")}
          description={uiText(
            "Aucun rendez-vous dans cette sélection. Tu peux en ajouter un pour préparer la prochaine rencontre.",
          )}
        />
      )}
      <p className="form-note">
        <Translated value="Les rendez-vous sont conservés dans la base et visibles dans le parcours du jeune." />
      </p>
    </>
  );
}

export function MediatorOpportunitiesPage() {
  const { text: uiText } = useUiTranslation();

  const { opportunities, youngPeople } = useWorkspaceDatasets();

  const [query, setQuery] = useState("");
  const [referrals, setReferrals] = useSimulatedState<
    { offer: string; person: string }[]
  >("mediator.referrals", []);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const filtered = opportunities.filter((item) =>
    `${item.title} ${item.location}`
      .toLocaleLowerCase("fr")
      .includes(query.toLocaleLowerCase("fr")),
  );
  return (
    <>
      <PageIntro
        eyebrow={uiText("FAIRE LE LIEN AVEC LES POSSIBILITÉS")}
        title={uiText("Opportunités & orientations")}
        description={uiText(
          "Repère une offre pertinente et prépare une orientation avec le jeune.",
        )}
      />
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label={uiText("Rechercher une offre")}
            placeholder={uiText("Une formation, un métier, une ville…")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Tag tone="muted">
          {referrals.length}
          <Translated value="orientation" />
          {referrals.length > 1 ? "s" : ""} <Translated value="préparée" />
          {referrals.length > 1 ? "s" : ""}
        </Tag>
      </div>
      <div className="action-grid">
        {filtered.map((offer) => (
          <Panel key={offer.id} className="action-card">
            <div className="action-card-top">
              <Tag>{offer.type}</Tag>
              <span className="org-label">{offer.organization}</span>
            </div>
            <h3>{offer.title}</h3>
            <p>{offer.description}</p>
            <div className="card-meta">
              <span>
                <MapPin size={13} />
                {offer.location}
              </span>
              <span>
                <Clock3 size={13} />
                {offer.duration}
              </span>
            </div>
            <label className="form-field">
              <Translated value="Orienter un jeune" />
              <select
                className="field-input"
                value={selections[offer.id] ?? (youngPeople[0]?.id || "")}
                onChange={(event) =>
                  setSelections((current) => ({
                    ...current,
                    [offer.id]: event.target.value,
                  }))
                }
              >
                {youngPeople.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="button button-secondary"
              style={{ width: "100%", marginTop: 15 }}
              disabled={referrals.some(
                (item) =>
                  item.offer === offer.id &&
                  item.person ===
                    (selections[offer.id] ?? (youngPeople[0]?.id || "")),
              )}
              onClick={() =>
                setReferrals((current) => [
                  ...current,
                  {
                    offer: offer.id,
                    person: selections[offer.id] ?? (youngPeople[0]?.id || ""),
                  },
                ])
              }
            >
              <Translated value="Préparer l’orientation" />
              <ArrowRight size={14} />
            </button>
            {referrals
              .filter((item) => item.offer === offer.id)
              .map((item) => (
                <div key={item.person} className="inline-alert" role="status">
                  {item.person}
                  <Translated value="· orientation préparée." />
                </div>
              ))}
          </Panel>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title={uiText("Aucune offre correspondante")}
          description={uiText("Essaie une recherche plus large.")}
        />
      )}
      <p className="form-note">
        <Translated value="Les sélections préparent une orientation. La transmission se fait depuis le dossier, après validation et accord du jeune." />
      </p>
    </>
  );
}

export function MediatorActionsPage() {
  const { text: uiText } = useUiTranslation();

  const { fieldActions, youngPeople } = useWorkspaceDatasets();

  const [attendees, setAttendees] = useSimulatedState<Record<string, string[]>>(
    "mediator.attendees",
    {},
  );
  const [selected, setSelected] = useState<Record<string, string>>({});
  return (
    <>
      <PageIntro
        eyebrow={uiText("LE TERRAIN CRÉE LE LIEN")}
        title={uiText("Actions de terrain")}
        description={uiText(
          "Prépare les ateliers et aide les jeunes à franchir un premier pas concret.",
        )}
      />
      <div className="field-itinerary">
        {fieldActions.map((action) => (
          <Panel className="field-action-row" key={action.id}>
            <div className="field-action-image">
              <Image
                src={action.image}
                alt={uiText("")}
                fill
                sizes="(max-width: 760px) 90vw, 180px"
              />
              <span>{String(action.id).padStart(2, "0")}</span>
            </div>
            <div className="field-action-body">
              <div className="action-card-top">
                <div className="action-icon">
                  <Zap size={20} />
                </div>
                <Tag tone="orange">{action.category}</Tag>
              </div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <div className="card-meta">
                <span>
                  <CalendarDays size={13} />
                  {action.date}
                </span>
                <span>
                  <MapPin size={13} />
                  {action.city}
                </span>
              </div>
              <label className="form-field">
                <Translated value="Ajouter un participant" />
                <select
                  className="field-input"
                  value={selected[action.id] ?? (youngPeople[0]?.id || "")}
                  onChange={(event) =>
                    setSelected((current) => ({
                      ...current,
                      [action.id]: event.target.value,
                    }))
                  }
                >
                  {youngPeople.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="button button-secondary"
                style={{ marginTop: 15 }}
                disabled={(attendees[action.id] ?? []).includes(
                  selected[action.id] ?? (youngPeople[0]?.id || ""),
                )}
                onClick={() => {
                  const person =
                    selected[action.id] ?? (youngPeople[0]?.id || "");
                  setAttendees((current) => ({
                    ...current,
                    [action.id]: [...(current[action.id] ?? []), person],
                  }));
                }}
              >
                <Plus size={14} />
                <Translated value="Confirmer la participation" />
              </button>
              {(attendees[action.id] ?? []).length > 0 && (
                <div className="skill-list">
                  {attendees[action.id].map((name) => (
                    <button
                      key={youngPeople.find((p) => p.id === name)?.name || name}
                      className="tag tag-teal"
                      aria-label={`Retirer ${name} de ${action.title}`}
                      style={{ border: 0, cursor: "pointer" }}
                      onClick={() =>
                        setAttendees((current) => ({
                          ...current,
                          [action.id]: current[action.id].filter(
                            (item) => item !== name,
                          ),
                        }))
                      }
                    >
                      {name}
                      <Translated value="×" />
                    </button>
                  ))}
                </div>
              )}
              <p className="form-note">
                {(attendees[action.id] ?? []).length}
                <Translated value="participant" />
                {(attendees[action.id] ?? []).length > 1 ? "s" : ""}
                <Translated value="sélectionné" />
                {(attendees[action.id] ?? []).length > 1 ? "s" : ""}
                <Translated value="· Cliquez sur un nom pour le retirer." />
              </p>
            </div>
          </Panel>
        ))}
      </div>
      <p className="form-note">
        <Translated value="Les présences sont enregistrées dans les dossiers." />
      </p>
    </>
  );
}

export function MediatorReportsPage() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace();
  const activityRows = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCMonth(d.getUTCMonth() - 5 + i);
    const key = d.toISOString().slice(0, 7);
    return [
      key,
      data.appointments.filter((a) => a.starts_at.startsWith(key)).length,
      data.participations.filter(
        (p) =>
          p.attended &&
          data.activities.some(
            (a) => a.id === p.activity_id && a.data.date.startsWith(key),
          ),
      ).length,
      data.referrals.filter((r) => r.created_at.startsWith(key)).length,
    ] as const;
  });
  const [period, setPeriod] = useState(() =>
    new Date().toISOString().slice(0, 7),
  );
  const row = activityRows.find((item) => item[0] === period)!;
  return (
    <>
      <PageIntro
        eyebrow={uiText("VOIR L’EFFET DE CHAQUE ACTION")}
        title={uiText("Mon activité")}
        description={uiText(
          "Une vue claire de tes rencontres, de tes actions et des parcours qui avancent.",
        )}
        action={
          <button
            className="button button-secondary"
            onClick={() =>
              downloadCsv("bidayaneet-activite-demo.csv", [
                ["Mois", "Rencontres", "Actions de terrain", "Orientations"],
                ...activityRows.map((item) => [...item]),
              ])
            }
          >
            <Download size={15} />
            <Translated value="Télécharger le CSV" />
          </button>
        }
      />
      <div className="filter-bar">
        <label
          htmlFor="report-period"
          style={{ fontSize: 12, color: "var(--muted)" }}
        >
          <Translated value="Période enregistrée" />
        </label>
        <select
          id="report-period"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          {activityRows.map((item) => (
            <option key={item[0]}>{item[0]}</option>
          ))}
        </select>
        <span className="results-count" style={{ margin: 0 }}>
          <Translated value="Activité enregistrée" />
        </span>
      </div>
      <div className="metrics-row">
        <Metric
          label={uiText("Rencontres")}
          value={row[1]}
          note={period}
          icon={<Users size={19} />}
        />
        <Metric
          label={uiText("Actions de terrain")}
          value={row[2]}
          note={uiText("Ateliers & visites")}
          icon={<Zap size={19} />}
        />
        <Metric
          label={uiText("Orientations")}
          value={row[3]}
          note={uiText("Parcours préparés")}
          icon={<Target size={19} />}
        />
      </div>
      <div className="two-column" style={{ marginTop: 25 }}>
        <Panel
          title={uiText("Les rencontres au fil des mois")}
          note={uiText("Activité enregistrée au fil des six derniers mois.")}
        >
          <div
            className="report-chart"
            role="img"
            aria-label={uiText("Rendez-vous enregistrés par mois")}
          >
            {activityRows.map((item) => (
              <div className="report-chart-column" key={item[0]}>
                <strong>{item[1]}</strong>
                <div
                  style={{
                    height: `${(item[1] / 25) * 100}%`,
                    background: item[0] === period ? "var(--teal)" : "#a9cfc1",
                  }}
                />
                <small>{item[0]}</small>
              </div>
            ))}
          </div>
        </Panel>
        <Panel
          title={uiText("Répartition des parcours")}
          note={uiText("Les dossiers qui te sont attribués.")}
        >
          {[
            ["Identifiés", 2],
            ["Activés", 1],
            ["En orientation", 1],
            ["Intégrés", 1],
          ].map(([label, count]) => (
            <div className="bar-row" key={label}>
              <div>
                <span>{label}</span>
                <span>{count}/5</span>
              </div>
              <div className="bar">
                <span style={{ width: `${(Number(count) / 5) * 100}%` }} />
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </>
  );
}

export function MediatorProfilePage() {
  const { text: uiText } = useUiTranslation();

  const { profileFixtures } = useWorkspaceDatasets();

  const [status, setStatus] = useState("");
  const [profile, setProfile] = useSimulatedState(
    "mediator.profile",
    profileFixtures.mediator,
  );
  return (
    <>
      <PageIntro
        eyebrow={uiText("UNE PRÉSENCE QUI COMPTE")}
        title={uiText("Mon profil médiateur")}
        description={uiText(
          "Présente ton rôle et tes disponibilités pour faciliter l’accompagnement.",
        )}
      />
      <div className="two-column">
        <Panel title={uiText("Informations professionnelles")}>
          <form
            key={JSON.stringify(profile)}
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              setProfile((current) => ({
                ...current,
                ...Object.fromEntries(
                  Array.from(data.entries()).filter(
                    (entry): entry is [string, string] =>
                      entry[0] in current && typeof entry[1] === "string",
                  ),
                ),
              }));
              setStatus("Demande d’enregistrement envoyée.");
            }}
          >
            <div className="form-grid">
              <label className="form-field">
                <Translated value="Prénom" />
                <input
                  className="field-input"
                  name="firstName"
                  defaultValue={profile.firstName}
                  required
                  autoComplete="given-name"
                />
              </label>
              <label className="form-field">
                <Translated value="Nom" />
                <input
                  className="field-input"
                  name="lastName"
                  defaultValue={profile.lastName}
                  required
                  autoComplete="family-name"
                />
              </label>
              <label className="form-field wide">
                <Translated value="Adresse professionnelle" />
                <input
                  className="field-input"
                  type="email"
                  readOnly
                  name="email"
                  defaultValue={profile.email}
                  required
                  autoComplete="email"
                />
              </label>
              <label className="form-field">
                <Translated value="Zone principale" />
                <select
                  className="field-input"
                  name="city"
                  defaultValue={profile.city}
                >
                  {["Agadir", "Inezgane", "Taroudant", "Tiznit", "Tata"].map(
                    (city) => (
                      <option key={city}>{city}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="form-field">
                <Translated value="Langue d’accompagnement" />
                <select
                  className="field-input"
                  name="language"
                  defaultValue={profile.language}
                >
                  {[
                    "Français et darija",
                    "Darija",
                    "Amazigh",
                    "Français",
                    "Arabe",
                  ].map((language) => (
                    <option key={language}>{language}</option>
                  ))}
                </select>
              </label>
              <label className="form-field wide">
                <Translated value="Présentation" />
                <textarea
                  className="field-input"
                  name="presentation"
                  defaultValue={profile.presentation}
                  maxLength={2000}
                />
              </label>
              <label className="form-field wide">
                <Translated value="Disponibilités" />
                <input
                  className="field-input"
                  name="availability"
                  defaultValue={profile.availability}
                  maxLength={200}
                />
              </label>
            </div>
            <button className="button button-primary" style={{ marginTop: 22 }}>
              <Translated value="Enregistrer mes informations" />
              <Check size={15} />
            </button>
            {status && (
              <div className="inline-alert" role="status">
                {status}
              </div>
            )}
            <p className="form-note">
              <Translated value="Le profil est conservé dans la base de données." />
            </p>
          </form>
        </Panel>
        <div className="stack">
          <Panel className="profile-summary">
            <Image
              src="/editorial/story-amina.webp"
              alt={uiText("")}
              width={90}
              height={90}
            />
            <h2>
              {profile.firstName} {profile.lastName}
            </h2>
            <p>
              <Translated value="Médiatrice · Agadir" />
            </p>
            <Tag>
              <Translated value="Accompagnement de proximité" />
            </Tag>
            <div className="definition-grid" style={{ textAlign: "left" }}>
              <div>
                <span className="form-note">
                  <Translated value="Zone d’intervention" />
                </span>
                <p style={{ fontSize: 12 }}>
                  <Translated value="Souss-Massa" />
                </p>
              </div>
              <div>
                <span className="form-note">
                  <Translated value="Dossiers accompagnés" />
                </span>
                <p style={{ fontSize: 12 }}>
                  <Translated value="5 jeunes" />
                </p>
              </div>
            </div>
          </Panel>
          <Panel title={uiText("Accès à ton compte")}>
            <p className="detail-text">
              <Translated value="Pour retrouver ton accès, demande un lien personnel à l’administration." />
            </p>
            <Link
              href="/auth/mediator/sign-in"
              className="button button-secondary"
              style={{ marginTop: 18 }}
            >
              <Translated value="Écran de connexion" />
              <ArrowRight size={15} />
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
