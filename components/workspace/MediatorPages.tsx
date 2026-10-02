"use client";

import { useState, type FormEvent } from "react";
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
  ShieldCheck,
  Target,
  Users,
  Zap,
} from "lucide-react";
import { fieldActions, opportunities, youngPeople } from "@/lib/demo-data";
import { downloadCsv } from "@/lib/export-csv";
import { EmptyState, Metric, PageIntro, Panel, Tag } from "./UI";

export function MediatorDashboard() {
  return (
    <>
      <section className="mediator-hero">
        <div>
          <div className="eyebrow">L’ACCOMPAGNEMENT FAIT LA DIFFÉRENCE</div>
          <h1>
            Bonjour Imane.
            <br />
            Chaque rencontre ouvre une voie.
          </h1>
          <p>
            Retrouve tes suivis, prépare tes rendez-vous et aide chaque jeune à
            construire son prochain pas.
          </p>
          <Link href="/mediator/caseload" className="button button-primary">
            Retrouver mes jeunes
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="hero-number">
          <strong>05</strong>
          <span>parcours à accompagner</span>
        </div>
      </section>
      <div className="metrics-row four">
        <Metric
          label="Jeunes accompagnés"
          value={5}
          note="Ton portefeuille démo"
          icon={<Users size={19} />}
        />
        <Metric
          label="Suivis prioritaires"
          value={2}
          note="Un contact à préparer"
          icon={<ShieldCheck size={19} />}
        />
        <Metric
          label="Rendez-vous à venir"
          value={5}
          note="5 – 7 octobre"
          icon={<CalendarDays size={19} />}
        />
        <Metric
          label="Parcours intégré"
          value={1}
          note="Un nouveau départ"
          icon={<Target size={19} />}
        />
      </div>
      <div className="mediator-dashboard">
        <div className="stack">
          <Panel
            title="Un contact peut tout changer"
            note="Les jeunes qui ont besoin de ton attention."
            href="/mediator/caseload"
          >
            {youngPeople
              .filter((person) => person.priority === "Prioritaire")
              .map((person) => (
                <div className="person-row" key={person.id}>
                  <Image src={person.photo} alt="" width={43} height={43} />
                  <div>
                    <h3>{person.name}</h3>
                    <p>
                      {person.city} · {person.blocker}
                    </p>
                  </div>
                  <Tag tone="orange">Prioritaire</Tag>
                  <Link
                    href={`/mediator/caseload/${person.id}`}
                    aria-label={`Ouvrir le dossier de ${person.name}`}
                  >
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
          </Panel>
          <Panel
            title="Les parcours avancent"
            note="Une vue rapide de tes derniers suivis."
            href="/mediator/caseload"
          >
            {youngPeople.slice(0, 3).map((person) => (
              <div className="person-row" key={person.id}>
                <Image src={person.photo} alt="" width={40} height={40} />
                <div>
                  <h3>{person.name}</h3>
                  <p>{person.goal}</p>
                </div>
                <Tag tone={person.stage === "Intégré" ? "teal" : "blue"}>
                  {person.stage}
                </Tag>
                <Link
                  href={`/mediator/caseload/${person.id}`}
                  aria-label={`Ouvrir le dossier de ${person.name}`}
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </Panel>
        </div>
        <div className="stack">
          <Panel
            title="Le prochain jour de terrain"
            note="Lundi 5 octobre · Agadir"
            href="/mediator/appointments"
          >
            {youngPeople.slice(0, 2).map((person, index) => (
              <div className="schedule-row" key={person.id}>
                <span className="schedule-time">
                  {index === 0 ? "10:00" : "11:30"}
                </span>
                <div>
                  <h3>{person.next}</h3>
                  <p>{person.name}</p>
                  <p>
                    <MapPin
                      size={11}
                      style={{ display: "inline", verticalAlign: "middle" }}
                    />{" "}
                    Bureau BidayaNeet
                  </p>
                </div>
              </div>
            ))}
          </Panel>
          <Panel
            title="Prochain atelier"
            note="Un petit pas pour plusieurs parcours."
          >
            <Tag tone="orange">7 octobre · 10:00</Tag>
            <h3 style={{ fontSize: 17, fontWeight: 500, margin: "14px 0 9px" }}>
              Un CV qui te ressemble
            </h3>
            <p className="detail-text">
              Un atelier pour aider les jeunes à mettre leurs compétences en
              mots.
            </p>
            <Link
              href="/mediator/micro-actions"
              className="button button-secondary"
              style={{ marginTop: 20 }}
            >
              Préparer l’atelier
              <ArrowRight size={15} />
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}

export function CaseloadPage() {
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
        eyebrow="DES PERSONNES, DES POSSIBILITÉS"
        title="Mes jeunes accompagnés"
        description="Garde le lien avec chaque jeune et prépare la prochaine étape de son parcours."
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
            Exporter la sélection
          </button>
        }
      />
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Rechercher un jeune"
            placeholder="Un nom, une ville, un projet…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          aria-label="Étape du parcours"
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
          aria-label="Priorité du suivi"
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          {["Tous les suivis", "Prioritaire", "Suivi régulier"].map((value) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </div>
      <p className="results-count">
        {filtered.length} jeune{filtered.length > 1 ? "s" : ""} dans cette
        sélection
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
                      <Image src={person.photo} alt="" width={38} height={38} />
                      <span>
                        <b>{person.name}</b>
                        <small>
                          {person.age} ans · {person.city}
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
                      <span>{person.progress}% du profil</span>
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
                      Ouvrir
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
          title="Aucun dossier dans cette sélection"
          description="Modifie tes filtres ou recherche une autre ville."
        />
      )}
    </>
  );
}

export function CaseloadDetail({ id }: { id: string }) {
  const person = youngPeople.find((item) => item.id === id)!;
  const [notes, setNotes] = useState<{ text: string; action: string }[]>([]);
  const [note, setNote] = useState("");
  const [action, setAction] = useState("Appel de suivi");
  function save(event: FormEvent) {
    event.preventDefault();
    if (!note.trim()) return;
    setNotes((current) => [{ text: note.trim(), action }, ...current]);
    setNote("");
  }
  return (
    <>
      <Link href="/mediator/caseload" className="back-link">
        <ArrowLeft size={15} />
        Mes jeunes accompagnés
      </Link>
      <div className="page-intro">
        <div className="caseload-detail-header">
          <Image src={person.photo} alt="" width={75} height={75} />
          <div>
            <h1>{person.name}</h1>
            <p>
              {person.age} ans · {person.city} · Dossier de démonstration{" "}
              {person.id}
            </p>
            <Tag>{person.stage}</Tag>
            {person.priority === "Prioritaire" && (
              <span style={{ marginLeft: 7 }}>
                <Tag tone="orange">Suivi prioritaire</Tag>
              </span>
            )}
          </div>
        </div>
        <Link href="/mediator/appointments" className="button button-primary">
          <CalendarDays size={15} />
          Préparer un rendez-vous
        </Link>
      </div>
      <div className="two-column">
        <div className="stack">
          <Panel title="Ce qui compte pour ce parcours">
            <dl className="definition-grid">
              <div>
                <dt>Projet</dt>
                <dd>{person.goal}</dd>
              </div>
              <div>
                <dt>Compétences</dt>
                <dd>{person.skills}</dd>
              </div>
              <div>
                <dt>Confiance</dt>
                <dd>{person.trust}</dd>
              </div>
              <div>
                <dt>Frein à accompagner</dt>
                <dd>{person.blocker}</dd>
              </div>
            </dl>
            <div className="progress-caption">
              <span>Profil complété</span>
              <span>{person.progress}%</span>
            </div>
            <progress value={person.progress} max={100} />
          </Panel>
          <Panel
            title="Ajouter une note de suivi"
            note="Une trace claire pour préparer la prochaine rencontre."
          >
            <form onSubmit={save}>
              <label className="form-field">
                Note
                <textarea
                  className="field-input"
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ce qui a été discuté, les besoins et les prochaines étapes…"
                  required
                  maxLength={3000}
                />
              </label>
              <label className="form-field" style={{ marginTop: 18 }}>
                Prochaine action
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
                Ajouter au suivi de démo
                <Check size={15} />
              </button>
              <p className="form-note">
                Les notes restent dans la page ouverte et ne sont pas
                enregistrées sur un serveur.
              </p>
            </form>
          </Panel>
        </div>
        <div className="stack">
          <Panel title="Prochaine rencontre">
            <Tag tone="blue">{person.date}</Tag>
            <h3 style={{ fontSize: 16, margin: "14px 0 8px", fontWeight: 500 }}>
              {person.next}
            </h3>
            <p className="detail-text">
              Préparer le point sur : {person.blocker.toLowerCase()}.
            </p>
            <Link
              href="/mediator/opportunities"
              className="text-link"
              style={{ marginTop: 20 }}
            >
              Explorer les orientations
              <ArrowRight size={15} />
            </Link>
          </Panel>
          <Panel title="Historique du suivi">
            <div className="timeline">
              {notes.map((item, index) => (
                <div className="timeline-item done" key={index}>
                  <div className="timeline-marker">
                    <Check size={13} />
                  </div>
                  <div>
                    <h3>{item.action}</h3>
                    <p>{item.text}</p>
                    <small>Ajout local · cette session</small>
                  </div>
                </div>
              ))}
              <div className="timeline-item done">
                <div className="timeline-marker">
                  <Check size={13} />
                </div>
                <div>
                  <h3>Premier échange</h3>
                  <p>
                    Projet et besoins identifiés lors de la rencontre initiale.
                  </p>
                  <small>22 septembre 2026 · Exemple</small>
                </div>
              </div>
            </div>
            {notes.length > 0 && (
              <p className="form-note" role="status">
                Note ajoutée au suivi de démonstration.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

type Appointment = {
  id: string;
  name: string;
  type: string;
  date: string;
  time: string;
  location: string;
  done: boolean;
};
const initialAppointments: Appointment[] = youngPeople.map((person, index) => ({
  id: person.id,
  name: person.name,
  type: person.next,
  date: index < 2 ? "2026-10-05" : index < 4 ? "2026-10-06" : "2026-10-07",
  time: ["10:00", "11:30", "09:00", "14:00", "10:00"][index],
  location: index === 3 ? "À domicile · Tiznit" : "Bureau BidayaNeet, Agadir",
  done: false,
}));
export function AppointmentsPage() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("À venir");
  const [status, setStatus] = useState("");
  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const appointment: Appointment = {
      id: crypto.randomUUID(),
      name: String(data.get("name")),
      type: String(data.get("type")),
      date: String(data.get("date")),
      time: String(data.get("time")),
      location: String(data.get("location")),
      done: false,
    };
    setAppointments((current) => [...current, appointment]);
    setShowForm(false);
    setStatus(
      "Rendez-vous ajouté à l’agenda de démonstration. Aucune invitation n’a été envoyée.",
    );
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
        eyebrow="FAIRE DE LA PLACE AUX RENCONTRES"
        title="Mon agenda"
        description="Prépare tes entretiens, tes appels et tes visites de terrain."
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
        <Panel title="Un nouveau rendez-vous" className="appointment-form">
          <form onSubmit={add}>
            <div className="form-grid">
              <label className="form-field">
                Jeune accompagné
                <select name="name" className="field-input">
                  {youngPeople.map((person) => (
                    <option key={person.id}>{person.name}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                Type de rencontre
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
                Date
                <input
                  type="date"
                  name="date"
                  className="field-input"
                  required
                  defaultValue="2026-10-08"
                />
              </label>
              <label className="form-field">
                Heure
                <input
                  type="time"
                  name="time"
                  className="field-input"
                  required
                  defaultValue="10:00"
                />
              </label>
              <label className="form-field wide">
                Lieu
                <input
                  name="location"
                  className="field-input"
                  required
                  placeholder="Bureau, appel ou adresse de visite…"
                  maxLength={200}
                />
              </label>
            </div>
            <div className="form-actions">
              <button className="button button-primary">
                Ajouter à l’agenda
                <Check size={15} />
              </button>
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowForm(false)}
              >
                Annuler
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
        aria-label="Filtrer les rendez-vous"
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
                  setStatus("Statut mis à jour dans la démonstration.");
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
          title="Un agenda qui respire"
          description="Aucun rendez-vous dans cette sélection. Tu peux en ajouter un pour préparer la prochaine rencontre."
        />
      )}
      <p className="form-note">
        Agenda de démonstration. Les changements restent dans la page ouverte.
      </p>
    </>
  );
}

export function MediatorOpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [referrals, setReferrals] = useState<
    { offer: string; person: string }[]
  >([]);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const filtered = opportunities.filter((item) =>
    `${item.title} ${item.location}`
      .toLocaleLowerCase("fr")
      .includes(query.toLocaleLowerCase("fr")),
  );
  return (
    <>
      <PageIntro
        eyebrow="FAIRE LE LIEN AVEC LES POSSIBILITÉS"
        title="Opportunités & orientations"
        description="Repère une offre pertinente et prépare une orientation avec le jeune."
      />
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Rechercher une offre"
            placeholder="Une formation, un métier, une ville…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Tag tone="muted">
          {referrals.length} orientation{referrals.length > 1 ? "s" : ""}{" "}
          préparée{referrals.length > 1 ? "s" : ""}
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
              Orienter un jeune
              <select
                className="field-input"
                value={selections[offer.id] ?? youngPeople[0].name}
                onChange={(event) =>
                  setSelections((current) => ({
                    ...current,
                    [offer.id]: event.target.value,
                  }))
                }
              >
                {youngPeople.map((person) => (
                  <option key={person.id}>{person.name}</option>
                ))}
              </select>
            </label>
            <button
              className="button button-secondary"
              style={{ width: "100%", marginTop: 15 }}
              disabled={referrals.some(
                (item) =>
                  item.offer === offer.id &&
                  item.person === (selections[offer.id] ?? youngPeople[0].name),
              )}
              onClick={() =>
                setReferrals((current) => [
                  ...current,
                  {
                    offer: offer.id,
                    person: selections[offer.id] ?? youngPeople[0].name,
                  },
                ])
              }
            >
              Préparer l’orientation
              <ArrowRight size={14} />
            </button>
            {referrals
              .filter((item) => item.offer === offer.id)
              .map((item) => (
                <div key={item.person} className="inline-alert" role="status">
                  {item.person} · orientation préparée en démo.
                </div>
              ))}
          </Panel>
        ))}
      </div>
      {!filtered.length && (
        <EmptyState
          title="Aucune offre correspondante"
          description="Essaie une recherche plus large."
        />
      )}
      <p className="form-note">
        Les orientations sont locales à la démonstration. Rien n’est transmis
        aux organismes partenaires.
      </p>
    </>
  );
}

export function MediatorActionsPage() {
  const [attendees, setAttendees] = useState<Record<number, string[]>>({});
  const [selected, setSelected] = useState<Record<number, string>>({});
  return (
    <>
      <PageIntro
        eyebrow="LE TERRAIN CRÉE LE LIEN"
        title="Actions de terrain"
        description="Prépare les ateliers et aide les jeunes à franchir un premier pas concret."
      />
      <div className="action-grid">
        {fieldActions.map((action) => (
          <Panel className="action-card" key={action.id}>
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
              Ajouter un participant
              <select
                className="field-input"
                value={selected[action.id] ?? youngPeople[0].name}
                onChange={(event) =>
                  setSelected((current) => ({
                    ...current,
                    [action.id]: event.target.value,
                  }))
                }
              >
                {youngPeople.map((person) => (
                  <option key={person.id}>{person.name}</option>
                ))}
              </select>
            </label>
            <button
              className="button button-secondary"
              style={{ marginTop: 15 }}
              disabled={(attendees[action.id] ?? []).includes(
                selected[action.id] ?? youngPeople[0].name,
              )}
              onClick={() => {
                const person = selected[action.id] ?? youngPeople[0].name;
                setAttendees((current) => ({
                  ...current,
                  [action.id]: [...(current[action.id] ?? []), person],
                }));
              }}
            >
              <Plus size={14} />
              Ajouter à l’atelier de démo
            </button>
            {(attendees[action.id] ?? []).length > 0 && (
              <div className="skill-list">
                {attendees[action.id].map((name) => (
                  <button
                    key={name}
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
                    {name} ×
                  </button>
                ))}
              </div>
            )}
            <p className="form-note">
              {(attendees[action.id] ?? []).length} participant
              {(attendees[action.id] ?? []).length > 1 ? "s" : ""} sélectionné
              {(attendees[action.id] ?? []).length > 1 ? "s" : ""} · Cliquez sur
              un nom pour le retirer.
            </p>
          </Panel>
        ))}
      </div>
      <p className="form-note">
        Listes de participants locales à la démonstration. Aucune invitation
        n’est envoyée.
      </p>
    </>
  );
}

const activityRows = [
  ["Juillet", 12, 8, 3],
  ["Août", 15, 10, 4],
  ["Septembre", 22, 14, 6],
] as const;
export function MediatorReportsPage() {
  const [period, setPeriod] = useState("Septembre");
  const row = activityRows.find((item) => item[0] === period)!;
  return (
    <>
      <PageIntro
        eyebrow="VOIR L’EFFET DE CHAQUE ACTION"
        title="Mon activité"
        description="Une vue claire de tes rencontres, de tes actions et des parcours qui avancent."
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
            Télécharger le CSV
          </button>
        }
      />
      <div className="filter-bar">
        <label
          htmlFor="report-period"
          style={{ fontSize: 12, color: "var(--muted)" }}
        >
          Période de démonstration
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
          2026 · Données d’exemple
        </span>
      </div>
      <div className="metrics-row">
        <Metric
          label="Rencontres"
          value={row[1]}
          note={`${period} · exemples`}
          icon={<Users size={19} />}
        />
        <Metric
          label="Actions de terrain"
          value={row[2]}
          note="Ateliers & visites"
          icon={<Zap size={19} />}
        />
        <Metric
          label="Orientations"
          value={row[3]}
          note="Parcours préparés"
          icon={<Target size={19} />}
        />
      </div>
      <div className="two-column" style={{ marginTop: 25 }}>
        <Panel
          title="Les rencontres au fil des mois"
          note="Illustration de l’activité de juillet à septembre."
        >
          <div
            className="report-chart"
            role="img"
            aria-label="Rencontres : juillet 12, août 15, septembre 22"
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
          title="Répartition des parcours"
          note="Ton portefeuille de démonstration."
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
  const [status, setStatus] = useState("");
  return (
    <>
      <PageIntro
        eyebrow="UNE PRÉSENCE QUI COMPTE"
        title="Mon profil médiateur"
        description="Présente ton rôle et tes disponibilités pour faciliter l’accompagnement."
      />
      <div className="two-column">
        <Panel title="Informations professionnelles">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setStatus("Profil mis à jour dans cette page de démonstration.");
            }}
          >
            <div className="form-grid">
              <label className="form-field">
                Prénom
                <input
                  className="field-input"
                  defaultValue="Imane"
                  required
                  autoComplete="given-name"
                />
              </label>
              <label className="form-field">
                Nom
                <input
                  className="field-input"
                  defaultValue="Rami"
                  required
                  autoComplete="family-name"
                />
              </label>
              <label className="form-field wide">
                Adresse professionnelle
                <input
                  className="field-input"
                  type="email"
                  defaultValue="imane@example.com"
                  required
                  autoComplete="email"
                />
              </label>
              <label className="form-field">
                Zone principale
                <select className="field-input" defaultValue="Agadir">
                  {["Agadir", "Inezgane", "Taroudant", "Tiznit", "Tata"].map(
                    (city) => (
                      <option key={city}>{city}</option>
                    ),
                  )}
                </select>
              </label>
              <label className="form-field">
                Langue d’accompagnement
                <select
                  className="field-input"
                  defaultValue="Français et darija"
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
                Présentation
                <textarea
                  className="field-input"
                  defaultValue="J’accompagne les jeunes à clarifier leur projet et à trouver une première opportunité qui leur ressemble."
                  maxLength={2000}
                />
              </label>
              <label className="form-field wide">
                Disponibilités
                <input
                  className="field-input"
                  defaultValue="Lundi au vendredi, 09:00 – 17:00"
                  maxLength={200}
                />
              </label>
            </div>
            <button className="button button-primary" style={{ marginTop: 22 }}>
              Enregistrer mes informations
              <Check size={15} />
            </button>
            {status && (
              <div className="inline-alert" role="status">
                {status}
              </div>
            )}
            <p className="form-note">
              Aucune information n’est sauvegardée sur un serveur dans cette
              version.
            </p>
          </form>
        </Panel>
        <div className="stack">
          <Panel className="profile-summary">
            <Image
              src="/user-portal/story-amina.jpg"
              alt=""
              width={90}
              height={90}
            />
            <h2>Imane Rami</h2>
            <p>Médiatrice · Agadir</p>
            <Tag>Accompagnement de proximité</Tag>
            <div className="definition-grid" style={{ textAlign: "left" }}>
              <div>
                <span className="form-note">Zone d’intervention</span>
                <p style={{ fontSize: 12 }}>Souss-Massa</p>
              </div>
              <div>
                <span className="form-note">Portefeuille démo</span>
                <p style={{ fontSize: 12 }}>5 jeunes</p>
              </div>
            </div>
          </Panel>
          <Panel title="Accès à ton compte">
            <p className="detail-text">
              Les écrans de connexion et de récupération de mot de passe sont
              prêts pour ton futur compte.
            </p>
            <Link
              href="/auth/mediator/sign-in"
              className="button button-secondary"
              style={{ marginTop: 18 }}
            >
              Écran de connexion
              <ArrowRight size={15} />
            </Link>
          </Panel>
        </div>
      </div>
    </>
  );
}
