"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { useRef, useState, type FormEvent } from "react";
import {
  useWorkspace,
  useWorkspaceState as useSimulatedState,
} from "./LiveProvider";
import Image from "next/image";
import { Send } from "lucide-react";
import { PageIntro } from "./UI";

export default function MessagesPage({ role }: { role: "neet" | "mediator" }) {
  const { text: uiText } = useUiTranslation();

  const { data } = useWorkspace();
  const people = data.contacts.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.organization || p.role,
    photo: "/editorial/story-amina.webp",
  }));
  const [selected, setSelected] = useState(people[0]?.id || "");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useSimulatedState<
    Record<
      string,
      { id?: string; senderId?: string; text: string; time: string }[]
    >
  >(`messages.${role}`, {});
  const logRef = useRef<HTMLDivElement>(null);
  const current = people.find((person) => person.id === selected) || {
    id: "",
    name: "Aucun contact",
    subtitle: "",
    photo: "/editorial/assistant-bot.webp",
  };
  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Intl.DateTimeFormat("fr-MA", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
    }).format(new Date());
    setMessages((state) => ({
      ...state,
      [selected]: [
        ...(state[selected] ?? []),
        { id: crypto.randomUUID(), senderId: data.user.id, text, time },
      ],
    }));
    setDraft("");
    requestAnimationFrame(() =>
      logRef.current?.scrollTo({
        top: logRef.current.scrollHeight,
        behavior: "smooth",
      }),
    );
  }
  return (
    <>
      <PageIntro
        eyebrow={uiText("LE LIEN FAIT LA DIFFÉRENCE")}
        title={role === "neet" ? "On reste en contact" : "Mes conversations"}
        description={
          role === "neet"
            ? "Une question ou une nouvelle envie ? Retrouve tes échanges ici."
            : "Accompagne les jeunes et coordonne les prochaines étapes avec les partenaires."
        }
      />
      <div className="messages-layout">
        <aside
          className="conversation-list"
          aria-label={uiText("Conversations")}
        >
          <h2>
            <Translated value="Conversations" />
          </h2>
          {people.map((person) => (
            <button
              key={person.id}
              className={`conversation-button ${selected === person.id ? "selected" : ""}`}
              aria-pressed={selected === person.id}
              onClick={() => {
                setSelected(person.id);
                setDraft("");
              }}
            >
              <Image
                src={person.photo}
                alt={uiText("")}
                width={38}
                height={38}
              />
              <span>
                <b>{person.name}</b>
                <small>{person.subtitle}</small>
              </span>
            </button>
          ))}
        </aside>
        <section
          className="conversation-content"
          aria-label={`Conversation avec ${current.name}`}
        >
          <div className="conversation-header">
            <Image
              src={current.photo}
              alt={uiText("")}
              width={38}
              height={38}
            />
            <div>
              <h2>{current.name}</h2>
              <p>{current.subtitle}</p>
            </div>
          </div>
          <div
            className="chat-messages"
            role="log"
            aria-live="polite"
            ref={logRef}
          >
            <div className="chat-date">
              <Translated value="Échanges enregistrés" />
            </div>
            {(messages[selected] ?? []).map((message, index) => (
              <div
                className={`chat-bubble ${message.senderId === data.user.id ? "self" : ""}`}
                key={message.id || `${selected}-${index}`}
              >
                {message.text}
                <small>{message.time}</small>
              </div>
            ))}
          </div>
          <form className="chat-compose" onSubmit={send}>
            <textarea
              aria-label={uiText("Votre message")}
              className="field-input"
              placeholder={uiText("Écris ton message…")}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={3000}
              rows={1}
            />
            <button
              className="button button-primary"
              aria-label={uiText("Envoyer le message")}
              disabled={!draft.trim()}
            >
              <Send size={17} />
            </button>
          </form>
          <p className="chat-demo-note">
            <Translated value="Les messages sont partagés avec le contact sélectionné dans la plateforme." />
          </p>
        </section>
      </div>
    </>
  );
}
