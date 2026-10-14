"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent } from "react";
import {
  Check,
  FileText,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  UserRound,
  CalendarDays,
} from "lucide-react";
import { useYouth } from "./YouthProvider";
import {
  arabicActions,
  arabicOpportunities,
  youthName,
} from "@/lib/youth-ar";
import StoryReels from "./StoryReels";
import MicroActionCard from "./MicroActionCard";
import OpportunityCard from "./OpportunityCard";
import YouthNotifications from "./YouthNotifications";
import { openYouthAssistant } from "./YouthAssistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
function SectionHeader({
  title,
  subtitle = "",
  href,
}: {
  title: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <div className="portal-section-header">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <Link href={href}>عرض الكل</Link>
    </div>
  );
}
export default function YouthDashboard() {
  const { applications, saved, completed, profile } = useYouth();
  const router = useRouter();
  function search(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(
      `/neet/opportunities?q=${encodeURIComponent(String(new FormData(event.currentTarget).get("q") ?? ""))}`,
    );
  }
  return (
    <div className="original-youth-dashboard">
      <div className="portal-main">
        <header className="portal-topbar">
          <div>
            <h1>
              أهلاً {youthName(profile.firstName)} <span>👋</span>
            </h1>
            <p>فرص جديدة وخطوات صغيرة نحو المستقبل الذي تريده.</p>
          </div>
          <form className="youth-dashboard-search" onSubmit={search}>
            <Search aria-hidden="true" />
            <Input
              name="q"
              aria-label="البحث عن فرص وبرامج"
              placeholder="ابحث عن فرص وبرامج…"
            />
          </form>
          <YouthNotifications />
        </header>
        <p className="dashboard-demo-note">
          فضاء تجريبي · الترشيحات والرسائل محفوظة محلياً.
        </p>
        <div className="hero-grid">
          <section className="portal-card profile-card">
            <div className="profile-main">
              <div className="avatar-ring">
                <Image
                  src="/editorial/story-khalid.webp"
                  alt={youthName(profile.firstName, profile.lastName)}
                  width={118}
                  height={118}
                />
              </div>
              <div className="profile-copy">
                <div className="profile-status">
                  <b>وضعك الحالي</b>
                  <span>● مواكبة نشطة</span>
                </div>
                <p>مسارك يتقدّم، واصل خطواتك!</p>
                <div className="progress-line">
                  <i style={{ width: "78%" }} />
                </div>
                <small>78% مكتمل</small>
              </div>
            </div>
            <div className="profile-stats">
              {[
                ["4", "فرص متاحة"],
                [String(applications.length), "ترشيحات محضّرة"],
                [String(saved.length), "فرص محفوظة"],
                [String(completed.length), "خطوات منجزة"],
              ].map(([value, label]) => (
                <div key={label}>
                  <Check size={17} />
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="portal-card assistant-card">
            <b>مساعد بداية</b>
            <div>
              <Image
                src="/editorial/assistant-bot.webp"
                alt=""
                width={96}
                height={86}
              />
              <p>تحتاج إلى نصيحة أو مساعدة؟ أنا هنا لأرافقك.</p>
            </div>
            <Button onClick={openYouthAssistant}>
              تحدّث الآن
              <MessageCircle data-icon="inline-end" />
            </Button>
          </section>
          <section className="portal-card quote-card youth-quote-card">
            <Image
              src="/editorial/mountain-progress.webp"
              alt="منظر جبلي يرمز إلى التقدّم"
              fill
              sizes="(max-width: 760px) 95vw, 30vw"
            />
            <div>
              <Sparkles size={20} />
              <blockquote>
                كل خطوة صغيرة اليوم
                <br />
                تقرّبك من مستقبلك.
              </blockquote>
              <p>نؤمن بك وبقدرتك على البداية.</p>
            </div>
          </section>
        </div>
        <section className="portal-panel">
          <SectionHeader
            title="فرص تناسبك"
            subtitle="اخترناها حسب ملفك واهتماماتك"
            href="/neet/opportunities"
          />
          <div className="opportunity-row">
            {arabicOpportunities.map((item) => (
              <OpportunityCard key={item.id} opportunity={item} />
            ))}
          </div>
        </section>
        <section className="portal-panel youth-stories-panel">
          <SectionHeader
            title="قصص تلهم بدايتك"
            subtitle="شباب مثلك، وبدايات صنعت الفرق"
            href="/neet/stories"
          />
          <StoryReels compact />
        </section>
        <div className="lower-grid">
          <section className="portal-card task-card">
            <SectionHeader title="خطواتك المقبلة" href="/neet/journey" />
            <div className="task-list">
              {[
                [
                  UserRound,
                  "أكمل ملفك",
                  "أضف مهاراتك وتجاربك",
                  "/neet/profile",
                ],
                [
                  CalendarDays,
                  "استعد لموعد التوجيه",
                  "شارك أسئلتك مع إيمان",
                  "/neet/messages",
                ],
                [
                  FileText,
                  "حضّر سيرتك الذاتية",
                  "افتح أبواب فرص جديدة",
                  "/neet/profile",
                ],
                [
                  Sparkles,
                  "اكتشف تكويناً يناسبك",
                  "ابدأ من اهتماماتك",
                  "/neet/opportunities",
                ],
              ].map(([Icon, title, note, href]) => {
                const ActionIcon = Icon as typeof UserRound;
                return (
                  <div key={String(title)} className="task-item">
                    <span>
                      <ActionIcon size={17} />
                    </span>
                    <div>
                      <b>{String(title)}</b>
                      <small>{String(note)}</small>
                    </div>
                    <Link className="task-action" href={String(href)}>
                      ابدأ
                    </Link>
                  </div>
                );
              })}
            </div>
            <Link className="wide-link" href="/neet/journey">
              عرض كل خطواتي
            </Link>
          </section>
          <section className="portal-card journey-card">
              <h2>مسارك</h2>
              <p>تقدّمك نحو اندماج مهني مستدام</p>
              <div className="journey-line">
                {["تعارف", "تفعيل", "توجيه", "اندماج", "استقرار"].map(
                  (step, index) => (
                    <div key={step} className={index < 2 ? "done" : index === 2 ? "current" : ""}>
                      <span>
                        <Check size={17} />
                      </span>
                      <b>{step}</b>
                    </div>
                  ),
                )}
              </div>
              <div className="journey-summary">
                <div>
                  <b>المرحلة الحالية: التوجيه</b>
                  <p>تكتشف ما يناسبك وتختار خطوتك المقبلة.</p>
                </div>
                <strong>
                  2/5<span>مراحل منجزة</span>
                </strong>
              </div>
            </section>
        </div>
        <section className="portal-card micro-card youth-weekly-actions">
              <SectionHeader
                title="خطوات صغيرة هذا الأسبوع"
                subtitle="أثر كبير يبدأ بخطوة"
                href="/neet/micro-actions"
              />
              <div className="micro-visual-grid">
                {arabicActions.map((action) => (
                  <MicroActionCard action={action} compact key={action.id} />
                ))}
              </div>
            </section>
        <div className="lower-grid">
          <section className="portal-card notif-card">
            <SectionHeader title="رسائلك وإشعاراتك" href="/neet/messages" />
            {[
              [
                "فرصة جديدة تناسبك",
                "تدريب في التسويق الرقمي لدى ستارت أب المغرب",
                "منذ ساعتين",
              ],
              ["موعد التوجيه", "تواصل مع إيمان لتحضير اللقاء", "منذ يوم"],
              ["أحسنت!", "ملفك مكتمل بنسبة 78%. واصل التقدّم.", "منذ يومين"],
            ].map(([title, note, time]) => (
              <div className="notification-item" key={title}>
                <span>
                  <MessageCircle size={20} />
                </span>
                <div>
                  <b>{title}</b>
                  <p>{note}</p>
                </div>
                <time>{time}</time>
              </div>
            ))}
          </section>
          <section className="portal-card mediator-card">
            <SectionHeader title="وسيطتك" href="/neet/messages" />
            <div className="mediator-body">
              <Image
                src="/editorial/story-amina.webp"
                alt="إيمان رامي"
                width={74}
                height={74}
              />
              <div>
                <h3>إيمان رامي</h3>
                <b>وسيطة مواكبة</b>
                <span>
                  <MapPin size={13} /> أكادير
                </span>
                <em>● متاحة الآن</em>
              </div>
              <p>
                أنا هنا لمواكبتك في كل خطوة من مسارك. تحدّث معي متى احتجت إلى
                المساعدة.
              </p>
            </div>
            <div className="mediator-actions">
              <Link className="mediator-message" href="/neet/messages">
                إرسال رسالة
              </Link>
              <Link className="mediator-appointment" href="/neet/messages">
                طلب موعد
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
