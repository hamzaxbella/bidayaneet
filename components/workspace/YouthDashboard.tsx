"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { journeyState } from "@/lib/journey";
import { useWorkspace, useWorkspaceDatasets } from "./LiveProvider";
import type {
  AppointmentView,
  OpportunityView,
  FieldActionView,
} from "@/lib/workspace-data";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useYouth } from "./YouthProvider";
import { useWorkspaceState as useSimulatedState } from "./LiveProvider";
import StoryReels from "./StoryReels";
import MicroActionCard from "./MicroActionCard";
import {
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  MapPin,
  MessageCircle,
  Play,
  Search,
  Settings,
  Star,
  User,
} from "lucide-react";

function Topbar() {
  const { text: uiText } = useUiTranslation();

  const { profileFixtures } = useWorkspaceDatasets();

  const [profile] = useSimulatedState("neet.profile", profileFixtures.neet);
  const router = useRouter();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = String(new FormData(event.currentTarget).get("q") ?? "");
    router.push(`/neet/opportunities?q=${encodeURIComponent(query)}`);
  }
  return (
    <header className="portal-topbar">
      <div>
        <h1>
          <Translated value="Bonjour" />
          {profile.firstName} <span>👋</span>
        </h1>
        <p>
          <Translated value="Voici les meilleures opportunités et prochaines étapes pour toi." />
        </p>
      </div>
      <form
        className="portal-search"
        action="/neet/opportunities"
        method="get"
        onSubmit={search}
      >
        <Search size={18} />
        <input
          name="q"
          aria-label={uiText("Rechercher des opportunités, programmes")}
          placeholder={uiText("Rechercher des opportunités, programmes...")}
        />
      </form>
      <Link
        href="/neet/messages"
        className="icon-bell"
        aria-label={uiText("Notifications")}
      >
        <Bell size={20} />
      </Link>
    </header>
  );
}

