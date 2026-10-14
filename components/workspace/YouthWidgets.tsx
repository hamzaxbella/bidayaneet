"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { useWorkspace } from "./LiveProvider";
import Link from "next/link";
import { ArrowRight, Check, Clock3, MapPin } from "lucide-react";
import { Panel, Tag } from "./UI";
import { useYouth } from "./YouthProvider";

export function AppointmentCard() {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace();
  const now=new Date(data.now).getTime();
  const appointment = data.appointments.find(
    (a) =>
      new Date(a.starts_at).getTime() >= now &&
      !(a as typeof a & { completed?: boolean }).completed,
  );
  const mediator = data.contacts.find((c) => c.role === "mediator");
  const date = appointment ? new Date(appointment.starts_at) : null;
  return (
    <Panel title={uiText("Prochain rendez-vous")} className="appointment-panel">
      {appointment && date ? (
        <div className="appointment-info">
          <div className="date-tile">
            <span>
              {date.toLocaleDateString("fr-MA", {
                weekday: "short",
                timeZone: "Africa/Casablanca",
              })}
            </span>
            <strong>
              {date.toLocaleDateString("fr-MA", {
                day: "2-digit",
                timeZone: "Africa/Casablanca",
              })}
            </strong>
            <span>
              {date.toLocaleDateString("fr-MA", {
                month: "short",
                timeZone: "Africa/Casablanca",
              })}
            </span>
          </div>
          <div>
            <Tag>
              <Translated value="Rendez-vous confirmé" />
            </Tag>
            <h3>{appointment.title}</h3>
            <p>
              <Clock3 size={14} />
              {date.toLocaleTimeString("fr-MA", {
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Africa/Casablanca",
              })}
            </p>
            <p>
              <MapPin size={14} />
              {appointment.location}
            </p>
          </div>
        </div>
      ) : (
        <p>
          <Translated value="Aucun rendez-vous à venir. Contacte ton médiateur pour préparer la prochaine rencontre." />
        </p>
      )}
      {mediator && (
        <div className="mediator-mini">
          <div>
            <b>{mediator.name}</b>
            <span>
              <Translated value="Ton médiateur" />
            </span>
          </div>
        </div>
      )}
      <Link href="/neet/messages" className="button button-secondary">
        <Translated value="Contacter mon médiateur" />
        <ArrowRight size={15} />
      </Link>
    </Panel>
  );
}
const tasks = [
  "Finaliser mon CV",
  "Explorer deux opportunités",
  "Préparer mon entretien",
  "Partager mes envies avec mon médiateur",
];
export function NextSteps() {
  const { text: uiText } = useUiTranslation();

  const { completed, toggleCompleted } = useYouth();
  return (
    <Panel
      title={uiText("Mes prochains petits pas")}
      note={uiText("À ton rythme, un pas après l’autre.")}
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
          {completed.length}
          <Translated value="sur" />
          {tasks.length}
          <Translated value="réalisés" />
        </span>
        <span>{Math.round((completed.length / tasks.length) * 100)}%</span>
      </div>
      <progress value={completed.length} max={tasks.length} />
    </Panel>
  );
}
