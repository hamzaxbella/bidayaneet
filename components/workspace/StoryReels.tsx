"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { useWorkspaceDatasets } from "./LiveProvider";
import type {
  AppointmentView,
  OpportunityView,
  FieldActionView,
} from "@/lib/workspace-data";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from "lucide-react";

export default function StoryReels({ compact = false }: { compact?: boolean }) {
  const { text: uiText } = useUiTranslation();

  const { stories } = useWorkspaceDatasets();

  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const story = selected === null ? null : stories[selected];
  function move(direction: number) {
    setSelected((value) =>
      value === null
        ? 0
        : (value + direction + stories.length) % stories.length,
    );
  }
  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (selected === null) {
      element.close();
      return;
    }
    if (!element.open) {
      element.showModal();
      element
        .querySelector<HTMLButtonElement>(".story-viewer-close")
        ?.focus({ preventScroll: true });
    }
    element.scrollTop = 0;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [selected]);
  return (
    <div className={`reels ${compact ? "reels-compact" : "reels-library"}`}>
      <div className={compact ? "reels-rail" : "reels-grid"} ref={rail}>
        {stories.map((item, index) => (
          <button
            className="reel-card"
            key={item.id}
            onClick={() => setSelected(index)}
            aria-label={`Découvrir le récit de ${item.name}`}
          >
            <Image
              src={item.image}
              alt={uiText("")}
              fill
              sizes={
                compact
                  ? "(max-width: 760px) 62vw, 210px"
                  : "(max-width: 760px) 45vw, 24vw"
              }
            />
            <span className="reel-reading">
              <BookOpen size={12} />
              <Translated value="45 s de lecture" />
            </span>
            <span className="reel-open">
              <ArrowUpRight size={22} />
            </span>
            <span className="reel-copy">
              <span className="reel-location">
                <MapPin size={12} /> {item.city}
              </span>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
              <q>{item.quote}</q>
            </span>
          </button>
        ))}
      </div>
      {compact && (
        <div className="reels-navigation">
          <span>
            <Translated value="Un parcours. Un déclic. Un nouveau départ." />
          </span>
          <div>
            <button
              className="icon-button"
              aria-label={uiText("Histoires précédentes")}
              onClick={() =>
                rail.current?.scrollBy({ left: -260, behavior: "smooth" })
              }
            >
              <ChevronLeft size={17} />
            </button>
            <button
              className="icon-button"
              aria-label={uiText("Histoires suivantes")}
              onClick={() =>
                rail.current?.scrollBy({ left: 260, behavior: "smooth" })
              }
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
      <dialog
        ref={dialog}
        className="story-dialog"
        aria-labelledby="story-viewer-title"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        {story && (
          <div className="story-viewer">
            <div className="story-viewer-visual">
              <Image
                src={story.image}
                alt={`Portrait illustratif de ${story.name}`}
                fill
                sizes="(max-width: 760px) 100vw, 420px"
              />
              <div
                className="story-position"
                aria-label={`Histoire ${(selected ?? 0) + 1} sur ${stories.length}`}
              >
                {stories.map((item, index) => (
                  <span
                    key={item.id}
                    className={index === selected ? "current" : ""}
                  />
                ))}
              </div>
              <span className="story-viewer-city">
                <MapPin size={13} /> {story.city}
              </span>
            </div>
            <div className="story-viewer-content">
              <span className="eyebrow">
                <Translated value="UN PARCOURS INSPIRANT" />
              </span>
              <h2 id="story-viewer-title">
                {story.name}, {story.role.toLocaleLowerCase("fr")}
              </h2>
              <blockquote>« {story.quote} »</blockquote>
              <p>{story.text}</p>
              <p className="story-disclosure">
                <Translated value="Récit de démonstration · portrait créé pour illustrer ce parcours." />
              </p>
              <div className="story-viewer-navigation">
                <button
                  className="button button-secondary"
                  onClick={() => move(-1)}
                >
                  <ArrowUp size={16} />
                  <Translated value="Précédent" />
                </button>
                <button
                  className="button button-primary"
                  onClick={() => move(1)}
                >
                  <Translated value="Suivant" />
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
            <button
              className="story-viewer-close icon-button"
              aria-label={uiText("Fermer l’histoire")}
              onClick={() => setSelected(null)}
            >
              <X size={20} />
            </button>
          </div>
        )}
      </dialog>
    </div>
  );
}
