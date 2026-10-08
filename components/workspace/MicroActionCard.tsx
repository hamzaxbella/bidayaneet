"use client";

import Image from "next/image";
import { ArrowRight, CalendarDays, Check, Clock3, MapPin } from "lucide-react";
import { fieldActions } from "@/lib/demo-data";
import { useYouth } from "./YouthProvider";

type Action = (typeof fieldActions)[number];
export default function MicroActionCard({
  action,
  compact = false,
}: {
  action: Action;
  compact?: boolean;
}) {
  const { enrolled, toggleEnrolled } = useYouth();
  const chosen = enrolled.includes(action.id);
  return (
    <article
      className={`action-visual ${compact ? "action-visual-compact" : ""} ${chosen ? "is-selected" : ""}`}
    >
      <Image
        src={action.image}
        alt=""
        fill
        sizes={
          compact
            ? "(max-width: 760px) 90vw, 25vw"
            : "(max-width: 760px) 90vw, 45vw"
        }
      />
      <div className="action-visual-top">
        <span>{action.category}</span>
        <span>
          <Clock3 size={12} /> {action.duration}
        </span>
      </div>
      <div className="action-visual-copy">
        <h3>{action.title}</h3>
        {!compact && <p>{action.description}</p>}
        <div className="action-visual-meta">
          <span>
            <CalendarDays size={13} /> {action.date}
          </span>
          <span>
            <MapPin size={13} /> {action.city}
          </span>
        </div>
        <button
          className="button"
          aria-pressed={chosen}
          onClick={() => toggleEnrolled(action.id)}
        >
          {chosen ? (
            <>
              <Check size={15} /> Annuler ma sélection
            </>
          ) : (
            <>
              {action.category === "À ton rythme"
                ? "Choisir ce petit pas"
                : "M’inscrire en démo"}
              <ArrowRight size={15} />
            </>
          )}
        </button>
        {chosen && (
          <small role="status">Sélection enregistrée sur cet appareil.</small>
        )}
      </div>
    </article>
  );
}
