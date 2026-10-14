"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { journeyDescription, journeyLabels, journeyState } from "@/lib/journey";
import { useWorkspace, useWorkspaceDatasets } from "./LiveProvider";
import type {
  AppointmentView,
  OpportunityView,
  FieldActionView,
} from "@/lib/workspace-data";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
} from "lucide-react";
import { EmptyState, PageIntro, Panel, Tag } from "./UI";
import OpportunityCard from "./OpportunityCard";
import { useYouth } from "./YouthProvider";
import { AppointmentCard, NextSteps } from "./YouthWidgets";
import StoryReels from "./StoryReels";
import MicroActionCard from "./MicroActionCard";
import { useWorkspaceState as useSimulatedState } from "./LiveProvider";

export function OpportunitiesPage({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const { text: uiText } = useUiTranslation();

  const { opportunities } = useWorkspaceDatasets();

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("Toutes");
  const [location, setLocation] = useState("Tous les lieux");
  const [tab, setTab] = useState("Pour moi");
  const { saved, applications } = useYouth();
  const filtered = opportunities.filter(
    (item) =>
      `${item.title} ${item.organization} ${item.skills.join(" ")}`
        .toLocaleLowerCase("fr")
        .includes(query.toLocaleLowerCase("fr")) &&
      (type === "Toutes" || item.type === type) &&
      (location === "Tous les lieux" || item.location === location) &&
      (tab !== "Mes favoris" || saved.includes(item.id)) &&
      (tab !== "Mes candidatures" || applications.includes(item.id)),
  );
  return (
    <>
      <PageIntro
        eyebrow={uiText("LE CHAMP DES POSSIBLES")}
        title={uiText("Trouve ta prochaine opportunité")}
        description={uiText(
          "Une formation, un stage, un emploi. Choisis le début qui te ressemble.",
        )}
      />
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label={uiText("Rechercher une opportunité")}
            placeholder={uiText("Un métier, une compétence, un organisme…")}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          aria-label={uiText("Type d’opportunité")}
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          {["Toutes", "Formation", "Stage", "Emploi", "Programme"].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </select>
        <select
          aria-label={uiText("Lieu")}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        >
          {["Tous les lieux", "Agadir", "Casablanca", "En ligne"].map(
            (value) => (
              <option key={value}>{value}</option>
            ),
          )}
        </select>
      </div>
      <div className="section-heading" style={{ marginTop: 0 }}>
        <div
          className="filter-tabs"
          role="group"
          aria-label={uiText("Sélection d’opportunités")}
        >
          {["Pour moi", "Mes favoris", "Mes candidatures"].map((value) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={value === tab ? "active" : ""}
              aria-pressed={value === tab}
            >
              {value}
              {value === "Mes favoris"
                ? ` (${saved.length})`
                : value === "Mes candidatures"
                  ? ` (${applications.length})`
                  : ""}
            </button>
          ))}
        </div>
        <span className="results-count" style={{ margin: 0 }}>
          {filtered.length}
          <Translated value="résultat" />
          {filtered.length > 1 ? "s" : ""}
        </span>
      </div>
      {filtered.length ? (
        <div className="opportunity-grid two">
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={uiText("Pas encore d’opportunité ici")}
          description={
            tab === "Mes favoris"
              ? "Enregistre une opportunité avec le signet pour la retrouver ici."
              : tab === "Mes candidatures"
                ? "Prépare une candidature depuis le détail d’une opportunité."
                : "Essaie un autre mot-clé ou élargis tes filtres."
          }
        />
      )}
      <p className="form-note">
        <Translated value="Tes favoris et candidatures sont enregistrés dans ton compte." />
      </p>
    </>
  );
}

export function OpportunityDetail({ id }: { id: string }) {
  const { text: uiText } = useUiTranslation();

  const { opportunities } = useWorkspaceDatasets();

  const opportunity = opportunities.find((item) => item.id === id)!;
  const { saved, toggleSaved, applications, apply } = useYouth();
  const applied = applications.includes(id);
  return (
    <>
      <Link href="/neet/opportunities" className="back-link">
        <ArrowLeft size={15} />
        <Translated value="Toutes les opportunités" />
      </Link>
      <PageIntro
        eyebrow={opportunity.type.toUpperCase()}
        title={opportunity.title}
        description={`${opportunity.organization} · ${opportunity.location}`}
        action={
          <button
            className="button button-secondary"
            aria-pressed={saved.includes(id)}
            onClick={() => toggleSaved(id)}
          >
            <Bookmark
              size={16}
              fill={saved.includes(id) ? "currentColor" : "none"}
            />
            {saved.includes(id) ? "Enregistrée" : "Enregistrer"}
          </button>
        }
      />
      <div className="two-column">
        <div className="stack">
          <div className="detail-cover">
            <Image
              src={opportunity.image}
              alt={uiText("")}
              fill
              sizes="(max-width: 1000px) 95vw, 55vw"
            />
          </div>
          <Panel title={uiText("Et si c’était ton prochain pas ?")}>
            <div className="detail-text">
              <p>{opportunity.description}</p>
              <h3>
                <Translated value="Ce qui t’attend" />
              </h3>
              <p>{opportunity.details}</p>
              <h3>
                <Translated value="Les compétences à développer" />
              </h3>
              <div className="skill-list">
                {opportunity.skills.map((skill) => (
                  <Tag key={skill} tone="muted">
                    {skill}
                  </Tag>
                ))}
              </div>
              <h3>
                <Translated value="Un accompagnement à chaque étape" />
              </h3>
              <p>
                <Translated value="Ta médiatrice peut t’aider à comprendre les conditions, préparer ton CV et organiser ton entretien. Prends le temps d’en discuter avec elle." />
              </p>
            </div>
          </Panel>
        </div>
        <div className="stack">
          <Panel title={uiText("L’essentiel")}>
            <ul className="detail-list">
              <li>
                <BriefcaseBusiness size={17} />
                {opportunity.type} · {opportunity.organization}
              </li>
              <li>
                <MapPin size={17} />
                {opportunity.location}
              </li>
              <li>
                <Clock3 size={17} />
                {opportunity.duration}
              </li>
              <li>
                <CalendarDays size={17} />
                <Translated value="Avant le" />
                {opportunity.deadline}
              </li>
            </ul>
            <div className="inline-alert">
              <CheckCircle2
                size={16}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: 6,
                }}
              />
              {opportunity.match}
              <Translated value="% de compatibilité selon les critères déclarés" />
            </div>
            <button
              className="button button-primary"
              style={{ width: "100%" }}
              onClick={() => apply(id)}
              disabled={applied}
            >
              {applied ? "Candidature enregistrée" : "Préparer ma candidature"}
              <ArrowRight size={16} />
            </button>
            {applied && (
              <p className="form-note" role="status">
                <Translated value="Ta candidature est enregistrée et visible par l’organisme partenaire." />
              </p>
            )}
            <Link
              href="/neet/messages"
              className="text-link"
              style={{ marginTop: 18 }}
            >
              <Translated value="En parler à mon médiateur" />
              <ArrowRight size={15} />
            </Link>
          </Panel>
          <AppointmentCard />
        </div>
      </div>
    </>
  );
}

