"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useYouth } from "./YouthProvider";
import { useSimulatedState } from "@/lib/simulated-backend";
import StoryReels from "./StoryReels";
import MicroActionCard from "./MicroActionCard";
import { fieldActions, profileFixtures } from "@/lib/demo-data";
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

const opportunities = [
  {
    tag: "Formation",
    match: "92%",
    title: "Développement Web Full Stack",
    org: "GOMYCODE",
    place: "Agadir",
    desc: "Formation intensive de 6 mois avec certification et stage inclus.",
    cta: "Voir les détails",
    image: "/editorial/opp-web-dev.webp",
    tone: "#00B8A9",
  },
  {
    tag: "Stage",
    match: "88%",
    title: "Stage Marketing Digital",
    org: "StartUp Maroc",
    place: "Casablanca",
    desc: "Stage de 3 mois pour renforcer vos compétences en marketing digital.",
    cta: "Postuler maintenant",
    image: "/editorial/opp-marketing.webp",
    tone: "#2E86C1",
  },
  {
    tag: "Emploi",
    match: "85%",
    title: "Conseiller Client",
    org: "Marjane",
    place: "Agadir",
    desc: "Poste en CDI avec opportunités d’évolution et accompagnement.",
    cta: "Voir l'offre",
    image: "/editorial/opp-retail.webp",
    tone: "#FF6B2C",
  },
  {
    tag: "Programme",
    match: "82%",
    title: "Programme Injaz - Entreprendre",
    org: "INJAZH Maroc",
    place: "En ligne",
    desc: "Accompagnement pour lancer votre projet entrepreneurial.",
    cta: "En savoir plus",
    image: "/editorial/opp-entrepreneur.webp",
    tone: "#8E44AD",
  },
];

const nextActions = [
  {
    icon: User,
    title: "Complète ton profil",
    note: "Ajoute tes compétences et expériences.",
    status: "75%",
    action: "Continuer",
    color: "#00B8A9",
  },
  {
    icon: FileText,
    title: "Assiste à la session d'orientation",
    note: "Mercredi 21 mai à 15h00",
    status: "Bientôt",
    action: "Voir détails",
    color: "#F5A623",
  },
  {
    icon: CalendarDays,
    title: "Confirme ton entretien",
    note: "Entretien avec Marjane",
    status: "À faire",
    action: "Confirmer",
    color: "#FF6B2C",
  },
  {
    icon: Play,
    title: "Regarde la formation recommandée",
    note: "Marketing digital - 15 min",
    status: "Nouveau",
    action: "Regarder",
    color: "#2E86C1",
  },
  {
    icon: ClipboardList,
    title: "Téléverse ton CV",
    note: "Ajoute ton CV pour plus d’opportunités",
    status: "À faire",
    action: "Téléverser",
    color: "#00B8A9",
  },
];

const notifications = [
  {
    icon: BriefcaseBusiness,
    title: "Nouvelle opportunité pour toi !",
    note: "Stage Marketing Digital chez StartUp Maroc.",
    time: "2h",
    color: "#00B8A9",
  },
  {
    icon: Bell,
    title: "Rappel : session d'orientation",
    note: "N’oublie pas notre session mercredi à 15h00.",
    time: "1j",
    color: "#FF6B2C",
  },
  {
    icon: Star,
    title: "Félicitations !",
    note: "Ton profil est 78% complété. Continue comme ça !",
    time: "2j",
    color: "#F5A623",
  },
];

function Topbar() {
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
          Bonjour {profile.firstName} <span>👋</span>
        </h1>
        <p>Voici les meilleures opportunités et prochaines étapes pour toi.</p>
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
          aria-label="Rechercher des opportunités, programmes"
          placeholder="Rechercher des opportunités, programmes..."
        />
      </form>
      <Link
        href="/neet/messages"
        className="icon-bell"
        aria-label="Notifications"
      >
        <Bell size={20} />
        <span>2</span>
      </Link>
    </header>
  );
}

