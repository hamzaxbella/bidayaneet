"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { PageIntro } from "./UI";

export default function MessagesPage({ role }: { role: "neet" | "mediator" }) {
  const people =
    role === "neet"
      ? [
          {
            id: "imane",
            name: "Imane Rami",
            subtitle: "Ta médiatrice · Agadir",
            photo: "/user-portal/story-amina.jpg",
            initial:
              "Bonjour Yassine ! Pour notre prochain rendez-vous, prépare les métiers qui t’intéressent. Nous regarderons les formations ensemble.",
          },
          {
            id: "team",
            name: "Équipe BidayaNeet",
            subtitle: "Conseils & accompagnement",
            photo: "/user-portal/assistant-bot.jpg",
            initial:
              "Bienvenue dans ton espace ! Les petits pas sont là pour t’aider à avancer à ton rythme.",
          },
        ]
      : [
          {
            id: "yassine",
            name: "Yassine El Amrani",
            subtitle: "Activé · Agadir",
            photo: "/user-portal/story-khalid.jpg",
            initial:
              "Bonjour Imane, la formation en développement web m’intéresse. Est-ce qu’on peut en parler à notre rendez-vous ?",
          },
          {
            id: "fatima",
            name: "Fatima Zahra A.",
            subtitle: "Orientation · Inezgane",
            photo: "/user-portal/story-fatima.jpg",
            initial:
              "Bonjour, j’ai préparé mon CV pour le stage. Pourrais-tu m’aider à préparer l’entretien ?",
          },
          {
            id: "partner",
            name: "OFPPT Souss-Massa",
            subtitle: "Organisme partenaire",
            photo: "/logos/ofppt.png",
            initial:
              "Bonjour Imane, la prochaine session d’orientation dispose de places. Quels profils souhaites-tu nous présenter ?",
          },
        ];
  const [selected, setSelected] = useState(people[0].id);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<
    Record<string, { text: string; time: string }[]>
  >({});
  const logRef = useRef<HTMLDivElement>(null);
  const current = people.find((person) => person.id === selected)!;
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
      [selected]: [...(state[selected] ?? []), { text, time }],
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
        eyebrow="LE LIEN FAIT LA DIFFÉRENCE"
        title={role === "neet" ? "On reste en contact" : "Mes conversations"}
        description={
          role === "neet"
            ? "Une question ou une nouvelle envie ? Retrouve tes échanges ici."
            : "Accompagne les jeunes et coordonne les prochaines étapes avec les partenaires."
        }
      />
      <div className="messages-layout">
        <aside className="conversation-list" aria-label="Conversations">
          <h2>Conversations</h2>
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
              <Image src={person.photo} alt="" width={38} height={38} />
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
            <Image src={current.photo} alt="" width={38} height={38} />
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
            <div className="chat-date">Conversation de démonstration</div>
            <div className="chat-bubble">
              {current.initial}
              <small>09:40 · Exemple</small>
            </div>
            <div className="chat-bubble self">
              Merci, à bientôt !<small>09:45 · Exemple</small>
            </div>
            {(messages[selected] ?? []).map((message, index) => (
              <div className="chat-bubble self" key={`${selected}-${index}`}>
                {message.text}
                <small>{message.time} · Démo locale</small>
              </div>
            ))}
          </div>
          <form className="chat-compose" onSubmit={send}>
            <textarea
              aria-label="Votre message"
              className="field-input"
              placeholder="Écris ton message…"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              maxLength={3000}
              rows={1}
            />
            <button
              className="button button-primary"
              aria-label="Ajouter le message à la démonstration"
              disabled={!draft.trim()}
            >
              <Send size={17} />
            </button>
          </form>
          <p className="chat-demo-note">
            Messages de démonstration. Aucun message n’est envoyé à une personne
            réelle.
          </p>
        </section>
      </div>
    </>
  );
}
