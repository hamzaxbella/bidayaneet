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
import { ArrowRight, CalendarDays, Check, Clock3, MapPin } from "lucide-react";
import { useYouth } from "./YouthProvider";

type Action = FieldActionView;
export default function MicroActionCard({
  action,
  compact = false,
}: {
  action: Action;
  compact?: boolean;
}) {
  const { text: uiText } = useUiTranslation();

  const { enrolled, toggleEnrolled } = useYouth();
  const chosen = enrolled.includes(action.id);
  return (
    <article
      className={`action-visual ${compact ? "action-visual-compact" : ""} ${chosen ? "is-selected" : ""}`}
    >
      <Image
        src={action.image}
        alt={uiText("")}
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
              <Check size={15} />
              <Translated value="Annuler ma sélection" />
            </>
          ) : (
            <>
              {action.category === "À ton rythme"
                ? "Choisir ce petit pas"
                : "M’inscrire"}
              <ArrowRight size={15} />
            </>
          )}
        </button>
        {chosen && (
          <small role="status">
            <Translated value="Sélection enregistrée sur cet appareil." />
          </small>
        )}
      </div>
    </article>
  );
}
