"use client";

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
import { arabicStories as stories } from "@/lib/youth-ar";

export default function StoryReels({ compact = false }: { compact?: boolean }) {
  const [start, setStart] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
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
      <div className="reels-grid youth-reels-four">
        {stories.slice(start, start + 4).map((item, index) => (
          <button
            className="reel-card"
            key={item.id}
            onClick={() => setSelected(start + index)}
            aria-label={`اكتشف قصة ${item.name}`}
          >
            <Image
              src={item.image}
              alt=""
              fill
              sizes={
                compact
                  ? "(max-width: 760px) 62vw, 210px"
                  : "(max-width: 760px) 45vw, 24vw"
              }
            />
            <span className="reel-reading">
              <BookOpen size={12} /> قصة في 45 ثانية
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
      {
        <div className="reels-navigation">
          <span>القصص {start + 1}–{start + 4} من {stories.length}</span>
          <div>
            <button
              className="icon-button"
              aria-label="القصص السابقة"
              disabled={start === 0}
              onClick={() => setStart((value) => Math.max(0, value - 2))}
            >
              <ChevronRight size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="القصص التالية"
              disabled={start >= stories.length - 4}
              onClick={() =>
                setStart((value) => Math.min(stories.length - 4, value + 2))
              }
            >
              <ChevronLeft size={17} />
            </button>
          </div>
        </div>
      }
      <dialog
        ref={dialog}
        className="story-dialog"
        dir="rtl"
        lang="ar"
        aria-labelledby="story-viewer-title"
        onCancel={() => setSelected(null)}
        onClose={() => setSelected(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowUp" || event.key === "ArrowRight") {
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
                alt={`صورة توضيحية لـ ${story.name}`}
                fill
                sizes="(max-width: 760px) 100vw, 420px"
              />
              <div
                className="story-position"
                aria-label={`قصة ${(selected ?? 0) + 1} من ${stories.length}`}
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
              <span className="eyebrow">مسار يلهمك</span>
              <h2 id="story-viewer-title">
                {story.name}، {story.role}
              </h2>
              <blockquote>« {story.quote} »</blockquote>
              <p>{story.text}</p>
              <p className="story-disclosure">
                قصة تجريبية وصورة توضيحية لهذا المسار.
              </p>
              <div className="story-viewer-navigation">
                <button
                  className="button button-secondary"
                  onClick={() => move(-1)}
                >
                  <ArrowUp size={16} /> السابق
                </button>
                <button
                  className="button button-primary"
                  onClick={() => move(1)}
                >
                  التالي <ArrowDown size={16} />
                </button>
              </div>
            </div>
            <button
              className="story-viewer-close icon-button"
              aria-label="إغلاق القصة"
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