function ProfileCard() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace(),
    { opportunities, profileFixtures } = useWorkspaceDatasets();
  const state = journeyState(data.journeys || []),
    profile = profileFixtures.neet;
  const fields = [
      profile.firstName,
      profile.lastName,
      profile.phone,
      profile.city,
      profile.goal,
      profile.skills,
      profile.interests,
      data.document?.filename,
    ],
    progress = Math.round(
      (fields.filter(Boolean).length / fields.length) * 100,
    );
  const { applications, saved, completed } = useYouth();
  return (
    <section className="portal-card profile-card">
      <div className="profile-main">
        <div className="avatar-ring">
          <Image
            src="/editorial/story-khalid.webp"
            alt={uiText("Illustration du profil")}
            width={118}
            height={118}
          />
        </div>
        <div className="profile-copy">
          <div className="profile-status">
            <b>
              <Translated value="Statut actuel" />
            </b>
            <span>{state.label}</span>
          </div>
          <p>
            <Translated value="Ton parcours progresse, continue ainsi !" />
          </p>
          <div className="progress-line">
            <i style={{ width: `${progress}%` }} />
          </div>
          <small>
            {progress}
            <Translated value="% des informations renseignées" />
          </small>
        </div>
      </div>
      <div className="profile-stats">
        {[
          [String(opportunities.length), "Opportunités disponibles"],
          [String(applications.length), "Candidatures préparées"],
          [String(saved.length), "Favoris enregistrés"],
          [String(completed.length), "Action complétée"],
        ].map(([value, label]) => (
          <div key={label}>
            <Check size={17} />
            <b>{value}</b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AssistantCard() {
  const { text: uiText } = useUiTranslation();

  return (
    <section className="portal-card assistant-card">
      <b>
        <Translated value="Bidaya · Accompagnement" />
      </b>
      <div>
        <Image
          src="/editorial/assistant-bot.webp"
          alt={uiText("Bidaya · Accompagnement")}
          width={96}
          height={86}
        />
        <p>
          <Translated value="Besoin d’aide ou d’un conseil personnalisé ? Je suis là pour toi." />
        </p>
      </div>
      <Link className="assistant-action" href="/neet/messages">
        <Translated value="Contacter mon médiateur" />
        <MessageCircle size={16} />
      </Link>
    </section>
  );
}

function QuoteCard() {
  const { text: uiText } = useUiTranslation();

  return (
    <section className="portal-card quote-card">
      <blockquote>
        <Translated value="“Chaque petit pas aujourd’hui te rapproche de ton avenir.”" />
      </blockquote>
      <p>
        <Translated value="Reste motivé, on croit en toi !" />
      </p>
      <Image
        src="/editorial/mountain-progress.webp"
        alt={uiText("Progression vers un objectif")}
        width={220}
        height={140}
      />
    </section>
  );
}

function SectionHeader({
  title,
  subtitle,
  href = "#",
}: {
  title: string;
  subtitle: string;
  href?: string;
}) {
  return (
    <div className="portal-section-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      <Link href={href}>
        <Translated value="Voir toutes" />
      </Link>
    </div>
  );
}

function Opportunities() {
  const { text: uiText } = useUiTranslation();

  const { opportunities: actual } = useWorkspaceDatasets();
  const opportunities = actual
    .slice()
    .sort((a, b) => b.match - a.match)
    .slice(0, 4)
    .map((o) => ({
      id: o.id,
      tag: o.type,
      match: o.match + "%",
      title: o.title,
      org: o.organization,
      place: o.location,
      desc: o.description,
      cta: "Voir les détails",
      image: o.image,
      tone: "#00B8A9",
    }));
  return (
    <section className="portal-panel">
      <SectionHeader
        title={uiText("Opportunités pour toi")}
        subtitle="Sélectionnées en fonction de ton profil et de tes intérêts"
        href="/neet/opportunities"
      />
      <div className="opportunity-row">
        {opportunities.map((item, index) => (
          <article key={item.title} className="opportunity-card">
            <div className="opportunity-image">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 900px) 100vw, 25vw"
              />
              <span style={{ borderColor: item.tone, color: item.tone }}>
                {item.match}
              </span>
            </div>
            <div className="opportunity-body">
              <small
                style={{ color: item.tone, backgroundColor: `${item.tone}12` }}
              >
                {item.tag}
              </small>
              <h3>{item.title}</h3>
              <div className="meta">
                <span>{item.org}</span>
                <span>
                  <MapPin size={12} />
                  {item.place}
                </span>
              </div>
              <p>{item.desc}</p>
              <Link
                className="opportunity-action"
                href={`/neet/opportunities/${item.id}`}
              >
                {item.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Stories() {
  const { text: uiText } = useUiTranslation();

  return (
    <section className="portal-panel youth-stories-panel">
      <SectionHeader
        title={uiText("Histoires inspirantes")}
        subtitle="Un nouveau départ, raconté en quelques instants"
        href="/neet/stories"
      />
      <StoryReels compact />
    </section>
  );
}

function NextActions() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace();
  const nextActions = [
    {
      icon: User,
      title: "Compléter mon profil",
      note: "Vérifier mes informations et mes envies",
      status: "À préparer",
      action: "Ouvrir",
      color: "#00B8A9",
    },
    ...(!data.document
      ? [
          {
            icon: ClipboardList,
            title: "Téléverser mon CV",
            note: "Ajouter un PDF privé à mon profil",
            status: "À préparer",
            action: "Ouvrir",
            color: "#2E86C1",
          },
        ]
      : []),
    ...data.appointments
      .filter((a) => !(a as typeof a & { completed?: boolean }).completed)
      .slice(0, 2)
      .map((a) => ({
        icon: CalendarDays,
        title: a.title,
        note: new Date(a.starts_at).toLocaleString("fr-MA", {
          timeZone: "Africa/Casablanca",
        }),
        status: "Rendez-vous",
        action: "Contacter",
        color: "#FF6B2C",
      })),
  ];
  return (
    <section className="portal-card task-card">
      <SectionHeader
        title={uiText("Tes prochaines actions")}
        subtitle=""
        href="/neet/journey"
      />
      <div className="task-list">
        {nextActions.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="task-item">
              <span
                style={{
                  color: item.color,
                  backgroundColor: `${item.color}12`,
                }}
              >
                <Icon size={17} />
              </span>
              <div>
                <b>{item.title}</b>
                <small>{item.note}</small>
              </div>
              <em>{item.status}</em>
              <Link
                className="task-action"
                href={
                  item.title.includes("profil") || item.title.includes("CV")
                    ? "/neet/profile"
                    : item.title.includes("formation")
                      ? "/neet/opportunities"
                      : "/neet/messages"
                }
              >
                {item.action}
              </Link>
            </div>
          );
        })}
      </div>
      <Link className="wide-link" href="/neet/journey">
        <Translated value="Voir toutes mes actions" />
      </Link>
    </section>
  );
}

function Journey() {
  const { data } = useWorkspace(),
    state = journeyState(data.journeys || []);
  const steps = ["Entrée au programme", "Activation", "Insertion", "Maintien"],
    done = [
      !!state.onboarding,
      !!state.activation,
      !!state.insertion,
      state.stabilized,
    ],
    count = done.filter(Boolean).length;
  return (
    <section className="portal-card journey-card">
      <h2>
        <Translated value="Ton parcours" />
      </h2>
      <p>
        <Translated value="Ton évolution vers l’intégration professionnelle" />
      </p>
      <div className="journey-line">
        {steps.map((step, index) => (
          <div key={step} className={done[index] ? "done" : ""}>
            <span>
              {done[index] ? <Check size={17} /> : <Settings size={17} />}
            </span>
            <b>{step}</b>
          </div>
        ))}
      </div>
      <div className="journey-summary">
        <div>
          <b>{state.label}</b>
          <p>
            <Translated value="Tu renforces tes compétences et tu te prépares pour ton intégration durable." />
          </p>
        </div>
        <strong>
          {count}/4{" "}
          <span>
            <Translated value="étapes confirmées" />
          </span>
        </strong>
      </div>
    </section>
  );
}

function MicroActions() {
  const { text: uiText } = useUiTranslation();

  const { fieldActions } = useWorkspaceDatasets();

  return (
    <section className="portal-card micro-card">
      <SectionHeader
        title={uiText("Micro-actions cette semaine")}
        subtitle="Petites actions, grands impacts"
        href="/neet/micro-actions"
      />
      <div className="micro-visual-grid">
        {fieldActions.map((action) => (
          <MicroActionCard action={action} compact key={action.id} />
        ))}
      </div>
    </section>
  );
}

function Notifications() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace();
  const notifications = data.messages
    .slice(0, 3)
    .map((m) => ({
      icon: Bell,
      title: data.contacts.find((c) => c.id === m.sender_id)?.name || "Message",
      note: m.body,
      time: new Date(m.created_at).toLocaleDateString("fr-MA"),
      color: "#00B8A9",
    }));
  return (
    <section className="portal-card notif-card">
      <SectionHeader
        title={uiText("Messages & notifications")}
        subtitle=""
        href="/neet/messages"
      />
      {notifications.map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.title} className="notification-item">
            <span
              style={{ color: item.color, backgroundColor: `${item.color}12` }}
            >
              <Icon size={20} />
            </span>
            <div>
              <b>{item.title}</b>
              <p>{item.note}</p>
            </div>
            <time>{item.time}</time>
          </div>
        );
      })}
    </section>
  );
}

