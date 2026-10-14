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
import { ArrowRight, Bookmark, MapPin, Clock3 } from "lucide-react";
import { useYouth } from "./YouthProvider";
import { Tag } from "./UI";

export default function OpportunityCard({
  opportunity,
}: {
  opportunity: OpportunityView;
}) {
  const { text: uiText } = useUiTranslation();

  const { opportunities } = useWorkspaceDatasets();

  const { saved, toggleSaved } = useYouth();
  const isSaved = saved.includes(opportunity.id);
  return (
    <article className="opportunity-card">
      <div className="opportunity-image">
        <Image
          src={opportunity.image}
          alt={uiText("")}
          fill
          sizes="(max-width: 650px) 90vw, (max-width: 1100px) 45vw, 30vw"
        />
        <span className="match-chip">
          {opportunity.match}
          <Translated value="% compatible" />
        </span>
        <button
          className={`save-button ${isSaved ? "is-saved" : ""}`}
          aria-label={`${isSaved ? "Retirer des" : "Ajouter aux"} favoris : ${opportunity.title}`}
          aria-pressed={isSaved}
          onClick={() => toggleSaved(opportunity.id)}
        >
          <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="opportunity-content">
        <div>
          <Tag
            tone={
              opportunity.type === "Stage"
                ? "blue"
                : opportunity.type === "Emploi"
                  ? "orange"
                  : "teal"
            }
          >
            {opportunity.type}
          </Tag>
          <span className="org-label">{opportunity.organization}</span>
        </div>
        <h3>
          <Link href={`/neet/opportunities/${opportunity.id}`}>
            {opportunity.title}
          </Link>
        </h3>
        <p>{opportunity.description}</p>
        <div className="card-meta">
          <span>
            <MapPin size={13} />
            {opportunity.location}
          </span>
          <span>
            <Clock3 size={13} />
            {opportunity.duration}
          </span>
        </div>
        <Link
          className="card-action"
          href={`/neet/opportunities/${opportunity.id}`}
        >
          <Translated value="Découvrir l’opportunité" />
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
