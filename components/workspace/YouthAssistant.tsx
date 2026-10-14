"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowDown, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Message, MessageContent } from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
  useMessageScroller,
} from "@/components/ui/message-scroller";
import { useSimulatedState } from "@/lib/simulated-backend";
type ChatMessage = { id: string; sender: "assistant" | "user"; text: string };
const initial: ChatMessage[] = [
  {
    id: "welcome",
    sender: "assistant",
    text: "أهلاً بك! أنا مساعد بداية. أرافقك بخطوات بسيطة. ما الذي تريد أن تبدأ به اليوم؟",
  },
];
const suggestions = [
  "أبحث عن تكوين",
  "كيف أجهّز سيرتي الذاتية؟",
  "أحتاج إلى توجيه",
];
function answer(text: string) {
  if (/سيرة|سيرتي|cv/i.test(text))
    return "ابدأ بمعلومات التواصل، ثم المهارات والتجارب حتى لو كانت بسيطة. يمكنك اختيار ملف PDF في «ملفي» أو التسجيل في ورشة السيرة الذاتية ضمن «خطوات صغيرة».";
  if (/تكوين|تدريب|عمل|فرص/.test(text))
    return "افتح صفحة «فرصي» واختر نوع الفرصة والمدينة. احفظ ما يناسبك، ثم افتح التفاصيل لتحضير ترشيحك. يمكن لإيمان مساعدتك في الاختيار.";
  if (/موعد|إيمان|وسيط|توجيه/.test(text))
    return "لا تحتاج إلى معرفة كل الإجابات الآن. دوّن ما تحب وما يصعب عليك، ثم افتح «الرسائل» للتحدّث مع إيمان وتحديد خطوتك المقبلة.";
  if (/شكرا|شكراً/.test(text))
    return "على الرحب والسعة! كل خطوة صغيرة تقرّبك من هدفك. أنا هنا عندما تحتاج إلى مساعدة.";
  return "يمكنني إرشادك للفرص أو السيرة الذاتية أو المواكبة. اختر سؤالاً مقترحاً، أو تواصل مع إيمان من صفحة الرسائل للحصول على مساعدة تناسب وضعك.";
}
function AssistantScrollSync({ latestId }: { latestId?: string }) {
  const { scrollToEnd } = useMessageScroller();
  useEffect(() => { scrollToEnd({ behavior: "auto" }); }, [latestId, scrollToEnd]);
  return null;
}
export function openYouthAssistant() {
  window.dispatchEvent(new CustomEvent("bidaya:open-assistant", { detail: document.activeElement }));
}
export default function YouthAssistant({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useSimulatedState<ChatMessage[]>(
    "neet.assistant.messages",
    initial,
  );
  const panel = useRef<HTMLDivElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const show = (event: Event) => {
      const origin = (event as CustomEvent).detail;
      returnFocus.current = origin instanceof HTMLElement ? origin : launcher.current;
      setOpen(true);
    };
    window.addEventListener("bidaya:open-assistant", show);
    return () => window.removeEventListener("bidaya:open-assistant", show);
  }, []);
  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        returnFocus.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);
  useEffect(() => {
    if (!open || !panel.current) return;
    const media = gsap.matchMedia();
    media.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        gsap.fromTo(
          panel.current,
          { autoAlpha: 0, y: 22, scale: 0.96 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: context.conditions?.reduced ? 0 : 0.35,
            ease: "power3.out",
            onComplete: () => input.current?.focus(),
          },
        );
      },
      panel,
    );
    return () => media.revert();
  }, [open]);
  function close() {
    setOpen(false);
    returnFocus.current?.focus();
  }
  function send(text: string) {
    if (!text.trim()) return;
    const id = crypto.randomUUID();
    setMessages((current) => [
      ...current,
      { id, sender: "user", text: text.trim().slice(0, 1000) },
      { id: `${id}-reply`, sender: "assistant", text: answer(text) },
    ]);
    setDraft("");
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    send(draft);
  }
  return (
    <div className={`youth-assistant${compact ? " youth-assistant-compact" : ""}`} dir="rtl" lang="ar">
      {open && (
        <div
          id="youth-assistant-panel"
          ref={panel}
          className="youth-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="assistant-title"
          aria-describedby="assistant-description"
          onKeyDown={(event) => {
            if (event.key === "Escape") close();
          }}
        >
          <MessageScrollerProvider autoScroll>
          <Card>
            <CardHeader>
              <div className="youth-assistant-title">
                <Sparkles />
                <CardTitle id="assistant-title">مساعد بداية</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="إغلاق المساعد"
                  onClick={close}
                >
                  <X />
                </Button>
              </div>
              <CardDescription id="assistant-description">
                إجابات إرشادية جاهزة · محادثة تجريبية
              </CardDescription>
            </CardHeader>
            <CardContent className="youth-assistant-conversation">
                <MessageScroller>
                  <MessageScrollerViewport aria-label="محادثتك مع مساعد بداية">
                    <MessageScrollerContent>
                      {messages.map((message) => (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                        >
                          <Message
                            align={message.sender === "user" ? "end" : "start"}
                          >
                            <MessageContent>
                              <Bubble
                                variant={
                                  message.sender === "user"
                                    ? "default"
                                    : "secondary"
                                }
                                align={
                                  message.sender === "user" ? "end" : "start"
                                }
                              >
                                <BubbleContent>{message.text}</BubbleContent>
                              </Bubble>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      ))}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton aria-label="الانتقال إلى أحدث رسالة"><ArrowDown aria-hidden="true" /></MessageScrollerButton>
                </MessageScroller>
            </CardContent>
            <CardFooter className="youth-assistant-footer">
              <div className="youth-assistant-suggestions">
                {suggestions.map((item) => (
                  <Button
                    variant="outline"
                    size="sm"
                    key={item}
                    onClick={() => send(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              <form onSubmit={submit}>
                <Field>
                  <FieldLabel htmlFor="assistant-message" className="sr-only">
                    رسالتك للمساعد
                  </FieldLabel>
                  <Input
                    ref={input}
                    id="assistant-message"
                    placeholder="اكتب رسالتك…"
                    value={draft}
                    maxLength={1000}
                    onChange={(event) => setDraft(event.target.value)}
                  />
                </Field>
                <Button
                  type="submit"
                  size="icon"
                  aria-label="إرسال للمساعد"
                  disabled={!draft.trim()}
                >
                  <Send />
                </Button>
              </form>
              <Link href="/neet/messages" className="text-link" onClick={close}>
                تواصل مع إيمان
              </Link>
            </CardFooter>
            <AssistantScrollSync latestId={messages.at(-1)?.id} />
          </Card>
          </MessageScrollerProvider>
        </div>
      )}
      <Button
        ref={launcher}
        className="youth-assistant-launcher"
        size="icon"
        aria-label={open ? "إغلاق مساعد بداية" : "فتح مساعد بداية"}
        aria-expanded={open}
        aria-controls="youth-assistant-panel"
        onClick={() => {
          if (open) close();
          else { returnFocus.current = launcher.current; setOpen(true); }
        }}
      >
        {open ? <X /> : <MessageCircle />}
      </Button>
    </div>
  );
}
