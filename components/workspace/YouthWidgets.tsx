"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock3, MapPin } from "lucide-react";
import { Panel, Tag } from "./UI";
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
          src="/editorial/story-amina.webp"
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
