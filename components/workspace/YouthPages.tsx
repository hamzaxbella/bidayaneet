"use client";

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
  Compass,
  FileText,
  Heart,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { fieldActions, opportunities, stories } from "@/lib/demo-data";
import { EmptyState, PageIntro, Panel, Tag } from "./UI";
import OpportunityCard from "./OpportunityCard";
import { useYouth } from "./YouthProvider";
import { AppointmentCard, NextSteps } from "./YouthDashboard";

export function OpportunitiesPage() {
  const [query, setQuery] = useState("");
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
        eyebrow="LE CHAMP DES POSSIBLES"
        title="Trouve ta prochaine opportunité"
        description="Une formation, un stage, un emploi. Choisis le début qui te ressemble."
      />
      <div className="filter-bar">
        <div className="search-field">
          <Search size={16} />
          <input
            aria-label="Rechercher une opportunité"
            placeholder="Un métier, une compétence, un organisme…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <select
          aria-label="Type d’opportunité"
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
          aria-label="Lieu"
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
          aria-label="Sélection d’opportunités"
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
          {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
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
          title="Pas encore d’opportunité ici"
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
        Les offres sont présentées à titre d’exemple. Tes sélections restent
        dans cette session de démonstration.
      </p>
    </>
  );
}

export function OpportunityDetail({ id }: { id: string }) {
  const opportunity = opportunities.find((item) => item.id === id)!;
  const { saved, toggleSaved, applications, apply } = useYouth();
  const applied = applications.includes(id);
  return (
    <>
      <Link href="/neet/opportunities" className="back-link">
        <ArrowLeft size={15} />
        Toutes les opportunités
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
              alt=""
              fill
              sizes="(max-width: 1000px) 95vw, 55vw"
            />
          </div>
          <Panel title="Et si c’était ton prochain pas ?">
            <div className="detail-text">
              <p>{opportunity.description}</p>
              <h3>Ce qui t’attend</h3>
              <p>{opportunity.details}</p>
              <h3>Les compétences à développer</h3>
              <div className="skill-list">
                {opportunity.skills.map((skill) => (
                  <Tag key={skill} tone="muted">
                    {skill}
                  </Tag>
                ))}
              </div>
              <h3>Un accompagnement à chaque étape</h3>
              <p>
                Ta médiatrice peut t’aider à comprendre les conditions, préparer
                ton CV et organiser ton entretien. Prends le temps d’en discuter
                avec elle.
              </p>
            </div>
          </Panel>
        </div>
        <div className="stack">
          <Panel title="L’essentiel">
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
                Avant le {opportunity.deadline}
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
              {opportunity.match}% de compatibilité avec le profil de
              démonstration
            </div>
            <button
              className="button button-primary"
              style={{ width: "100%" }}
              onClick={() => apply(id)}
              disabled={applied}
            >
              {applied ? "Candidature préparée" : "Préparer ma candidature"}
              <ArrowRight size={16} />
            </button>
            {applied && (
              <p className="form-note" role="status">
                Cette offre a été ajoutée à tes candidatures de démonstration.
                Aucune candidature n’a été transmise à l’organisme.
              </p>
            )}
            <Link
              href="/neet/messages"
              className="text-link"
              style={{ marginTop: 18 }}
            >
              En parler à Imane
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
  const steps = [
    {
      title: "Une première rencontre",
      text: "Tu as partagé ton parcours et tes envies avec Imane.",
      date: "15 septembre 2026",
      state: "done",
    },
    {
      title: "Construire la confiance",
      text: "Ton accompagnement a commencé. Tes besoins sont identifiés.",
      date: "22 septembre 2026",
      state: "done",
    },
    {
      title: "Trouver ta direction",
      text: "Explore les métiers et les formations qui te ressemblent.",
      date: "En cours · Prochain entretien le 5 octobre",
      state: "current",
    },
    {
      title: "Passer à l’action",
      text: "Prépare une candidature, rejoins une formation ou commence un stage.",
      date: "À venir",
      state: "",
    },
    {
      title: "Installer ton nouveau départ",
      text: "Ton médiateur continue à te suivre pendant tes premiers mois.",
      date: "À venir",
      state: "",
    },
  ];
  return (
    <>
      <PageIntro
        eyebrow="CHAQUE ÉTAPE COMPTE"
        title="Ton parcours, à ton rythme"
        description="Un chemin se construit pas à pas. Voici où tu en es et ce qui t’attend."
      />
      <div className="two-column">
        <Panel>
          <div className="journey-header">
            <div className="progress-ring">2/5</div>
            <div>
              <Tag>Orientation en cours</Tag>
              <h2 style={{ marginTop: 10 }}>
                Tu avances dans la bonne direction.
              </h2>
              <p>Deux étapes franchies. Une équipe à tes côtés.</p>
            </div>
          </div>
          <div className="timeline">
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
            Explorer mes possibilités
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
  const [filter, setFilter] = useState("Tous les petits pas");
  const { enrolled, toggleEnrolled } = useYouth();
  const filtered = fieldActions.filter(
    (item) => filter !== "Mes inscriptions" || enrolled.includes(item.id),
  );
  return (
    <>
      <PageIntro
        eyebrow="PETITS PAS, GRANDES POSSIBILITÉS"
        title="Un petit pas aujourd’hui"
        description="Des actions simples pour prendre confiance, découvrir et te préparer."
      />
      <div
        className="filter-tabs"
        style={{ marginBottom: 22 }}
        role="group"
        aria-label="Filtrer les actions"
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
        <div className="action-grid">
          {filtered.map((action) => (
            <Panel key={action.id} className="action-card">
              <div className="action-card-top">
                <div className="action-icon">
                  {action.icon === "file" ? (
                    <FileText size={20} />
                  ) : action.icon === "users" ? (
                    <Users size={20} />
                  ) : action.icon === "heart" ? (
                    <Heart size={20} />
                  ) : (
                    <Compass size={20} />
                  )}
                </div>
                <Tag
                  tone={action.category === "À ton rythme" ? "orange" : "teal"}
                >
                  {action.category}
                </Tag>
              </div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
              <ul className="detail-list">
                <li>
                  <CalendarDays size={14} />
                  {action.date} · {action.time}
                </li>
                <li>
                  <MapPin size={14} />
                  {action.city}
                </li>
              </ul>
              <div className="action-card-bottom" style={{ marginTop: 20 }}>
                <span className="card-meta" style={{ margin: 0 }}>
                  <Clock3 size={13} />
                  {action.duration}
                </span>
                <button
                  className={`button button-small ${enrolled.includes(action.id) ? "button-secondary" : "button-primary"}`}
                  onClick={() => toggleEnrolled(action.id)}
                >
                  {enrolled.includes(action.id)
                    ? "Annuler ma sélection"
                    : action.category === "À ton rythme"
                      ? "Choisir ce petit pas"
                      : "M’inscrire en démo"}
                  {enrolled.includes(action.id) ? (
                    <Check size={14} />
                  ) : (
                    <ArrowRight size={14} />
                  )}
                </button>
              </div>
              {enrolled.includes(action.id) && (
                <p
                  className="form-note"
                  role="status"
                  style={{ marginBottom: 0 }}
                >
                  Sélection enregistrée pour cette session. Inscription réelle
                  disponible après connexion du service.
                </p>
              )}
            </Panel>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Ton premier petit pas t’attend"
          description="Choisis un atelier ou une activité pour le retrouver dans tes inscriptions."
        />
      )}
    </>
  );
}

export function StoriesPage() {
  const [expanded, setExpanded] = useState<string[]>([]);
  return (
    <>
      <PageIntro
        eyebrow="DES PARCOURS QUI DONNENT CONFIANCE"
        title="Ils ont trouvé leur chemin"
        description="Des histoires pour te rappeler que chaque nouveau départ est possible."
      />
      <div className="stories-grid">
        {stories.map((story) => (
          <article className="story-card" key={story.id}>
            <div className="story-image">
              <Image
                src={story.image}
                alt={`Portrait de ${story.name}`}
                fill
                sizes="(max-width: 650px) 95vw, 45vw"
              />
            </div>
            <div className="story-body">
              <Tag tone="muted">{story.city}</Tag>
              <h2>
                {story.name} · {story.role}
              </h2>
              <blockquote>« {story.quote} »</blockquote>
              <button
                className="text-link"
                aria-expanded={expanded.includes(story.id)}
                aria-controls={`story-${story.id}`}
                onClick={() =>
                  setExpanded((current) =>
                    current.includes(story.id)
                      ? current.filter((id) => id !== story.id)
                      : [...current, story.id],
                  )
                }
                style={{ border: 0, background: "transparent" }}
              >
                {expanded.includes(story.id)
                  ? "Fermer le récit"
                  : "Découvrir son parcours"}
                <ArrowRight size={15} />
              </button>
              {expanded.includes(story.id) && (
                <p className="story-expanded" id={`story-${story.id}`}>
                  {story.text}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>
      <p className="form-note">
        Récits et portraits de démonstration, créés pour illustrer les parcours
        d’accompagnement.
      </p>
    </>
  );
}

export function YouthProfilePage() {
  const [status, setStatus] = useState("");
  const [document, setDocument] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [skills, setSkills] = useState(
    "Relation client, outils bureautiques, communication",
  );
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Profil mis à jour dans cette session de démonstration.");
  }
  return (
    <>
      <PageIntro
        eyebrow="UN PROFIL QUI TE RESSEMBLE"
        title="Fais connaître tes envies"
        description="Quelques informations pour mieux t’accompagner et trouver les bonnes opportunités."
      />
      <div className="two-column">
        <Panel
          title="Mes informations"
          note="Tu peux les modifier à tout moment."
        >
          <form onSubmit={save}>
            <div className="form-grid">
              <label className="form-field">
                Prénom
                <input
                  className="field-input"
                  name="firstName"
                  defaultValue="Yassine"
                  required
                  autoComplete="given-name"
                  maxLength={80}
                />
              </label>
              <label className="form-field">
                Nom
                <input
                  className="field-input"
                  name="lastName"
                  defaultValue="El Amrani"
                  required
                  autoComplete="family-name"
                  maxLength={80}
                />
              </label>
              <label className="form-field">
                Adresse e-mail
                <input
                  className="field-input"
                  name="email"
                  type="email"
                  defaultValue="yassine@example.com"
                  required
                  autoComplete="email"
                />
              </label>
              <label className="form-field">
                Téléphone
                <input
                  className="field-input"
                  name="phone"
                  type="tel"
                  placeholder="+212 6 00 00 00 00"
                  autoComplete="tel"
                />
              </label>
              <label className="form-field">
                Ville
                <select
                  className="field-input"
                  name="city"
                  defaultValue="Agadir"
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
                Mon objectif
                <select
                  className="field-input"
                  name="goal"
                  defaultValue="Une formation"
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
                Mes compétences
                <textarea
                  className="field-input"
                  name="skills"
                  value={skills}
                  onChange={(event) => setSkills(event.target.value)}
                  maxLength={1000}
                />
              </label>
              <label className="form-field wide">
                Ce que j’aimerais découvrir
                <textarea
                  className="field-input"
                  name="interests"
                  defaultValue="J’aimerais découvrir le développement web et travailler dans une équipe."
                  maxLength={2000}
                />
              </label>
            </div>
            <div className="form-actions">
              <button className="button button-primary" type="submit">
                Enregistrer mes informations
                <Check size={15} />
              </button>
            </div>
            {status && (
              <div className="inline-alert" role="status">
                {status}
              </div>
            )}
            <p className="form-note">
              Les modifications restent dans la page ouverte. Aucun profil réel
              n’est créé.
            </p>
          </form>
        </Panel>
        <div className="stack">
          <Panel className="profile-summary">
            <Image
              src="/user-portal/story-khalid.jpg"
              alt=""
              width={90}
              height={90}
            />
            <h2>Yassine El Amrani</h2>
            <p>22 ans · Agadir</p>
            <Tag>Accompagnement actif</Tag>
            <progress value={document ? 90 : 78} max={100} />
            <small>
              {document ? 90 : 78}% du profil de démonstration complété
            </small>
            <div className="skill-list" style={{ justifyContent: "center" }}>
              {skills
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
            title="Mes documents"
            note="Prépare ton CV pour les prochaines étapes."
          >
            <div className="document-row">
              <FileText size={20} color="var(--teal)" />
              <div>
                <b>{document || "Mon CV"}</b>
                <small>
                  {document
                    ? "Fichier sélectionné localement"
                    : "À ajouter · PDF, 5 Mo maximum"}
                </small>
              </div>
              {document && <CheckCircle2 size={17} color="var(--teal)" />}
            </div>
            <label className="file-upload">
              Choisir mon CV
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (
                    !file.name.toLowerCase().endsWith(".pdf") ||
                    (file.type && file.type !== "application/pdf") ||
                    file.size > 5 * 1024 * 1024
                  ) {
                    setDocumentError("Choisis un PDF de 5 Mo maximum.");
                    event.target.value = "";
                    return;
                  }
                  setDocument(file.name);
                  setDocumentError("");
                }}
              />
            </label>
            {documentError && (
              <p className="form-note" role="alert">
                {documentError}
              </p>
            )}
            <p className="form-note">
              Le fichier est vérifié sur ton appareil. Aucun document n’est
              téléversé.
            </p>
          </Panel>
        </div>
      </div>
    </>
  );
}
