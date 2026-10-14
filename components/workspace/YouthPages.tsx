"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Search,
} from "lucide-react";
import { opportunities } from "@/lib/demo-data";
import {
  arabicActions,
  arabicOpportunities,
  locationsAr,
  youthName,
  normalizeArabicSearch,
} from "@/lib/youth-ar";
import { EmptyState, PageIntro, Panel, Tag } from "./UI";
import OpportunityCard from "./OpportunityCard";
import { useYouth } from "./YouthProvider";
import { AppointmentCard, NextSteps } from "./YouthWidgets";
import StoryReels from "./StoryReels";
import MicroActionCard from "./MicroActionCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

// File changes cannot be replayed when they happen before React attaches handlers.
const subscribeToClientReady = () => () => {};
const clientReadySnapshot = () => true;
const serverReadySnapshot = () => false;

function FilterSelect({
  label,
  value,
  values,
  onChange,
}: {
  label: string;
  value: string;
  values: string[];
  onChange: (value: string) => void;
}) {
  return (
    <Select dir="rtl" value={value} onValueChange={onChange}>
      <SelectTrigger aria-label={label}>
        <SelectValue>{value}</SelectValue>
      </SelectTrigger>
      <SelectContent dir="rtl" lang="ar" className="youth-select-menu">
        <SelectGroup>
          {values.map((item) => (
            <SelectItem value={item} key={item}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export function OpportunitiesPage({
  initialQuery = "",
}: {
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("كل الأنواع");
  const [location, setLocation] = useState("كل المدن");
  const [tab, setTab] = useState("مقترحة لك");
  const { saved, applications } = useYouth();
  const filtered = arabicOpportunities.filter(
    (item) =>
      normalizeArabicSearch(
        `${item.title} ${item.organization} ${item.location} ${item.skills.join(" ")} ${opportunities.find((original) => original.id === item.id)?.title ?? ""}`,
      ).includes(normalizeArabicSearch(query)) &&
      (type === "كل الأنواع" || item.type === type) &&
      (location === "كل المدن" || item.location === location) &&
      (tab !== "المفضلة" || saved.includes(item.id)) &&
      (tab !== "ترشيحاتي" || applications.includes(item.id)),
  );
  return (
    <>
      <PageIntro
        eyebrow="عالم من الإمكانات"
        title="اكتشف فرصتك المقبلة"
        description="تكوين، تدريب، أو عمل. اختر البداية التي تناسب طموحاتك."
      />
      <div className="youth-opportunity-filters">
        <Field>
          <FieldLabel htmlFor="opportunity-search">ابحث عن فرصة</FieldLabel>
          <div className="youth-search-control">
            <Search aria-hidden="true" />
            <Input
              id="opportunity-search"
              placeholder="مهنة، مهارة، أو مؤسسة…"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </Field>
        <Field>
          <FieldLabel>نوع الفرصة</FieldLabel>
          <FilterSelect
            label="نوع الفرصة"
            value={type}
            onChange={setType}
            values={["كل الأنواع", "تكوين", "تدريب", "عمل", "برنامج"]}
          />
        </Field>
        <Field>
          <FieldLabel>المدينة</FieldLabel>
          <FilterSelect
            label="المدينة"
            value={location}
            onChange={setLocation}
            values={["كل المدن", "أكادير", "الدار البيضاء", "عن بُعد"]}
          />
        </Field>
        <Button
          variant="outline"
          onClick={() => {
            setQuery("");
            setType("كل الأنواع");
            setLocation("كل المدن");
          }}
        >
          إعادة ضبط
        </Button>
      </div>
      <div className="section-heading">
        <Tabs dir="rtl" value={tab} onValueChange={setTab}>
          <TabsList>
            {["مقترحة لك", "المفضلة", "ترشيحاتي"].map((value) => (
              <TabsTrigger value={value} key={value}>
                {value}
                {value === "المفضلة"
                  ? ` (${saved.length})`
                  : value === "ترشيحاتي"
                    ? ` (${applications.length})`
                    : ""}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <span className="results-count" role="status">
          {filtered.length === 0 ? "لا توجد فرص مطابقة" : filtered.length === 1 ? "فرصة واحدة متاحة" : filtered.length === 2 ? "فرصتان متاحتان" : `${filtered.length} فرص متاحة`}
        </span>
      </div>
      {filtered.length ? (
        <div className="opportunity-grid two">
          {filtered.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="لا توجد فرص هنا بعد"
          description={
            tab === "المفضلة"
              ? "احفظ فرصة بعلامة المفضلة لتجدها هنا."
              : tab === "ترشيحاتي"
                ? "حضّر ترشيحك من صفحة تفاصيل الفرصة."
                : "جرّب كلمة أخرى أو وسّع نطاق البحث."
          }
        />
      )}
      <p className="form-note">
        فرص توضيحية. تُحفظ اختياراتك على هذا الجهاز في النسخة التجريبية.
      </p>
    </>
  );
}
export function OpportunityDetail({ id }: { id: string }) {
  const opportunity = arabicOpportunities.find((item) => item.id === id)!;
  const { saved, toggleSaved, applications, apply } = useYouth();
  const applied = applications.includes(id);
  return (
    <>
      <Link href="/neet/opportunities" className="back-link">
        <ArrowRight size={15} />
        كل الفرص
      </Link>
      <PageIntro
        eyebrow={opportunity.type}
        title={opportunity.title}
        description={`${opportunity.organization} · ${opportunity.location}`}
        action={
          <Button
            variant="outline"
            aria-pressed={saved.includes(id)}
            onClick={() => toggleSaved(id)}
          >
            <Bookmark
              data-icon="inline-start"
              fill={saved.includes(id) ? "currentColor" : "none"}
            />
            {saved.includes(id) ? "محفوظة" : "حفظ الفرصة"}
          </Button>
        }
      />
      <div className="two-column">
        <div className="stack">
          <div className="detail-cover">
            <Image
              src={opportunity.image}
              alt=""
              fill
              sizes="(max-width: 1000px) 95vw, 55vw"
            />
          </div>
          <Panel title="هل هذه خطوتك المقبلة؟">
            <div className="detail-text">
              <p>{opportunity.description}</p>
              <h3>ماذا ينتظرك؟</h3>
              <p>{opportunity.details}</p>
              <h3>مهارات ستطوّرها</h3>
              <div className="skill-list">
                {opportunity.skills.map((skill) => (
                  <Tag key={skill} tone="muted">
                    {skill}
                  </Tag>
                ))}
              </div>
              <h3>مواكبة في كل خطوة</h3>
              <p>
                تساعدك وسيطتك على فهم الشروط وإعداد سيرتك الذاتية وتنظيم
                المقابلة. خذ وقتك للحديث معها.
              </p>
            </div>
          </Panel>
        </div>
        <div className="stack">
          <Panel title="معلومات أساسية">
            <ul className="detail-list">
              <li>
                {opportunity.type} · {opportunity.organization}
              </li>
              <li>
                <MapPin size={17} />
                {opportunity.location}
              </li>
              <li>
                <Clock3 size={17} />
                {opportunity.duration}
              </li>
              <li>
                <CalendarDays size={17} />
                قبل {opportunity.deadline}
              </li>
            </ul>
            <div className="inline-alert">
              {opportunity.match}% توافق مع ملفك التجريبي
            </div>
            <Button onClick={() => apply(id)} disabled={applied}>
              {applied ? "تم تحضير الترشيح" : "حضّر ترشيحي"}
            </Button>
            {applied && (
              <p className="form-note" role="status">
                أُضيفت الفرصة إلى ترشيحاتك التجريبية. لم يُرسل أي ترشيح إلى
                المؤسسة.
              </p>
            )}
            <Link href="/neet/messages" className="text-link">
              تحدّث مع إيمان حول الفرصة
            </Link>
          </Panel>
          <AppointmentCard />
        </div>
      </div>
    </>
  );
}
export function JourneyPage() {
  const steps = [
    [
      "لقاؤنا الأول",
      "شاركت مسارك وطموحاتك مع إيمان.",
      "15 سبتمبر 2026",
      "done",
    ],
    [
      "بناء الثقة",
      "بدأت مواكبتك وتعرّفنا على احتياجاتك.",
      "22 سبتمبر 2026",
      "done",
    ],
    [
      "اختيار اتجاهك",
      "اكتشف المهن والتكوينات التي تناسبك.",
      "جارٍ · اللقاء المقبل يوم 19 أكتوبر",
      "current",
    ],
    [
      "الانتقال إلى العمل",
      "حضّر ترشيحاً أو التحق بتكوين أو ابدأ تدريباً.",
      "قريباً",
      "",
    ],
    ["تثبيت بدايتك الجديدة", "تستمر مواكبتك خلال الأشهر الأولى.", "قريباً", ""],
  ];
  return (
    <>
      <PageIntro
        eyebrow="كل خطوة لها قيمة"
        title="مسارك، حسب إيقاعك"
        description="يُبنى الطريق خطوة بخطوة. اكتشف أين وصلت وما ينتظرك."
      />
      <div className="two-column">
        <Panel>
          <div className="journey-header">
            <div className="progress-ring">2/5</div>
            <div>
              <Tag>التوجيه جارٍ</Tag>
              <h2>أنت تسير في الاتجاه الصحيح.</h2>
              <p>خطوتان منجزتان، وفريق إلى جانبك.</p>
            </div>
          </div>
          <div className="timeline">
            {steps.map(([title, text, date, state], index) => (
              <div className={`timeline-item ${state}`} key={title}>
                <div className="timeline-marker">
                  {state === "done" ? <Check size={15} /> : index + 1}
                </div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <small>{date}</small>
                </div>
              </div>
            ))}
          </div>
          <Link href="/neet/opportunities" className="button button-primary">
            اكتشف إمكاناتي
          </Link>
        </Panel>
        <div className="stack">
          <AppointmentCard />
          <NextSteps />
        </div>
      </div>
    </>
  );
}
export function MicroActionsPage() {
  const [filter, setFilter] = useState("الكل");
  const { enrolled } = useYouth();
  const filtered = arabicActions.filter(
    (item) => filter !== "تسجيلاتي" || enrolled.includes(item.id),
  );
  return (
    <>
      <PageIntro
        eyebrow="خطوات صغيرة، إمكانات كبيرة"
        title="خطوة صغيرة اليوم"
        description="أنشطة بسيطة لتكتسب الثقة وتكتشف وتستعد."
      />
      <Tabs dir="rtl" value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="الكل">كل الخطوات</TabsTrigger>
          <TabsTrigger value="تسجيلاتي">
            تسجيلاتي ({enrolled.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {filtered.length ? (
        <div className="actions-discovery-grid">
          {filtered.map((action) => (
            <MicroActionCard key={action.id} action={action} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="خطوتك الأولى تنتظرك"
          description="اختر ورشة أو نشاطاً ليظهر ضمن تسجيلاتك."
        />
      )}
    </>
  );
}
export function StoriesPage() {
  return (
    <>
      <PageIntro
        eyebrow="مسارات تمنحك الثقة"
        title="بداية واحدة قد تغيّر كل شيء"
        description="قصص شباب مثلك. افتح قصة واكتشف خطوتهم الأولى."
      />
      <StoryReels />
      <p className="form-note">
        قصص وصور توضيحية أُنشئت للتعريف بمسارات المواكبة.
      </p>
    </>
  );
}
export function YouthProfilePage() {
  const clientReady = useSyncExternalStore(subscribeToClientReady, clientReadySnapshot, serverReadySnapshot);
  const [status, setStatus] = useState("");
  const [document, setDocument] = useState("");
  const [documentError, setDocumentError] = useState("");
  const [invalid, setInvalid] = useState<{ name: string; message: string } | null>(null);
  const { profile, setProfile } = useYouth();
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const labels: Record<string, string> = { firstName: "اسمك الشخصي", lastName: "اسمك العائلي", email: "بريدك الإلكتروني" };
    for (const name of ["firstName", "lastName", "email"]) {
      const value = String(data.get(name) ?? "").trim();
      const input = event.currentTarget.elements.namedItem(name) as HTMLInputElement;
      const message = !value ? `أدخل ${labels[name]}.` : name === "email" && input.validity.typeMismatch ? "أدخل بريداً إلكترونياً صحيحاً، مثل name@example.com." : "";
      if (message) { setInvalid({ name, message }); setStatus(""); input.focus(); return; }
    }
    setInvalid(null);
    setProfile((current) => ({
      ...current,
      ...Object.fromEntries(
        Array.from(data.entries()).filter(
          (entry): entry is [string, string] =>
            entry[0] in current && typeof entry[1] === "string",
        ),
      ),
    }));
    setStatus("تم حفظ المعلومات على هذا الجهاز.");
  }
  return (
    <>
      <PageIntro
        eyebrow="ملف يعبّر عنك"
        title="عرّفنا على طموحاتك"
        description="معلومات بسيطة لمواكبتك والعثور على الفرص المناسبة."
      />
      <div className="two-column">
        <Panel title="معلوماتي" note="يمكنك تعديلها في أي وقت.">
          <form noValidate onSubmit={save} onInput={() => { setInvalid(null); setStatus(""); }} key={JSON.stringify(profile)}>
            <FieldGroup className="youth-profile-fields">
              {[
                ["firstName", "الاسم الشخصي", "text"],
                ["lastName", "الاسم العائلي", "text"],
                ["email", "البريد الإلكتروني", "email"],
                ["phone", "الهاتف", "tel"],
              ].map(([name, label, type]) => (
                <Field key={name} data-invalid={invalid?.name === name}>
                  <FieldLabel htmlFor={`profile-${name}`}>{label}</FieldLabel>
                  <Input
                    id={`profile-${name}`}
                    name={name}
                    type={type}
                    defaultValue={profile[name]}
                    aria-invalid={invalid?.name === name}
                    aria-describedby={invalid?.name === name ? `profile-${name}-error` : undefined}
                    required={name !== "phone"}
                    maxLength={name === "email" ? 254 : 80}
                    dir={type === "email" || type === "tel" ? "ltr" : undefined}
                  />
                  {invalid?.name === name && <FieldError id={`profile-${name}-error`}>{invalid.message}</FieldError>}
                </Field>
              ))}
              <Field>
                <FieldLabel htmlFor="profile-city">المدينة</FieldLabel>
                <select
                  id="profile-city"
                  name="city"
                  defaultValue={profile.city}
                  className="field-input"
                >
                  {!locationsAr[profile.city] && <option value={profile.city}>{profile.city}</option>}
                  {Object.entries(locationsAr)
                    .filter(
                      ([value]) =>
                        value !== "En ligne",
                    )
                    .map(([value, label]) => (
                      <option value={value} key={value}>
                        {label}
                      </option>
                    ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-goal">هدفي</FieldLabel>
                <select
                  id="profile-goal"
                  name="goal"
                  defaultValue={profile.goal}
                  className="field-input"
                >
                  {!["تكوين", "تدريب", "عمل", "إنشاء مشروعي", "أحتاج إلى توجيه"].includes(profile.goal) && <option value={profile.goal}>{profile.goal}</option>}
                  {[
                    "تكوين",
                    "تدريب",
                    "عمل",
                    "إنشاء مشروعي",
                    "أحتاج إلى توجيه",
                  ].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-skills">مهاراتي</FieldLabel>
                <Textarea
                  id="profile-skills"
                  name="skills"
                  defaultValue={profile.skills}
                  maxLength={1000}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-interests">
                  ما أريد اكتشافه
                </FieldLabel>
                <Textarea
                  id="profile-interests"
                  name="interests"
                  defaultValue={profile.interests}
                  maxLength={2000}
                />
              </Field>
            </FieldGroup>
            <div className="form-actions">
              <Button type="submit">
                حفظ معلوماتي
                <Check data-icon="inline-end" />
              </Button>
            </div>
            {status && (
              <div className="inline-alert" role="status">
                {status}
              </div>
            )}
            <p className="form-note">
              تُحفظ المعلومات التجريبية على هذا الجهاز.
            </p>
          </form>
        </Panel>
        <div className="stack">
          <Panel className="profile-summary">
            <Image
              src="/editorial/story-khalid.webp"
              alt=""
              width={90}
              height={90}
            />
            <h2>{youthName(profile.firstName, profile.lastName)}</h2>
            <p>22 سنة · {locationsAr[profile.city] || profile.city}</p>
            <Tag>مواكبة نشطة</Tag>
            <progress value={document ? 90 : 78} max={100} />
            <small>{document ? 90 : 78}% من الملف التجريبي مكتمل</small>
            <div className="skill-list">
              {profile.skills
                .split(/[,،]/)
                .filter(Boolean)
                .slice(0, 5)
                .map((skill, index) => (
                  <Tag tone="muted" key={index}>
                    {skill.trim()}
                  </Tag>
                ))}
            </div>
          </Panel>
          <Panel title="وثائقي" note="حضّر سيرتك الذاتية للخطوات المقبلة.">
            <div className="document-row">
              <FileText size={20} />
              <div>
                <b>{document || "سيرتي الذاتية"}</b>
                <small>
                  {document ? "تم اختيار الملف محلياً" : "PDF، حتى 5 ميغابايت"}
                </small>
              </div>
              {document && <CheckCircle2 size={17} />}
            </div>
            <label className="file-upload" aria-disabled={!clientReady} aria-busy={!clientReady}>
              اختيار سيرتي الذاتية
              <input
                type="file"
                disabled={!clientReady}
                className="youth-file-input"
                aria-label="اختيار سيرتي الذاتية"
                accept="application/pdf,.pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  if (
                    !file.name.toLowerCase().endsWith(".pdf") ||
                    (file.type && file.type !== "application/pdf") ||
                    file.size > 5 * 1024 * 1024
                  ) {
                    setDocumentError("اختر ملف PDF بحجم لا يتجاوز 5 ميغابايت.");
                    event.target.value = "";
                    return;
                  }
                  setDocument(file.name);
                  setDocumentError("");
                }}
              />
            </label>
            {documentError && (
              <p className="form-note" role="alert">
                {documentError}
              </p>
            )}
            <p className="form-note">يُفحص الملف على جهازك ولا يتم رفعه.</p>
          </Panel>
        </div>
      </div>
    </>
  );
}