export function JourneyPage() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace();
  const events = data.journeys || [],
    current = journeyState(events);
  const steps = events.map((e) => ({
    title: journeyLabels[e.step],
    text: journeyDescription(e),
    date: new Date(e.data.date + "T12:00:00Z").toLocaleDateString("fr-MA"),
    state: "done",
  }));
  const completed = [
    current.onboarding,
    current.activation,
    current.insertion,
    current.stabilized,
  ].filter(Boolean).length;
  return (
    <>
      <PageIntro
        eyebrow={uiText("CHAQUE ÉTAPE COMPTE")}
        title={uiText("Ton parcours, à ton rythme")}
        description={uiText(
          "Un chemin se construit pas à pas. Voici où tu en es et ce qui t’attend.",
        )}
      />
      <div className="two-column">
        <Panel>
          <div className="journey-header">
            <div className="progress-ring">{completed}/4</div>
            <div>
              <Tag>{current.label}</Tag>
              <h2 style={{ marginTop: 10 }}>
                <Translated value="Tu avances dans la bonne direction." />
              </h2>
              <p>
                {completed}
                <Translated value="étape(s) confirmée(s) dans ton dossier." />
              </p>
            </div>
          </div>
          <div className="timeline">
            {!steps.length && (
              <p>
                <Translated value="Aucune étape confirmée pour le moment. Ton médiateur prépare avec toi la prochaine étape." />
              </p>
            )}
            {steps.map((step, index) => (
              <div key={step.title} className={`timeline-item ${step.state}`}>
                <div className="timeline-marker">
                  {step.state === "done" ? <Check size={15} /> : index + 1}
                </div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <small>{step.date}</small>
                </div>
              </div>
            ))}
          </div>
          <Link href="/neet/opportunities" className="button button-primary">
            <Translated value="Explorer mes possibilités" />
            <ArrowRight size={16} />
          </Link>
        </Panel>
        <div className="stack">
          <AppointmentCard />
          <NextSteps />
        </div>
      </div>
    </>
  );
}