function Mediator() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace(),
    mediator = data.contacts.find((c) => c.role === "mediator");
  return (
    <section className="portal-card mediator-card">
      <SectionHeader
        title={uiText("Ton médiateur")}
        subtitle=""
        href="/neet/messages"
      />
      <div className="mediator-body">
        <Image
          src="/editorial/story-amina.webp"
          alt={uiText("Imane R.")}
          width={74}
          height={74}
        />
        <div>
          <h3>{mediator?.name || "Médiateur à affecter"}</h3>
          <b>
            <Translated value="Médiateur" />
          </b>
          <span>
            <MapPin size={13} /> {mediator?.organization || "BidayaNeet"}
          </span>
        </div>
        <p>
          <Translated value="Je suis là pour t’accompagner à chaque étape de ton parcours. N’hésite pas à me contacter !" />
        </p>
      </div>
      <div className="mediator-actions">
        <Link className="mediator-message" href="/neet/messages">
          <Translated value="Envoyer un message" />
        </Link>
        <Link className="mediator-appointment" href="/neet/messages">
          <Translated value="Prendre rendez-vous" />
        </Link>
      </div>
    </section>
  );
}

export default function YouthDashboard() {
  return (
    <div className="original-youth-dashboard">
      <div className="portal-main">
        <Topbar />

        <div className="hero-grid">
          <ProfileCard />
          <AssistantCard />
          <QuoteCard />
        </div>
        <Opportunities />
        <Stories />
        <div className="lower-grid">
          <NextActions />
          <div className="right-stack">
            <Journey />
            <MicroActions />
          </div>
        </div>
        <div className="lower-grid">
          <Notifications />
          <Mediator />
        </div>
      </div>
    </div>
  );
}
