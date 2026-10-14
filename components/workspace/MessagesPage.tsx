"use client";

import { useRef, useState, type FormEvent } from "react";
import { useSimulatedState } from "@/lib/simulated-backend";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ArrowDown, ArrowLeft, MessageCircle, Search, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupTextarea,
  InputGroupButton,
} from "@/components/ui/input-group";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import {
  Message,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent } from "@/components/ui/marker";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import "./messages-page.css";

const youthContacts = [
  {
    id: "imane",
    name: "إيمان رامي",
    subtitle: "مرافقتك · أكادير",
    photo: "/editorial/story-amina.webp",
    initial:
      "مرحباً ياسين! قبل موعدنا القادم، حضّر أسماء المهن التي تهمّك. سنبحث معاً عن التكوين المناسب لك.",
  },
  {
    id: "team",
    name: "فريق بداية نيت",
    subtitle: "نصائح ومرافقة",
    photo: "/editorial/assistant-bot.webp",
    initial:
      "مرحباً بك في مساحتك! الخطوات الصغيرة تساعدك على التقدّم حسب إيقاعك.",
  },
];
const mediatorContacts = [
  {
    id: "yassine",
    name: "Yassine El Amrani",
    subtitle: "Activé · Agadir",
    photo: "/editorial/story-khalid.webp",
    initial:
      "Bonjour Imane, la formation en développement web m’intéresse. Est-ce qu’on peut en parler à notre rendez-vous ?",
  },
  {
    id: "fatima",
    name: "Fatima Zahra A.",
    subtitle: "Orientation · Inezgane",
    photo: "/editorial/story-fatima.webp",
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

export default function MessagesPage({ role }: { role: "neet" | "mediator" }) {
  const arabic = role === "neet";
  const people = arabic ? youthContacts : mediatorContacts;
  const [selected, setSelected] = useSimulatedState(
    `messages.selected.${role}`,
    people[0].id,
  );
  const [drafts, setDrafts] = useSimulatedState<Record<string, string>>(
    `messages.drafts.${role}`,
    {},
  );
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const contactsRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useSimulatedState(`messages.search.${role}`, "");
  const [mobileConversation, setMobileConversation] = useState(false);
  const [messages, setMessages] = useSimulatedState<
    Record<string, { text: string; time: string }[]>
  >(`messages.${role}`, {});
  const current = people.find((person) => person.id === selected) ?? people[0];
  const activeId = current.id;
  const draft = drafts[activeId] ?? "";
  const filtered = people.filter((person) =>
    `${person.name} ${person.subtitle}`
      .toLocaleLowerCase()
      .includes(query.trim().toLocaleLowerCase()),
  );
  const [announcement, setAnnouncement] = useState("");
  const t = arabic
    ? {
        title: "الرسائل",
        conversations: "المحادثات",
        search: "البحث في المحادثات",
        searchPlaceholder: "اسم أو مدينة…",
        empty: "لا توجد محادثة مطابقة",
        emptyDescription: "جرّب اسماً آخر أو امسح البحث.",
        clearSearch: "مسح البحث",
        back: "العودة إلى المحادثات",
        conversation: "محادثة مع",
        sample: "محادثة تجريبية",
        initialReply: "شكراً، إلى اللقاء!",
        message: "رسالتك",
        placeholder: "اكتب رسالتك…",
        send: "إضافة الرسالة إلى المحادثة التجريبية",
        example: "مثال",
        local: "محفوظة على هذا الجهاز",
        note: "تجربة محفوظة على جهازك. لا تُرسل إلى أشخاص حقيقيين.",
        saved: "حُفظت رسالتك على هذا الجهاز.",
        shortcut: "اضغط إدخال للإرسال، أو إزاحة مع إدخال لسطر جديد.",
        demo: "مساحة تجريبية",
        latest: "أحدث الرسائل",
      }
    : {
        title: "Messages",
        conversations: "Conversations",
        search: "Rechercher une conversation",
        searchPlaceholder: "Un nom, une ville…",
        empty: "Aucune conversation correspondante",
        emptyDescription: "Essaie un autre nom ou efface la recherche.",
        clearSearch: "Effacer la recherche",
        back: "Retour aux conversations",
        conversation: "Conversation avec",
        sample: "Conversation de démonstration",
        initialReply: "Merci, à bientôt !",
        message: "Votre message",
        placeholder: "Écris ton message…",
        send: "Ajouter le message à la démonstration",
        example: "Exemple",
        local: "Démo locale",
        note: "Démo enregistrée ici. Aucun message n’est envoyé à une personne réelle.",
        saved: "Message enregistré sur cet appareil.",
        shortcut: "Entrée pour envoyer · Maj + Entrée pour une nouvelle ligne",
        demo: "Démonstration",
        latest: "Derniers messages",
      };
  function send(event: FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Intl.DateTimeFormat(arabic ? "ar-MA" : "fr-MA", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Casablanca",
    }).format(new Date());
    setMessages((state) => ({
      ...state,
      [activeId]: [...(state[activeId] ?? []), { text, time }],
    }));
    setDrafts((state) => ({ ...state, [activeId]: "" }));
    setAnnouncement(t.saved);
    composerRef.current?.focus({ preventScroll: true });
  }
  const transcript = [
    {
      id: "greeting",
      text: current.initial,
      time: arabic ? "٠٩:٤٠" : "09:40",
      self: false,
    },
    {
      id: "example-reply",
      text: t.initialReply,
      time: arabic ? "٠٩:٤٥" : "09:45",
      self: true,
    },
    ...(messages[activeId] ?? []).map((message, index) => ({
      id: `local-${index}`,
      text: message.text,
      time: message.time,
      self: true,
    })),
  ];
  return (
    <div
      className={cn(
        "messenger-page",
        mobileConversation && "messenger-thread-open",
      )}
      dir={arabic ? "rtl" : "ltr"}
      lang={arabic ? "ar" : "fr"}
    >
      <h1 className="sr-only">{t.title}</h1>
      <aside className="messenger-contacts" aria-label={t.conversations}>
        <header className="messenger-list-header">
          <div>
            <MessageCircle size={20} />
            <h2>{t.conversations}</h2>
          </div>
          <Badge variant="secondary">{people.length}</Badge>
        </header>
        <div className="messenger-search">
          <InputGroup>
            <InputGroupInput
              ref={contactsRef}
              aria-label={t.search}
              placeholder={t.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            {query && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton size="icon-sm" aria-label={t.clearSearch} onClick={() => { setQuery(""); contactsRef.current?.focus(); }}>
                  <X />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
        </div>
        <div className="messenger-contact-scroll">
          {filtered.map((person) => (
            <Button
              key={person.id}
              variant={activeId === person.id ? "secondary" : "ghost"}
              className="messenger-contact"
              aria-pressed={activeId === person.id}
              onClick={() => {
                setSelected(person.id);
                setMobileConversation(true);
              }}
            >
              <Image src={person.photo} alt="" width={44} height={44} />
              <span>
                <b>{person.name}</b>
                <small>{person.subtitle}</small>
                <span className="messenger-preview">
                  {messages[person.id]?.at(-1)?.text ?? person.initial}
                </span>
              </span>
            </Button>
          ))}
          {!filtered.length && (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>{t.empty}</EmptyTitle>
                <EmptyDescription>{t.emptyDescription}</EmptyDescription>
              </EmptyHeader>
              <Button variant="outline" onClick={() => { setQuery(""); contactsRef.current?.focus(); }}>{t.clearSearch}</Button>
            </Empty>
          )}
        </div>
      </aside>
      <section
        className="messenger-thread"
        aria-label={`${t.conversation} ${current.name}`}
      >
        <header className="messenger-thread-header">
          <Button
            variant="ghost"
            size="icon"
            className="messenger-back"
            aria-label={t.back}
            onClick={() => {
              setMobileConversation(false);
              requestAnimationFrame(() => contactsRef.current?.focus({ preventScroll: true }));
            }}
          >
            <ArrowLeft />
          </Button>
          <Image src={current.photo} alt="" width={44} height={44} />
          <div>
            <h2>{current.name}</h2>
            <p>{current.subtitle}</p>
          </div>
          <Badge className="messenger-demo-badge" variant="outline">
            {t.demo}
          </Badge>
        </header>
        <MessageScrollerProvider
          key={activeId}
          autoScroll
          defaultScrollPosition="end"
        >
          <MessageScroller className="messenger-scroller">
            <MessageScrollerViewport
              className="messenger-viewport"
              aria-label={`${t.conversation} ${current.name}`}
            >
              <MessageScrollerContent
                className="messenger-transcript"
                aria-live="polite"
                aria-label={`${t.conversation} ${current.name}`}
              >
                <MessageScrollerItem messageId="date">
                  <Marker variant="separator">
                    <MarkerContent>{t.sample}</MarkerContent>
                  </Marker>
                </MessageScrollerItem>
                {transcript.map((message) => (
                  <MessageScrollerItem key={message.id} messageId={message.id}>
                    <Message align={message.self ? "end" : "start"}>
                      <MessageContent>
                        <Bubble
                          variant={message.self ? "tinted" : "muted"}
                          align={message.self ? "end" : "start"}
                        >
                          <BubbleContent>
                            <span dir="auto">{message.text}</span>
                          </BubbleContent>
                        </Bubble>
                        <MessageFooter><bdi>{message.time}</bdi></MessageFooter>
                      </MessageContent>
                    </Message>
                  </MessageScrollerItem>
                ))}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton aria-label={t.latest}>
              <ArrowDown aria-hidden="true" />
              <span className="sr-only">{t.latest}</span>
            </MessageScrollerButton>
          </MessageScroller>
        </MessageScrollerProvider>
        <form className="messenger-composer" onSubmit={send}>
          <InputGroup>
            <InputGroupTextarea
              ref={composerRef}
              aria-label={t.message}
              aria-describedby={`message-note-${role} message-keyboard-${role}`}
              dir="auto"
              placeholder={t.placeholder}
              value={draft}
              onChange={(event) =>
                setDrafts((current) => ({
                  ...current,
                  [activeId]: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              maxLength={3000}
              rows={1}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                type="submit"
                variant="default"
                size="sm"
                aria-label={t.send}
                disabled={!draft.trim()}
              >
                <Send data-icon="inline-start" />
                {arabic ? "إرسال" : "Envoyer"}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <p id={`message-note-${role}`}>{t.note}</p>
          <span id={`message-keyboard-${role}`} className="sr-only">{t.shortcut}</span>
          <span className="sr-only" role="status">{announcement}</span>
        </form>
      </section>
    </div>
  );
}
