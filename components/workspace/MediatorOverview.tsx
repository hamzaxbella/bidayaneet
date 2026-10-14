"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { useWorkspaceDatasets } from "./LiveProvider";
import type {
  AppointmentView,
  OpportunityView,
  FieldActionView,
} from "@/lib/workspace-data";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import { useWorkspaceState as useSimulatedState } from "./LiveProvider";
import { EmptyState, Panel, Tag } from "./UI";

export default function MediatorOverview() {
  const { text: uiText } = useUiTranslation();

  const { appointmentFixtures, profileFixtures, youngPeople } =
    useWorkspaceDatasets();

  const [profile] = useSimulatedState(
    "mediator.profile",
    profileFixtures.mediator,
  );
  const [appointments] = useSimulatedState(
    "mediator.appointments",
    appointmentFixtures,
  );
  const pending = appointments
    .filter((item) => !item.done)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const priorities = youngPeople.filter(
    (person) => person.priority === "Prioritaire",
  );
  return (
    <>
      <header className="mediator-day-header">
        <div>
          <span className="eyebrow">
            <Translated value="L’ESSENTIEL DE TA JOURNÉE" />
          </span>
          <h1>
            <Translated value="Bonjour" />
            {profile.firstName} <span>👋</span>
          </h1>
          <p>
            <Translated value="Des liens à renforcer. Des premiers pas à préparer." />
          </p>
        </div>
        <Link href="/mediator/appointments" className="button button-primary">
          <CalendarDays size={16} />
          <Translated value="Ouvrir mon agenda" />
        </Link>
      </header>
      <div className="mediator-status-strip">
        <div>
          <Users size={18} />
          <strong>{youngPeople.length}</strong>
          <span>
            <Translated value="jeunes accompagnés" />
          </span>
        </div>
        <div>
          <ShieldCheck size={18} />
          <strong>{priorities.length}</strong>
          <span>
            <Translated value="suivis prioritaires" />
          </span>
        </div>
        <div>
          <CalendarDays size={18} />
          <strong>{pending.length}</strong>
          <span>
            <Translated value="rendez-vous en attente" />
          </span>
        </div>
        <div>
          <Target size={18} />
          <strong>
            {youngPeople.filter((person) => person.stage === "Intégré").length}
          </strong>
          <span>
            <Translated value="parcours intégré" />
          </span>
        </div>
      </div>
      <div className="mediator-command-grid">
        <div className="stack">
          <Panel
            title={uiText("Le fil de tes rendez-vous")}
            note={uiText("Prépare une rencontre à la fois.")}
            href="/mediator/appointments"
            className="agenda-panel"
          >
            {pending.slice(0, 3).map((appointment, index) => (
              <div className="agenda-entry" key={appointment.id}>
                <div className="agenda-clock">
                  <strong>{appointment.time}</strong>
                  <span>
                    {new Intl.DateTimeFormat("fr", {
                      day: "numeric",
                      month: "short",
                      timeZone: "UTC",
                    }).format(new Date(appointment.date + "T12:00:00Z"))}
                  </span>
                </div>
                <div>
                  <span className="agenda-order">
                    <Translated value="RENCONTRE" />
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{appointment.type}</h3>
                  <p>{appointment.name}</p>
                  <small>
                    <MapPin size={12} /> {appointment.location}
                  </small>
                </div>
                <Link
                  href="/mediator/appointments"
                  className="icon-button"
                  aria-label={`Préparer le rendez-vous de ${appointment.name}`}
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
            {!pending.length && (
              <EmptyState
                title={uiText("Ton agenda est à jour")}
                description={uiText(
                  "Ajoute un rendez-vous pour préparer ta prochaine rencontre.",
                )}
              />
            )}
          </Panel>
          <Panel
            title={uiText("Un contact peut tout changer")}
            note={uiText("Les jeunes qui ont besoin de ton attention.")}
            href="/mediator/caseload"
            className="priority-panel"
          >
            {priorities.map((person) => (
              <div className="person-row" key={person.id}>
                <Image
                  src={person.photo}
                  alt={uiText("")}
                  width={46}
                  height={46}
                />
                <div>
                  <h3>{person.name}</h3>
                  <p>
                    {person.city} · {person.blocker}
                  </p>
                </div>
                <Tag tone="orange">
                  <Translated value="Prioritaire" />
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
          <article className="field-feature">
            <div className="field-feature-photo">
              <Image
                src="/editorial/mediator-field.webp"
                alt={uiText("Rencontre de proximité dans le Souss-Massa")}
                fill
                sizes="(max-width: 760px) 90vw, 38vw"
              />
              <span>
                <MapPin size={12} />
                <Translated value="SOUSS-MASSA" />
              </span>
            </div>
            <div className="field-feature-copy">
              <span className="eyebrow">
                <Translated value="LE TERRAIN CRÉE LE LIEN" />
              </span>
              <h2>
                <Translated value="La prochaine rencontre peut tout changer." />
              </h2>
              <p>
                <Translated value="Prépare un atelier, retrouve les participants et construis un premier pas concret." />
              </p>
              <Link href="/mediator/micro-actions" className="text-link">
                <Translated value="Préparer les actions de terrain" />
                <ArrowRight size={15} />
              </Link>
            </div>
          </article>
          <Panel
            title={uiText("Les parcours avancent")}
            note={uiText("Une progression, à chaque rencontre.")}
            href="/mediator/caseload"
            className="progression-panel"
          >
            {youngPeople.slice(0, 3).map((person) => (
              <Link
                className="progression-row"
                key={person.id}
                href={`/mediator/caseload/${person.id}`}
              >
                <Image
                  src={person.photo}
                  alt={uiText("")}
                  width={34}
                  height={34}
                />
                <div>
                  <b>{person.name}</b>
                  <span>{person.stage}</span>
                  <progress
                    value={person.progress}
                    max={100}
                    aria-label={`Progression de ${person.name}`}
                  />
                </div>
                <strong>{person.progress}%</strong>
              </Link>
            ))}
          </Panel>
        </div>
      </div>
    </>
  );
}
