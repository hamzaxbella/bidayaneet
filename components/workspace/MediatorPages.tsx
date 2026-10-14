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
  X,
  Target,
  Users,
  Zap,
} from "lucide-react";
import {
  appointmentFixtures,
  profileFixtures,
  type DemoAppointment,
  fieldActions,
  opportunities,
  youngPeople,
} from "@/lib/demo-data";
import { downloadCsv } from "@/lib/export-csv";
import { useSimulatedState } from "@/lib/simulated-backend";
import { Metric, PageIntro, Panel, Tag } from "./UI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Alert, AlertDescription } from "@/components/ui/alert";

function normalizeSearch(value: string) {
  return value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

function PortalSelect({
  options,
  label,
  id,
  ...props
}: {
  options: string[];
  label: string;
  id?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(props.defaultValue ?? options[0]);
  const value = props.value ?? uncontrolledValue;
  return (
    <Select {...props} value={value} onValueChange={(next) => {
      setUncontrolledValue(next);
      props.onValueChange?.(next);
    }}>
      <SelectTrigger id={id} aria-label={label}>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((value) => (
            <SelectItem key={value} value={value}>
              {value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
function PortalSearch({
  label,
  placeholder,
  query,
  onChange,
}: {
  label: string;
  placeholder: string;
  query: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup className="mediator-search">
      <InputGroupInput
        aria-label={label}
        placeholder={placeholder}
        value={query}
        onChange={(event) => onChange(event.target.value)}
      />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
function PortalEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Empty className="empty-state">
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export { default as MediatorDashboard } from "./MediatorOverview";

export function CaseloadPage() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("Tous les parcours");
  const [priority, setPriority] = useState("Tous les suivis");
  const filtered = youngPeople.filter(
    (person) =>
      normalizeSearch(`${person.name} ${person.city} ${person.goal}`)
        .includes(normalizeSearch(query)) &&
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
          <Button
            variant="outline"
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
            <Download data-icon="inline-start" />
            Exporter la sélection
          </Button>
        }
      />
      <div className="filter-bar">
        <PortalSearch
          label="Rechercher un jeune"
          placeholder="Un nom, une ville, un projet…"
          query={query}
          onChange={setQuery}
        />
        <PortalSelect
          label="Étape du parcours"
          value={stage}
          onValueChange={setStage}
          options={[
            "Tous les parcours",
            "Identifié",
            "Activé",
            "Orientation",
            "Intégré",
          ]}
        />
        <PortalSelect
          label="Priorité du suivi"
          value={priority}
          onValueChange={setPriority}
          options={["Tous les suivis", "Prioritaire", "Suivi régulier"]}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            setStage("Tous les parcours");
            setPriority("Tous les suivis");
          }}
        >
          Réinitialiser
        </Button>
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
        <PortalEmpty
          title="Aucun dossier dans cette sélection"
          description="Modifie tes filtres ou recherche une autre ville."
        />
      )}
    </>
  );
}

export function CaseloadDetail({ id }: { id: string }) {
  const person = youngPeople.find((item) => item.id === id)!;
  const [notes, setNotes] = useSimulatedState<
    { text: string; action: string }[]
  >(`mediator.notes.${id}`, []);
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
        <Button asChild>
          <Link href="/mediator/appointments">
            <CalendarDays data-icon="inline-start" />
            Préparer un rendez-vous
          </Link>
        </Button>
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
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="followup-note">Note</FieldLabel>
                  <Textarea
                    id="followup-note"
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Ce qui a été discuté, les besoins et les prochaines étapes…"
                    required
                    maxLength={3000}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="followup-action">
                    Prochaine action
                  </FieldLabel>
                  <PortalSelect
                    id="followup-action"
                    label="Prochaine action"
                    value={action}
                    onValueChange={setAction}
                    options={[
                      "Appel de suivi",
                      "Entretien d’orientation",
                      "Atelier CV",
                      "Visite de proximité",
                      "Orientation vers une offre",
                    ]}
                  />
                </Field>
              </FieldGroup>
              <Button type="submit" variant="default" style={{ marginTop: 20 }}>
                Ajouter au suivi de démo
                <Check data-icon="inline-end" />
              </Button>
              <p className="form-note">
                Les notes sont enregistrées sur cet appareil dans la
                démonstration.
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
                    <small>Suivi enregistré sur cet appareil</small>
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

type Appointment = DemoAppointment;
const initialAppointments = appointmentFixtures;
export function AppointmentsPage() {
  const [appointments, setAppointments] = useSimulatedState(
    "mediator.appointments",
    initialAppointments,
  );
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("À venir");
  const [query, setQuery] = useState("");
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
        (filter === "Tout l’agenda" ||
          (filter === "Terminés" ? item.done : !item.done)) &&
        normalizeSearch(`${item.name} ${item.type} ${item.location}`)
          .includes(normalizeSearch(query)),
    )
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  return (
    <>
      <PageIntro
        eyebrow="FAIRE DE LA PLACE AUX RENCONTRES"
        title="Mon agenda"
        description="Prépare tes entretiens, tes appels et tes visites de terrain."
        action={
          <Button
            variant="default"
            aria-expanded={showForm}
            onClick={() => setShowForm(!showForm)}
          >
            <Plus data-icon="inline-start" />
            {showForm ? "Fermer le formulaire" : "Ajouter un rendez-vous"}
          </Button>
        }
      />
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Un nouveau rendez-vous</DialogTitle>
            <DialogDescription>
              Prépare une rencontre avec un jeune accompagné.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={add}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="appointment-person">
                  Jeune accompagné
                </FieldLabel>
                <PortalSelect
                  id="appointment-person"
                  name="name"
                  label="Jeune accompagné"
                  defaultValue={youngPeople[0].name}
                  options={youngPeople.map((person) => person.name)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="appointment-type">
                  Type de rencontre
                </FieldLabel>
                <PortalSelect
                  id="appointment-type"
                  name="type"
                  label="Type de rencontre"
                  defaultValue="Entretien d’orientation"
                  options={[
                    "Entretien d’orientation",
                    "Appel de suivi",
                    "Préparation d’entretien",
                    "Visite de proximité",
                  ]}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="appointment-date">Date</FieldLabel>
                <Input
                  id="appointment-date"
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toLocaleDateString("en-CA")}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="appointment-time">Heure</FieldLabel>
                <Input
                  id="appointment-time"
                  type="time"
                  name="time"
                  required
                  defaultValue="10:00"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="appointment-location">Lieu</FieldLabel>
                <Input
                  id="appointment-location"
                  name="location"
                  required
                  placeholder="Bureau, appel ou adresse de visite…"
                  maxLength={200}
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mediator-dialog-footer">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Ajouter à l’agenda
                <Check data-icon="inline-end" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {status && (
        <Alert className="mediator-feedback" role="status">
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}
      <div className="filter-bar mediator-agenda-filters">
        <PortalSearch
          label="Rechercher un rendez-vous"
          placeholder="Un jeune, une rencontre, un lieu…"
          query={query}
          onChange={setQuery}
        />
        <ToggleGroup
          type="single"
          value={filter}
          onValueChange={(value) => {
            if (value) setFilter(value);
          }}
          aria-label="Filtrer les rendez-vous"
          variant="outline"
        >
          {["À venir", "Terminés", "Tout l’agenda"].map((value) => (
            <ToggleGroupItem key={value} value={value}>
              {value}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <p className="results-count" aria-live="polite">{filtered.length} rendez-vous dans cette sélection</p>
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
              <Button
                variant="outline"
                size="sm"
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
                <Check data-icon="inline-end" />
              </Button>
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <PortalEmpty
          title="Un agenda qui respire"
          description="Aucun rendez-vous dans cette sélection. Tu peux en ajouter un pour préparer la prochaine rencontre."
        />
      )}
      <p className="form-note">
        Agenda de démonstration. Les changements sont enregistrés sur cet
        appareil.
      </p>
    </>
  );
}

export function MediatorOpportunitiesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("Tous les types");
  const [location, setLocation] = useState("Tous les lieux");
  const [referrals, setReferrals] = useSimulatedState<
    { offer: string; person: string }[]
  >("mediator.referrals", []);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [detail, setDetail] = useState<(typeof opportunities)[number] | null>(
    null,
  );
  const filtered = opportunities.filter(
    (item) =>
      normalizeSearch(`${item.title} ${item.organization} ${item.location}`)
        .includes(normalizeSearch(query)) &&
      (type === "Tous les types" || item.type === type) &&
      (location === "Tous les lieux" || item.location === location),
  );
  return (
    <>
      <PageIntro
        eyebrow="FAIRE LE LIEN AVEC LES POSSIBILITÉS"
        title="Opportunités & orientations"
        description="Repère une offre pertinente et prépare une orientation avec le jeune."
      />
      <div className="filter-bar">
        <PortalSearch
          label="Rechercher une offre"
          placeholder="Une formation, un métier, une ville…"
          query={query}
          onChange={setQuery}
        />
        <PortalSelect
          label="Type d’opportunité"
          value={type}
          onValueChange={setType}
          options={[
            "Tous les types",
            ...new Set(opportunities.map((item) => item.type)),
          ]}
        />
        <PortalSelect
          label="Lieu de l’opportunité"
          value={location}
          onValueChange={setLocation}
          options={[
            "Tous les lieux",
            ...new Set(opportunities.map((item) => item.location)),
          ]}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            setType("Tous les types");
            setLocation("Tous les lieux");
          }}
        >
          Réinitialiser
        </Button>
      </div>
      <p className="results-count">
        {filtered.length} offre{filtered.length > 1 ? "s" : ""} ·{" "}
        {referrals.length} orientation{referrals.length > 1 ? "s" : ""} préparée
        {referrals.length > 1 ? "s" : ""}
      </p>
      <div className="action-grid">
        {filtered.map((offer) => {
          const person = selections[offer.id] ?? youngPeople[0].name;
          const prepared = referrals.some(
            (item) => item.offer === offer.id && item.person === person,
          );
          return (
            <Card key={offer.id} className="mediator-offer-card">
              <div className="mediator-offer-image">
                <Image
                  src={offer.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 90vw, 40vw"
                />
              </div>
              <CardHeader>
                <div className="action-card-top">
                  <Badge variant="secondary">{offer.type}</Badge>
                  <span className="org-label">{offer.organization}</span>
                </div>
                <CardTitle><h2>{offer.title}</h2></CardTitle>
                <CardDescription>{offer.description}</CardDescription>
              </CardHeader>
              <CardContent className="mediator-card-content">
                <div className="card-meta">
                  <span>
                    <MapPin size={14} />
                    {offer.location}
                  </span>
                  <span>
                    <Clock3 size={14} />
                    {offer.duration}
                  </span>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`referral-${offer.id}`}>
                      Orienter un jeune
                    </FieldLabel>
                    <PortalSelect
                      id={`referral-${offer.id}`}
                      label={`Orienter un jeune vers ${offer.title}`}
                      value={person}
                      onValueChange={(value) =>
                        setSelections((current) => ({
                          ...current,
                          [offer.id]: value,
                        }))
                      }
                      options={youngPeople.map((item) => item.name)}
                    />
                  </Field>
                </FieldGroup>
                {referrals
                  .filter((item) => item.offer === offer.id)
                  .map((item) => (
                    <Alert key={item.person} role="status">
                      <AlertDescription>
                        {item.person} · orientation préparée en démo.
                      </AlertDescription>
                    </Alert>
                  ))}
              </CardContent>
              <CardFooter className="mediator-card-footer">
                <Button variant="outline" onClick={() => setDetail(offer)}>
                  Voir l’offre
                </Button>
                <Button
                  disabled={prepared}
                  onClick={() =>
                    setReferrals((current) => [
                      ...current,
                      { offer: offer.id, person },
                    ])
                  }
                >
                  {prepared ? "Orientation préparée" : "Préparer l’orientation"}
                  <ArrowRight data-icon="inline-end" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {!filtered.length && (
        <PortalEmpty
          title="Aucune offre correspondante"
          description="Essaie une recherche plus large ou réinitialise les filtres."
        />
      )}
      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.title}</DialogTitle>
            <DialogDescription>
              {detail?.organization} · {detail?.location}
            </DialogDescription>
          </DialogHeader>
          <p>{detail?.details}</p>
          <p>
            Durée : {detail?.duration} · Échéance : {detail?.deadline}
          </p>
          <div className="skill-list">
            {detail?.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      <p className="form-note">
        Les orientations sont enregistrées sur cet appareil. Rien n’est transmis
        aux organismes partenaires.
      </p>
    </>
  );
}

export function MediatorActionsPage() {
  const [attendees, setAttendees] = useSimulatedState<Record<number, string[]>>(
    "mediator.attendees",
    {},
  );
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Toutes les activités");
  const [location, setLocation] = useState("Tous les lieux");
  const [detail, setDetail] = useState<(typeof fieldActions)[number] | null>(
    null,
  );
  const [status, setStatus] = useState("");
  const filtered = fieldActions.filter(
    (action) =>
      normalizeSearch(`${action.title} ${action.description} ${action.city}`)
        .includes(normalizeSearch(query)) &&
      (category === "Toutes les activités" || category === action.category) &&
      (location === "Tous les lieux" || action.city === location),
  );
  function addParticipant(action: (typeof fieldActions)[number]) {
    const person = selected[action.id] ?? youngPeople[0].name;
    setAttendees((current) => ({
      ...current,
      [action.id]: [...new Set([...(current[action.id] ?? []), person])],
    }));
    setStatus(`${person} ajouté à « ${action.title} » sur cet appareil.`);
  }
  function removeParticipant(
    action: (typeof fieldActions)[number],
    name: string,
  ) {
    setAttendees((current) => ({
      ...current,
      [action.id]: (current[action.id] ?? []).filter((item) => item !== name),
    }));
    setStatus(`${name} retiré de « ${action.title} ».`);
  }
  return (
    <>
      <PageIntro
        eyebrow="LE TERRAIN CRÉE LE LIEN"
        title="Actions de terrain"
        description="Prépare les ateliers et aide les jeunes à franchir un premier pas concret."
        action={
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv("bidayaneet-participants-demo.csv", [
                ["Activité", "Date", "Lieu", "Participant"],
                ...fieldActions.flatMap((action) =>
                  (attendees[action.id] ?? []).map((name) => [
                    action.title,
                    action.date,
                    action.city,
                    name,
                  ]),
                ),
              ])
            }
          >
            <Download data-icon="inline-start" />
            Exporter les participants
          </Button>
        }
      />
      <div className="filter-bar">
        <PortalSearch
          label="Rechercher une action de terrain"
          placeholder="Un atelier, une activité, une ville…"
          query={query}
          onChange={setQuery}
        />
        <PortalSelect
          label="Catégorie de l’action"
          value={category}
          onValueChange={setCategory}
          options={[
            "Toutes les activités",
            ...new Set(fieldActions.map((action) => action.category)),
          ]}
        />
        <PortalSelect
          label="Lieu de l’action"
          value={location}
          onValueChange={setLocation}
          options={[
            "Tous les lieux",
            ...new Set(fieldActions.map((action) => action.city)),
          ]}
        />
        <Button
          variant="ghost"
          onClick={() => {
            setQuery("");
            setCategory("Toutes les activités");
            setLocation("Tous les lieux");
          }}
        >
          Réinitialiser
        </Button>
      </div>
      <p className="results-count">
        {filtered.length} activité{filtered.length > 1 ? "s" : ""} ·{" "}
        {Object.values(attendees).reduce((sum, names) => sum + names.length, 0)}{" "}
        participations
      </p>
      {status && (
        <Alert className="mediator-feedback" role="status">
          <AlertDescription>{status}</AlertDescription>
        </Alert>
      )}
      <div className="mediator-terrain-grid">
        {filtered.map((action) => {
          const names = attendees[action.id] ?? [];
          const person = selected[action.id] ?? youngPeople[0].name;
          const added = names.includes(person);
          return (
            <Card className="mediator-terrain-card" key={action.id}>
              <div className="mediator-terrain-image">
                <Image
                  src={action.image}
                  alt=""
                  fill
                  sizes="(max-width: 760px) 90vw, 40vw"
                />
              </div>
              <CardHeader>
                <div className="action-card-top">
                  <Badge variant="secondary">{action.category}</Badge>
                  <span className="mediator-participant-count">
                    <Users size={14} />
                    {names.length} participant{names.length > 1 ? "s" : ""}
                  </span>
                </div>
                <CardTitle><h2>{action.title}</h2></CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="mediator-card-content">
                <div className="card-meta">
                  <span>
                    <CalendarDays size={14} />
                    {action.date}
                  </span>
                  <span>
                    <MapPin size={14} />
                    {action.city}
                  </span>
                </div>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor={`participant-${action.id}`}>
                      Ajouter un participant
                    </FieldLabel>
                    <PortalSelect
                      id={`participant-${action.id}`}
                      label={`Participant pour ${action.title}`}
                      value={person}
                      onValueChange={(value) =>
                        setSelected((current) => ({
                          ...current,
                          [action.id]: value,
                        }))
                      }
                      options={youngPeople.map((item) => item.name)}
                    />
                  </Field>
                </FieldGroup>
                {names.length > 0 && (
                  <ul
                    className="mediator-attendees"
                    aria-label={`Participants à ${action.title}`}
                  >
                    {names.map((name) => (
                      <li key={name}>
                        <Badge variant="secondary">{name}</Badge>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label={`Retirer ${name} de ${action.title}`}
                          onClick={() => removeParticipant(action, name)}
                        >
                          <X />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              <CardFooter className="mediator-card-footer">
                <Button variant="outline" onClick={() => setDetail(action)}>
                  Voir l’activité
                </Button>
                <Button disabled={added} onClick={() => addParticipant(action)}>
                  {added ? (
                    <Check data-icon="inline-start" />
                  ) : (
                    <Plus data-icon="inline-start" />
                  )}
                  {added ? "Participant ajouté" : "Ajouter le participant"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      {!filtered.length && (
        <PortalEmpty
          title="Aucune activité correspondante"
          description="Modifie la recherche ou les filtres pour retrouver tes activités."
        />
      )}
      <Dialog
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) setDetail(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detail?.title}</DialogTitle>
            <DialogDescription>
              {detail?.date} · {detail?.city}
            </DialogDescription>
          </DialogHeader>
          <p>{detail?.description}</p>
          <p>
            {detail?.category} · {(attendees[detail?.id ?? -1] ?? []).length}{" "}
            participant(s)
          </p>
          <ul className="mediator-dialog-attendees">
            {(attendees[detail?.id ?? -1] ?? []).map((name) => (
              <li key={name}>
                {name}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (detail) removeParticipant(detail, name);
                  }}
                >
                  Retirer
                </Button>
              </li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetail(null)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <p className="form-note">
        Participants enregistrés sur cet appareil. Aucune invitation n’est
        envoyée.
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
          <Button
            variant="outline"
            onClick={() =>
              downloadCsv(`bidayaneet-activite-${period.toLocaleLowerCase("fr")}-demo.csv`, [
                ["Mois", "Rencontres", "Actions de terrain", "Orientations"],
                [...row],
              ])
            }
          >
            <Download data-icon="inline-start" />
            Télécharger le CSV
          </Button>
        }
      />
      <div className="filter-bar">
        <label
          htmlFor="report-period"
          style={{ fontSize: 12, color: "var(--muted)" }}
        >
          Période de démonstration
        </label>
        <PortalSelect
          id="report-period"
          label="Période de démonstration"
          value={period}
          onValueChange={setPeriod}
          options={activityRows.map((item) => item[0])}
        />
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
  const [profile, setProfile] = useSimulatedState(
    "mediator.profile",
    profileFixtures.mediator,
  );
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
              setStatus("Informations enregistrées sur cet appareil.");
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="mediator-firstname">Prénom</FieldLabel>
                <Input
                  id="mediator-firstname"
                  name="firstName"
                  defaultValue={profile.firstName}
                  required
                  autoComplete="given-name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mediator-lastname">Nom</FieldLabel>
                <Input
                  id="mediator-lastname"
                  name="lastName"
                  defaultValue={profile.lastName}
                  required
                  autoComplete="family-name"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mediator-email">
                  Adresse professionnelle
                </FieldLabel>
                <Input
                  id="mediator-email"
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  required
                  autoComplete="email"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mediator-city">Zone principale</FieldLabel>
                <PortalSelect
                  id="mediator-city"
                  name="city"
                  label="Zone principale"
                  defaultValue={profile.city}
                  options={[
                    "Agadir",
                    "Inezgane",
                    "Taroudant",
                    "Tiznit",
                    "Tata",
                  ]}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mediator-language">
                  Langue d’accompagnement
                </FieldLabel>
                <PortalSelect
                  id="mediator-language"
                  name="language"
                  label="Langue d’accompagnement"
                  defaultValue={profile.language}
                  options={[
                    "Français et darija",
                    "Darija",
                    "Amazigh",
                    "Français",
                    "Arabe",
                  ]}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mediator-presentation">
                  Présentation
                </FieldLabel>
                <Textarea
                  id="mediator-presentation"
                  name="presentation"
                  defaultValue={profile.presentation}
                  maxLength={2000}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mediator-availability">
                  Disponibilités
                </FieldLabel>
                <Input
                  id="mediator-availability"
                  name="availability"
                  defaultValue={profile.availability}
                  maxLength={200}
                />
              </Field>
            </FieldGroup>
            <Button variant="default" style={{ marginTop: 22 }}>
              Enregistrer mes informations
              <Check data-icon="inline-end" />
            </Button>
            {status && (
              <Alert className="mediator-feedback" role="status">
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
            <p className="form-note">
              Informations de démonstration enregistrées sur cet appareil.
            </p>
          </form>
        </Panel>
        <div className="stack">
          <Panel className="profile-summary">
            <Image
              src="/editorial/story-amina.webp"
              alt=""
              width={90}
              height={90}
            />
            <h2>
              {profile.firstName} {profile.lastName}
            </h2>
            <p>Médiatrice · {profile.city}</p>
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
            <Button asChild variant="outline" style={{ marginTop: 18 }}>
              <Link href="/auth/mediator/sign-in">
                Écran de connexion
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </Panel>
        </div>
      </div>
    </>
  );
}