function ProfileCard() {
  const { applications, saved, completed } = useYouth();
  return (
    <section className="portal-card profile-card">
      <div className="profile-main">
        <div className="avatar-ring">
          <Image
            src="/editorial/story-khalid.webp"
            alt="Yassine El Amrani"
            width={118}
            height={118}
          />
        </div>
        <div className="profile-copy">
          <div className="profile-status">
            <b>Statut actuel</b>
            <span>● Activé</span>
          </div>
          <p>Ton parcours progresse, continue ainsi !</p>
          <div className="progress-line">
            <i style={{ width: "78%" }} />
          </div>
          <small>78% complété</small>
        </div>
      </div>
      <div className="profile-stats">
        {[
          ["4", "Opportunités disponibles"],
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
  return (
    <section className="portal-card assistant-card">
      <b>Bidaya Assistant</b>
      <div>
        <Image
          src="/editorial/assistant-bot.webp"
          alt="Bidaya Assistant"
          width={96}
          height={86}
        />
        <p>Besoin d’aide ou d’un conseil personnalisé ? Je suis là pour toi.</p>
      </div>
      <Link className="assistant-action" href="/neet/messages">
        Chat maintenant <MessageCircle size={16} />
      </Link>
    </section>
  );
}

function QuoteCard() {
  return (
    <section className="portal-card quote-card">
      <blockquote>
        “Chaque petit pas aujourd’hui te rapproche de ton avenir.”
      </blockquote>
      <p>Reste motivé, on croit en toi !</p>
      <Image
        src="/editorial/mountain-progress.webp"
        alt="Progression vers un objectif"
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
      <Link href={href}>Voir toutes</Link>
    </div>
  );
}

function Opportunities() {
  const opportunityIds = ["web", "marketing", "retail", "enterprise"];
  return (
    <section className="portal-panel">
      <SectionHeader
        title="Opportunités pour toi"
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
                href={`/neet/opportunities/${opportunityIds[index]}`}
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
  return (
    <section className="portal-panel youth-stories-panel">
      <SectionHeader
        title="Histoires inspirantes"
        subtitle="Un nouveau départ, raconté en quelques instants"
        href="/neet/stories"
      />
      <StoryReels compact />
    </section>
  );
}

function NextActions() {
  return (
    <section className="portal-card task-card">
      <SectionHeader
        title="Tes prochaines actions"
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
        Voir toutes mes actions
      </Link>
    </section>
  );
}

function Journey() {
  const steps = ["Identifié", "Activé", "Classé", "Intégré", "Stabilisé"];
  return (
    <section className="portal-card journey-card">
      <h2>Ton parcours</h2>
      <p>Ton évolution vers l’intégration professionnelle</p>
      <div className="journey-line">
        {steps.map((step, index) => (
          <div key={step} className={index < 2 ? "done" : ""}>
            <span>
              {index < 4 ? <Check size={17} /> : <Settings size={17} />}
            </span>
            <b>{step}</b>
          </div>
        ))}
      </div>
      <div className="journey-summary">
        <div>
          <b>Étape actuelle : Activé</b>
          <p>
            Tu renforces tes compétences et tu te prépares pour ton intégration
            durable.
          </p>
        </div>
        <strong>
          78% <span>du parcours complété</span>
        </strong>
      </div>
    </section>
  );
}

function MicroActions() {
  return (
    <section className="portal-card micro-card">
      <SectionHeader
        title="Micro-actions cette semaine"
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
  return (
    <section className="portal-card notif-card">
      <SectionHeader
        title="Messages & notifications"
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
  return (
    <section className="portal-card mediator-card">
      <SectionHeader title="Ton médiateur" subtitle="" href="/neet/messages" />
      <div className="mediator-body">
        <Image
          src="/editorial/story-amina.webp"
          alt="Imane R."
          width={74}
          height={74}
        />
        <div>
          <h3>Imane R.</h3>
          <b>Médiateur</b>
          <span>
            <MapPin size={13} /> Agadir
          </span>
          <em>● En ligne</em>
        </div>
        <p>
          Je suis là pour t’accompagner à chaque étape de ton parcours. N’hésite
          pas à me contacter !
        </p>
      </div>
      <div className="mediator-actions">
        <Link className="mediator-message" href="/neet/messages">
          Envoyer un message
        </Link>
        <Link className="mediator-appointment" href="/neet/messages">
          Prendre rendez-vous
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
        <p className="dashboard-demo-note">
          Espace de démonstration · les candidatures et messages restent locaux.
        </p>
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