export function MicroActionsPage() {
  const { text: uiText } = useUiTranslation();

  const { fieldActions } = useWorkspaceDatasets();

  const [filter, setFilter] = useState("Tous les petits pas");
  const { enrolled } = useYouth();
  const filtered = fieldActions.filter(
    (item) => filter !== "Mes inscriptions" || enrolled.includes(item.id),
  );
  return (
    <>
      <PageIntro
        eyebrow={uiText("PETITS PAS, GRANDES POSSIBILITÉS")}
        title={uiText("Un petit pas aujourd’hui")}
        description={uiText(
          "Des actions simples pour prendre confiance, découvrir et te préparer.",
        )}
      />
      <div
        className="filter-tabs"
        style={{ marginBottom: 22 }}
        role="group"
        aria-label={uiText("Filtrer les actions")}
      >
        {["Tous les petits pas", "Mes inscriptions"].map((value) => (
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
      {filtered.length ? (
        <div className="actions-discovery-grid">
          {filtered.map((action) => (
            <MicroActionCard key={action.id} action={action} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={uiText("Ton premier petit pas t’attend")}
          description={uiText(
            "Choisis un atelier ou une activité pour le retrouver dans tes inscriptions.",
          )}
        />
      )}
    </>
  );
}

export function StoriesPage() {
  const { text: uiText } = useUiTranslation();

  return (
    <>
      <PageIntro
        eyebrow={uiText("DES PARCOURS QUI DONNENT CONFIANCE")}
        title={uiText("Un déclic peut tout changer")}
        description={uiText(
          "Des parcours de jeunes comme toi. Ouvre une histoire et découvre leur premier pas.",
        )}
      />
      <StoryReels />
      <p className="form-note">
        <Translated value="Récits et portraits de démonstration, créés pour illustrer les parcours d’accompagnement." />
      </p>
    </>
  );
}

export function YouthProfilePage() {
  const { text: uiText } = useUiTranslation();

  const { data: workspaceData } = useWorkspace();
  const { profileFixtures } = useWorkspaceDatasets();

  const [status, setStatus] = useState("");
  const [document, setDocument] = useState(
    workspaceData.document ? String(workspaceData.document.filename) : "",
  );
  const [documentError, setDocumentError] = useState("");
  const [profile, setProfile] = useSimulatedState(
    "neet.profile",
    profileFixtures.neet,
  );
  function save(event: FormEvent<HTMLFormElement>) {
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
    setStatus("Enregistrement demandé.");
  }
  return (
    <>
      <PageIntro
        eyebrow={uiText("UN PROFIL QUI TE RESSEMBLE")}
        title={uiText("Fais connaître tes envies")}
        description={uiText(
          "Quelques informations pour mieux t’accompagner et trouver les bonnes opportunités.",
        )}
      />
      <div className="two-column">
        <Panel
          title={uiText("Mes informations")}
          note={uiText("Tu peux les modifier à tout moment.")}
        >
          <form onSubmit={save} key={JSON.stringify(profile)}>
            <div className="form-grid">
              <label className="form-field">
                <Translated value="Prénom" />
                <input
                  className="field-input"
                  name="firstName"
                  defaultValue={profile.firstName}
                  required
                  autoComplete="given-name"
                  maxLength={80}
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
                  maxLength={80}
                />
              </label>
              <label className="form-field">
                <Translated value="Adresse e-mail" />
                <input
                  className="field-input"
                  name="email"
                  type="email"
                  defaultValue={profile.email}
                  readOnly
                  required
                  autoComplete="email"
                />
              </label>
              <label className="form-field">
                <Translated value="Téléphone" />
                <input
                  className="field-input"
                  name="phone"
                  defaultValue={profile.phone}
                  type="tel"
                  placeholder={uiText("+212 6 00 00 00 00")}
                  autoComplete="tel"
                />
              </label>
              <label className="form-field">
                <Translated value="Ville" />
                <select
                  className="field-input"
                  name="city"
                  defaultValue={profile.city}
                >
                  {[
                    "Agadir",
                    "Inezgane",
                    "Taroudant",
                    "Tiznit",
                    "Tata",
                    "Laâyoune",
                    "Dakhla",
                    "Autre",
                  ].map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </label>
              <label className="form-field">
                <Translated value="Mon objectif" />
                <select
                  className="field-input"
                  name="goal"
                  defaultValue={profile.goal}
                >
                  {[
                    "Une formation",
                    "Un stage",
                    "Un emploi",
                    "Créer mon projet",
                    "J’ai besoin d’orientation",
                  ].map((goal) => (
                    <option key={goal}>{goal}</option>
                  ))}
                </select>
              </label>
              <label className="form-field wide">
                <Translated value="Mes compétences" />
                <textarea
                  className="field-input"
                  name="skills"
                  defaultValue={profile.skills}
                  maxLength={1000}
                />
              </label>
              <label className="form-field wide">
                <Translated value="Ce que j’aimerais découvrir" />
                <textarea
                  className="field-input"
                  name="interests"
                  defaultValue={profile.interests}
                  maxLength={2000}
                />
              </label>
            </div>
            <div className="form-actions">
              <button className="button button-primary" type="submit">
                <Translated value="Enregistrer mes informations" />
                <Check size={15} />
              </button>
            </div>
            {status && (
              <div className="inline-alert" role="status">
                {status}
              </div>
            )}
            <p className="form-note">
              <Translated value="Tes informations sont enregistrées dans ton compte." />
            </p>
          </form>
        </Panel>
        <div className="stack">
          <Panel className="profile-summary">
            <Image
              src="/editorial/story-khalid.webp"
              alt={uiText("")}
              width={90}
              height={90}
            />
            <h2>
              {profile.firstName} {profile.lastName}
            </h2>
            <p>{profile.city || "Ville à renseigner"}</p>
            <Tag>
              <Translated value="Accompagnement actif" />
            </Tag>
            <progress
              value={
                [
                  profile.phone,
                  profile.city,
                  profile.skills,
                  profile.interests,
                  document,
                ].filter(Boolean).length * 20
              }
              max={100}
            />
            <small>
              {[
                profile.phone,
                profile.city,
                profile.skills,
                profile.interests,
                document,
              ].filter(Boolean).length * 20}
              <Translated value="% des informations renseignées" />
            </small>
            <div className="skill-list" style={{ justifyContent: "center" }}>
              {profile.skills
                .split(",")
                .filter(Boolean)
                .slice(0, 5)
                .map((skill, index) => (
                  <Tag tone="muted" key={`${skill}-${index}`}>
                    {skill.trim()}
                  </Tag>
                ))}
            </div>
          </Panel>
          <Panel
            title={uiText("Mes documents")}
            note={uiText("Prépare ton CV pour les prochaines étapes.")}
          >
            <div className="document-row">
              <FileText size={20} color="var(--teal)" />
              <div>
                <b>{document || "Mon CV"}</b>{document&&<a href="/api/workspace/cv" download className="text-link"><Translated value="Télécharger mon CV"/></a>}
                <small>
                  {document
                    ? "PDF déposé dans ton espace privé"
                    : "À ajouter · PDF, 4 Mo maximum"}
                </small>
              </div>
              {document && <CheckCircle2 size={17} color="var(--teal)" />}
            </div>
            <label className="file-upload">
              <Translated value="Choisir mon CV" />
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (
                    !file.name.toLowerCase().endsWith(".pdf") ||
                    (file.type && file.type !== "application/pdf") ||
                    file.size > 4 * 1024 * 1024
                  ) {
                    setDocumentError("Choisis un PDF de 4 Mo maximum.");
                    event.target.value = "";
                    return;
                  }
                  try {
                    const body = new FormData();
                    body.set("file", file);
                    const response = await fetch("/api/workspace/cv", {
                      method: "POST",
                      body,
                    });
                    const result = await response.json();
                    if (!response.ok)
                      throw Error(result.error || "Dépôt impossible.");
                    setDocument(result.filename);
                    setDocumentError("");
                  } catch (error) {
                    setDocumentError(
                      error instanceof Error
                        ? error.message
                        : "Dépôt impossible.",
                    );
                  }
                }}
              />
            </label>
            {documentError && (
              <p className="form-note" role="alert">
                {documentError}
              </p>
            )}
            <p className="form-note">
              <Translated value="Le PDF est conservé dans ton espace privé." />
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
