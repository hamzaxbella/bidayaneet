"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  FileText,
  MapPin,
  MessageCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { opportunities } from "@/lib/demo-data";
import { Metric, Panel, Tag } from "./UI";
import OpportunityCard from "./OpportunityCard";
import { useYouth } from "./YouthProvider";

export function AppointmentCard() {
  return (
    <Panel title="Prochain rendez-vous" className="appointment-panel">
      <div className="appointment-info">
        <div className="date-tile">
          <span>LUN.</span>
          <strong>05</strong>
          <span>OCT.</span>
        </div>
        <div>
          <Tag>Orientation</Tag>
          <h3>Parlons de ton projet</h3>
          <p>
            <Clock3 size={14} />
            10:00 – 11:00
          </p>
          <p>
            <MapPin size={14} />
            Bureau BidayaNeet, Agadir
          </p>
        </div>
      </div>
      <div className="mediator-mini">
        <Image
          src="/user-portal/story-amina.jpg"
          alt=""
          width={42}
          height={42}
        />
        <div>
          <b>Imane Rami</b>
          <span>Ta médiatrice</span>
        </div>
        <span className="online-dot" />
      </div>
      <Link href="/neet/messages" className="button button-secondary">
        Préparer mon rendez-vous
        <ArrowRight size={15} />
      </Link>
    </Panel>
  );
}
const tasks = [
  "Finaliser mon CV",
  "Explorer deux opportunités",
  "Préparer mon entretien",
  "Partager mes envies avec Imane",
];
export function NextSteps() {
  const { completed, toggleCompleted } = useYouth();
  return (
    <Panel
      title="Mes prochains petits pas"
      note="À ton rythme, un pas après l’autre."
      href="/neet/micro-actions"
    >
      <div className="task-list">
        {tasks.map((task, id) => (
          <label
            key={task}
            className={`task-row ${completed.includes(id) ? "completed" : ""}`}
          >
            <input
              type="checkbox"
              checked={completed.includes(id)}
              onChange={() => toggleCompleted(id)}
            />
            <span>{task}</span>
            {completed.includes(id) && <Check size={14} />}
          </label>
        ))}
      </div>
      <div className="progress-caption">
        <span>
          {completed.length} sur {tasks.length} réalisés
        </span>
        <span>{Math.round((completed.length / tasks.length) * 100)}%</span>
      </div>
      <progress value={completed.length} max={tasks.length} />
    </Panel>
  );
}
export default function YouthDashboard() {
  const { applications, saved } = useYouth();
  return (
    <>
      <div className="dashboard-grid">
        <div className="dashboard-primary">
          <section className="youth-hero">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="small-dot" />
                TON NOUVEAU DÉPART
              </div>
              <h1>
                Bonjour Yassine<span className="greeting-dot">.</span>
              </h1>
              <h2>Ton avenir commence ici.</h2>
              <p>
                Des opportunités qui te ressemblent.
                <br />
                Un accompagnement à chaque étape.
              </p>
              <Link
                href="/neet/opportunities"
                className="button button-primary"
              >
                Trouver mon prochain pas
                <ArrowRight size={17} />
              </Link>
              <span className="hero-footnote">
                <Sparkles size={13} />
                Tu n’as pas à avancer seul.
              </span>
            </div>
            <Image
              className="hero-illustration"
              src="/user-portal/mountain-progress.jpg"
              alt="Un chemin vers le sommet d’une montagne"
              width={320}
              height={290}
              preload
            />
          </section>
          <Panel className="profile-progress">
            <div className="profile-progress-top">
              <Image
                src="/user-portal/story-khalid.jpg"
                alt=""
                width={52}
                height={52}
              />
              <div>
                <h2>Chaque petit pas compte.</h2>
                <p>Ton profil est presque prêt. Continuons ensemble.</p>
              </div>
              <Tag>Activé</Tag>
            </div>
            <div className="profile-progress-track">
              <progress value={78} max={100} />
              <Link href="/neet/profile">
                78% complété <ArrowRight size={13} />
              </Link>
            </div>
          </Panel>
          <div className="metrics-row">
            <Metric
              label="Opportunités pour toi"
              value={opportunities.length}
              note="Selon tes envies"
              icon={<Compass size={18} />}
            />
            <Metric
              label="Candidatures préparées"
              value={applications.length}
              note="Dans cet espace démo"
              icon={<FileText size={18} />}
            />
            <Metric
              label="Mes favoris"
              value={saved.length}
              note="À explorer à ton rythme"
              icon={<TrendingUp size={18} />}
            />
          </div>
        </div>
        <div className="dashboard-aside">
          <AppointmentCard />
          <NextSteps />
        </div>
      </div>
      <div className="section-heading">
        <div>
          <div className="eyebrow">OUVRE LE CHAMP DES POSSIBLES</div>
          <h2>Des opportunités pour toi</h2>
          <p>Le bon début peut prendre plusieurs formes.</p>
        </div>
        <Link href="/neet/opportunities" className="text-link">
          Toutes les opportunités
          <ArrowRight size={16} />
        </Link>
      </div>
      <div className="opportunity-grid">
        {opportunities.slice(0, 3).map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
      <section className="support-banner">
        <div className="support-banner-icon">
          <MessageCircle size={26} />
        </div>
        <div>
          <h2>Une question, un doute, une envie ?</h2>
          <p>Imane est là pour t’écouter et t’aider à avancer.</p>
        </div>
        <Link href="/neet/messages" className="button button-secondary">
          Parler à ma médiatrice
          <ArrowRight size={16} />
        </Link>
      </section>
      <div className="quiet-note">
        <CalendarDays size={14} />
        Les offres et rendez-vous présentés sont des exemples de démonstration.
      </div>
    </>
  );
}
