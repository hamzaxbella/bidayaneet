"use client";
import LanguageSwitcher, {
  useTranslation,
} from "@/components/LanguageProvider";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  Check,
  ClipboardList,
  Compass,
  Download,
  House,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import JourneyPanel from "./JourneyPanel";
import { journeyState } from "@/lib/journey";
import Brand from "@/components/Brand";
import type {
  PlatformData,
  Diagnosis,
  Youth,
  Offer,
  OfferData,
} from "@/lib/platform-types";
import { ageAt, matchOffers } from "@/lib/matching";
import { downloadCsv } from "@/lib/export-csv";

const labels: Record<string, string> = {
  overview: "Vue d’ensemble",
  youth: "Jeunes accompagnés",
  offers: "Opportunités & orientations",
  activities: "Activités de terrain",
  followup: "Suivi & alertes",
  agenda: "Agenda",
  messages: "Messages",
  team: "Équipe & accès",
  reports: "Impact & rapports",
  settings: "Mon compte",
};
const icons = {
  overview: House,
  youth: Users,
  offers: Compass,
  activities: Zap,
  followup: Bell,
  agenda: CalendarDays,
  messages: MessageCircle,
  team: ShieldCheck,
  reports: ClipboardList,
  settings: Settings,
};
const roleNames = {
  admin: "Administration régionale",
  mediator: "Espace médiateur",
  partner: "Espace partenaire",
  neet: "Espace jeune",
};
const statuses: Record<string, string> = {
  pending: "À valider",
  validated: "Validé",
  revision: "À corriger",
  proposed: "Proposée",
  accepted: "Acceptée",
  rejected: "Refusée",
  withdrawn: "Retirée",
  planned: "À faire",
  completed: "Effectué",
  unreachable: "Injoignable",
  dropout: "Décrochage",
  inserted: "Insertion constatée",
};
type Mutation = (action: string, payload: unknown) => Promise<boolean>;
const today = () => new Date().toISOString().slice(0, 10);
function Tag({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: string;
}) {
  const { t } = useTranslation();

  return <span className={`p-tag p-tag-${tone}`}>{t(children)}</span>;
}
function Empty({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="p-empty">
      <Compass size={30} />
      <p>{t(children)}</p>
    </div>
  );
}
function Field({
  label,
  name,
  type = "text",
  value,
  required = true,
  min,
  max,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string | number;
  required?: boolean;
  min?: string | number;
  max?: string | number;
}) {
  const { t } = useTranslation();

  return (
    <label className="form-field">
      {t(label)}
      <input
        name={name}
        type={type}
        dir={type === "text" ? "auto" : undefined}
        defaultValue={value}
        required={required}
        minLength={type === "password" ? Number(min || 1) : undefined}
        min={min}
        max={max}
        maxLength={type === "text" ? 500 : undefined}
        className="field-input"
      />
    </label>
  );
}
function Select({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value?: string;
  options: [string, string][];
}) {
  const { t } = useTranslation();

  return (
    <label className="form-field">
      {t(label)}
      <select name={name} defaultValue={value} className="field-input" required>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {t(l)}
          </option>
        ))}
      </select>
    </label>
  );
}
function CheckField({
  name,
  children,
  checked = false,
  required = false,
}: {
  name: string;
  children: ReactNode;
  checked?: boolean;
  required?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <label className="p-checkbox">
      <input
        type="checkbox"
        name={name}
        defaultChecked={checked}
        required={required}
      />
      <span>{t(children)}</span>
    </label>
  );
}
function formData(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  return new FormData(event.currentTarget);
}
const string = (data: FormData, name: string) => String(data.get(name) || "");

export default function Platform({
  initial,
  section,
  youthId,
}: {
  initial: PlatformData;
  section: string;
  youthId?: string;
}) {
  const { t, text } = useTranslation();

  const router = useRouter();
  const [data, setData] = useState(initial);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const lock = useRef(false);
  const sidebar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  const reload = useCallback(async () => {
    const response = await fetch("/api/platform", { cache: "no-store" });
    if (response.status === 401) {
      router.replace(`/auth/${initial.user.role}/sign-in`);
      router.refresh();
      return;
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    setData(result);
  }, [initial.user.role, router]);
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lock.current) reload().catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [reload]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    const menuButton = menu.current;
    document.body.style.overflow = "hidden";
    sidebar.current?.querySelector<HTMLElement>("button")?.focus();
    const handle = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const els = Array.from(
        sidebar.current?.querySelectorAll<HTMLElement>("button,a[href]") || [],
      ).filter((el) => el.offsetParent !== null);
      if (e.shiftKey && document.activeElement === els[0]) {
        e.preventDefault();
        els.at(-1)?.focus();
      } else if (!e.shiftKey && document.activeElement === els.at(-1)) {
        e.preventDefault();
        els[0]?.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", handle);
      menuButton?.focus();
    };
  }, [open]);
  const mutate: Mutation = async (action, payload) => {
    if (lock.current) return false;
    lock.current = true;
    setBusy(true);
    setNotice("");
    setError("");
    try {
      const response = await fetch("/api/platform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, payload }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      await reload();
      setNotice("Modification enregistrée.");
      return true;
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Connexion indisponible. Réessaie sans fermer le formulaire.",
      );
      return false;
    } finally {
      lock.current = false;
      setBusy(false);
    }
  };
  const user = data.user;
  const professional = ["admin", "mediator"].includes(user.role);
  const navigation =
    user.role === "admin"
      ? [
          "overview",
          "youth",
          "offers",
          "activities",
          "followup",
          "agenda",
          "messages",
          "reports",
          "team",
          "settings",
        ]
      : user.role === "mediator"
        ? [
            "overview",
            "youth",
            "offers",
            "activities",
            "followup",
            "agenda",
            "messages",
            "reports",
            "settings",
          ]
        : user.role === "partner"
          ? ["overview", "offers", "messages", "settings"]
          : [
              "overview",
              "youth",
              "offers",
              "activities",
              "followup",
              "agenda",
              "messages",
              "settings",
            ];
  const selected = data.people.find((p) => p.id === youthId);
  async function logout() {
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (response.ok) {
      router.replace(`/auth/${user.role}/sign-in`);
      router.refresh();
    } else setError("Impossible de fermer la session. Réessaie.");
  }
  return (
    <div className="workspace workspace-live" lang="fr">
      <a href="#workspace-content" className="skip-link">
        {t("Aller au contenu")}
      </a>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label={text("Fermer le menu")}
          onClick={() => setOpen(false)}
          tabIndex={-1}
        />
      )}
      <aside
        ref={sidebar}
        className={`workspace-sidebar ${open ? "is-open" : ""}`}
      >
        <div className="workspace-brand">
          <Brand />
          <button
            className="mobile-close icon-button"
            aria-label={text("Fermer le menu")}
            onClick={() => setOpen(false)}
          >
            <X />
          </button>
        </div>
        <div className="workspace-label">{t(roleNames[user.role])}</div>
        <nav>
          {navigation.map((key) => {
            const Icon = icons[key as keyof typeof icons];
            return (
              <Link
                key={key}
                href={key === "overview" ? "/platform" : `/platform/${key}`}
                className={`workspace-nav ${section === key || (key === "youth" && section === "new") ? "active" : ""}`}
                aria-current={section === key ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <Icon size={18} />
                <span>
                  {t(
                    key === "youth" && user.role === "neet"
                      ? "Mon dossier"
                      : labels[key],
                  )}
                </span>
                {key === "team" && data.requests.length > 0 && (
                  <span className="nav-count">{t(data.requests.length)}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-support">
          {(user.role === "mediator" || user.role === "admin") && (
            <Link href="/terrain" prefetch={false}>
              {t("Terrain · hors connexion")}
            </Link>
          )}
          <Zap size={19} />
          <b>{t("Chaque rencontre ouvre une voie.")}</b>
          <p>{t("Le terrain, les parcours et les opportunités réunis.")}</p>
          <Link
            href={
              user.role === "partner"
                ? "/platform/messages"
                : "/platform/followup"
            }
          >
            {t("Accompagner le prochain pas ")}
            <ArrowRight size={14} />
          </Link>
        </div>
        <div className="workspace-user">
          <span className="avatar">
            {user.name
              .split(" ")
              .slice(0, 2)
              .map((s) => s[0])
              .join("")}
          </span>
          <span>
            <b>{user.name}</b>
            <small>{t(roleNames[user.role])}</small>
          </span>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <button
            ref={menu}
            className="mobile-menu icon-button"
            aria-label={text("Ouvrir le menu")}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
          <div className="breadcrumb">
            <House size={15} />
            <span>{t("/")}</span>
            <span>{t(labels[section])}</span>
          </div>
          <div className="topbar-end">
            <LanguageSwitcher />
            <span className="p-live-dot">{t("Session active")}</span>
            <button
              className="icon-button"
              aria-label={text("Actualiser les données")}
              onClick={() => reload().catch((e) => setError(e.message))}
            >
              <RefreshCw size={17} />
            </button>
            <button className="account-link p-logout" onClick={logout}>
              <LogOut size={16} />
              {t("Déconnexion")}
            </button>
          </div>
        </header>
        <main
          id="workspace-content"
          className="workspace-content"
          tabIndex={-1}
        >
          <div className="p-demo-note">
            <ShieldCheck size={15} />
            <span>
              {t(
                "Environnement de démonstration · profils et offres partenaires fictifs. Les modifications sont enregistrées.",
              )}
            </span>
          </div>
          <div aria-live="polite">
            {notice && (
              <div className="p-notice" role="status">
                <Check size={17} />
                {t(notice)}
                <button
                  onClick={() => setNotice("")}
                  aria-label={text("Masquer la notification")}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
          {error && (
            <div className="p-error" role="alert">
              {t(error)}
            </div>
          )}
          <fieldset className="p-workspace-fieldset" disabled={busy}>
            {section === "overview" && (
              <Dashboard
                data={data}
                professional={professional}
                mutate={mutate}
              />
            )}
            {section === "youth" &&
              (selected ? (
                <YouthDetail
                  key={selected.id}
                  youth={selected}
                  data={data}
                  professional={professional}
                  mutate={mutate}
                />
              ) : (
                <YouthList data={data} professional={professional} />
              ))}
            {section === "offers" && <Offers data={data} mutate={mutate} />}
            {section === "activities" && (
              <Activities
                data={data}
                professional={professional}
                mutate={mutate}
              />
            )}
            {section === "followup" && (
              <Followups
                data={data}
                professional={professional}
                mutate={mutate}
              />
            )}
            {section === "agenda" && (
              <Agenda data={data} professional={professional} mutate={mutate} />
            )}
            {section === "messages" && <Messages data={data} mutate={mutate} />}
            {section === "team" && <Team data={data} mutate={mutate} />}
            {section === "reports" && <Reports data={data} />}
            {section === "settings" && <Account data={data} mutate={mutate} />}
          </fieldset>
          {busy && (
            <div className="p-saving" role="status">
              {t("Enregistrement en cours…")}
            </div>
          )}
        </main>
        <footer className="workspace-footer">
          <span>{t("© 2026 BidayaNeet")}</span>
          <span>{t("Premier pas. Un avenir meilleur.")}</span>
        </footer>
      </div>
    </div>
  );
}

function Header({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  const { t } = useTranslation();

  return (
    <div className="p-page-header">
      <div>
        <div className="eyebrow">{t("BIDAYANEET · SOUSS-MASSA")}</div>
        <h1>{t(title)}</h1>
        <p>{t(description)}</p>
      </div>
      {t(action)}
    </div>
  );
}
function Metrics({ items }: { items: [string, number, string][] }) {
  const { t } = useTranslation();

  return (
    <div className="p-metrics">
      {items.map(([label, value, note]) => (
        <div className="p-metric" key={label}>
          <span>{t(label)}</span>
          <strong>{t(value)}</strong>
          <small>{t(note)}</small>
        </div>
      ))}
    </div>
  );
}
function Dashboard({
  data,
  professional,
  mutate,
}: {
  data: PlatformData;
  professional: boolean;
  mutate: Mutation;
}) {
  const { t } = useTranslation();

  const overdue = data.followups.filter(
    (f) => f.outcome === "planned" && f.due_date.slice(0, 10) < today(),
  );
  return (
    <>
      <section className="p-hero">
        <div>
          <div className="eyebrow">
            {t("L’ACCOMPAGNEMENT FAIT LA DIFFÉRENCE")}
          </div>
          <h1>
            {t("Bonjour ")}
            <bdi>{data.user.name.split(" ")[0]}</bdi>
            {t(".")}
            <br />
            {t("Un premier pas,")}
            <br />
            {t("un nouvel avenir.")}
          </h1>
          <p>
            {t(
              data.user.role === "partner"
                ? "Tes opportunités deviennent des parcours. Retrouve les orientations et accompagne les prochains départs."
                : data.user.role === "neet"
                  ? "Retrouve ton accompagnement, tes rendez-vous et les opportunités proposées par ton médiateur."
                  : "Retrouve les diagnostics collectés dans l’application mobile, vérifie les dossiers et accompagne chaque parcours.",
            )}
          </p>
          <Link
            href={
              professional
                ? "/platform/youth"
                : data.user.role === "partner"
                  ? "/platform/offers"
                  : "/platform/youth"
            }
            className="button button-primary"
          >
            {t(
              professional
                ? "Voir les dossiers synchronisés"
                : data.user.role === "partner"
                  ? "Gérer mes opportunités"
                  : "Voir mon parcours",
            )}
            <ArrowRight size={17} />
          </Link>
        </div>
        <div className="p-hero-art">
          <div className="p-orbit">
            <span>{t("بداية")}</span>
            <small>{t("Un nouveau départ")}</small>
          </div>
          <div className="p-hero-caption">
            <span className="p-live-dot">{t("Données enregistrées")}</span>
            <p>
              {t("De la rencontre")}
              <br />
              {t("à l’opportunité.")}
            </p>
          </div>
        </div>
      </section>
      <Metrics
        items={[
          ["Jeunes accompagnés", data.people.length, "Dans ton périmètre"],
          [
            "Dossiers validés",
            data.people.filter((p) => p.status === "validated").length,
            "Prêts pour l’orientation",
          ],
          [
            "Orientations acceptées",
            data.referrals.filter((r) => r.status === "accepted").length,
            "Acceptées par le partenaire",
          ],
          ["Suivis en retard", overdue.length, "À contacter en priorité"],
        ]}
      />
      <div className="p-two-columns">
        <section className="p-panel">
          <div className="p-panel-head">
            <h2>
              {t(
                data.user.role === "partner"
                  ? "Orientations reçues"
                  : "Les derniers parcours",
              )}
            </h2>
            <Link
              href={
                data.user.role === "partner"
                  ? "/platform/offers"
                  : "/platform/youth"
              }
            >
              {t("Tout voir ")}
              <ArrowRight size={14} />
            </Link>
          </div>
          {data.user.role === "partner" ? (
            <Referrals data={data} mutate={mutate} />
          ) : data.people.length ? (
            data.people.slice(0, 5).map((person) => (
              <Link
                className="p-person"
                key={person.id}
                href={`/platform/youth/${person.id}`}
              >
                <span className="avatar">{person.data.name[0]}</span>
                <div>
                  <b>{person.data.name}</b>
                  <small>
                    {person.data.commune} {t(" · Profil ")}
                    {t(person.data.profile)}
                  </small>
                </div>
                <Tag tone={person.status === "validated" ? "teal" : "orange"}>
                  {t(statuses[person.status])}
                </Tag>
                <ArrowRight size={16} />
              </Link>
            ))
          ) : (
            <Empty>
              {t(
                "Ton compte n’est pas encore lié à un dossier. Contacte ton médiateur.",
              )}
            </Empty>
          )}
        </section>
        <section className="p-panel">
          <h2>{t("Le prochain pas")}</h2>
          <p className="p-muted">
            {t("Une action concrète pour faire avancer les parcours.")}
          </p>
          {overdue.length ? (
            overdue.slice(0, 4).map((f) => (
              <Link className="p-person" key={f.id} href="/platform/followup">
                <span className="p-date">
                  <Bell size={18} />
                </span>
                <div>
                  <b>
                    {data.people.find((p) => p.id === f.youth_id)?.data.name}
                  </b>
                  <small>{f.note}</small>
                </div>
                <Tag tone="orange">{t("À relancer")}</Tag>
              </Link>
            ))
          ) : (
            <div className="p-calm">
              <Check size={25} />
              <h3>{t("Aucun suivi en retard")}</h3>
              <p>{t("Prépare les prochaines rencontres dans l’agenda.")}</p>
            </div>
          )}
          <Link
            href={
              data.user.role === "partner"
                ? "/platform/messages"
                : "/platform/agenda"
            }
            className="button button-secondary"
          >
            {t(
              data.user.role === "partner"
                ? "Contacter l’équipe"
                : "Ouvrir l’agenda",
            )}
            <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </>
  );
}

function YouthList({
  data,
  professional,
}: {
  data: PlatformData;
  professional: boolean;
}) {
  const { t, text, formatted } = useTranslation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const people = data.people.filter(
    (p) =>
      `${p.data.name} ${p.data.commune}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (status === "all" || p.status === status),
  );
  return (
    <>
      <Header
        title={text(
          professional ? "Chaque jeune, un parcours." : "Mon dossier",
        )}
        description={
          professional
            ? "Les diagnostics enregistrés dans l’application mobile arrivent ici pour être vérifiés, corrigés et orientés."
            : "Retrouve ton diagnostic, les étapes et les prochaines actions."
        }
      />
      <div className="p-toolbar">
        <label className="p-search">
          <Search size={17} />
          <input
            aria-label={text("Rechercher un jeune")}
            placeholder={text("Nom ou commune…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <select
          className="field-input"
          aria-label={text("Filtrer par statut")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">{t("Tous les dossiers")}</option>
          <option value="pending">{t("À valider")}</option>
          <option value="validated">{t("Validés")}</option>
          <option value="revision">{t("À corriger")}</option>
        </select>
      </div>
      <section className="p-panel">
        {people.length ? (
          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr>
                  <th>{t("Jeune")}</th>
                  <th>{t("Commune")}</th>
                  <th>{t("Profil")}</th>
                  <th>{t("Statut")}</th>
                  <th>{t("Dernière mise à jour")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <b>{p.data.name}</b>
                      <small>
                        {t(ageAt(p.data.birthDate))} {t(" ans ·")}
                        {t(" ")}
                        {t(p.data.rural ? "Rural" : "Urbain")}
                      </small>
                    </td>
                    <td>{p.data.commune}</td>
                    <td>
                      <Tag>{t(p.data.profile)}</Tag>
                    </td>
                    <td>
                      <Tag tone={p.status === "validated" ? "teal" : "orange"}>
                        {t(statuses[p.status])}
                      </Tag>
                    </td>
                    <td>{t(formatted(p.updated_at))}</td>
                    <td>
                      <Link
                        href={`/platform/youth/${p.id}`}
                        className="p-text-link"
                      >
                        {t("Ouvrir ")}
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>{t("Aucun dossier pour ce filtre.")}</Empty>
        )}
      </section>
    </>
  );
}

export function DiagnosisForm({
  onSave,
  youth,
  offline = false,
}: {
  onSave: Mutation;
  youth?: Youth;
  offline?: boolean;
}) {
  const { t, text } = useTranslation();

  const [saved, setSaved] = useState(false);
  const recordId = useRef<string | null>(youth?.id || null);
  const d = youth?.data;
  async function submit(e: FormEvent<HTMLFormElement>) {
    const f = formData(e);
    if (!recordId.current) recordId.current = crypto.randomUUID();
    const diagnosis: Diagnosis = {
      name: string(f, "name"),
      birthDate: string(f, "birthDate"),
      gender: string(f, "gender") as Diagnosis["gender"],
      phone: string(f, "phone"),
      commune: string(f, "commune"),
      rural: f.has("rural"),
      education: string(f, "education") as Diagnosis["education"],
      situation: string(f, "situation") as Diagnosis["situation"],
      skills: string(f, "skills"),
      interests: string(f, "interests"),
      mobility: string(f, "mobility") as Diagnosis["mobility"],
      childcare: f.has("childcare"),
      availability: string(f, "availability") as Diagnosis["availability"],
      profile: string(f, "profile") as Diagnosis["profile"],
      consent: f.has("consent"),
      partnerConsent: f.has("partnerConsent"),
      guardianName: string(f, "guardianName"),
      consentAt: d?.consentAt || new Date().toISOString(),
    };
    if (
      await onSave("save-youth", {
        id: recordId.current,
        data: diagnosis,
        version: youth?.version || 0,
      })
    )
      setSaved(true);
  }
  if (saved)
    return (
      <section className="p-panel p-success">
        <Check size={40} />
        <h1>{t("Diagnostic enregistré.")}</h1>
        <p>
          {t(
            offline
              ? "Le dossier est conservé sur cet appareil. Il attend sa synchronisation."
              : "Le dossier est conservé dans la base et attend sa validation.",
          )}
        </p>
        <Link href="/platform/youth" className="button button-primary">
          {t("Voir les dossiers ")}
          <ArrowRight size={16} />
        </Link>
      </section>
    );
  return (
    <>
      <Header
        title={text(
          youth
            ? "Corriger le diagnostic"
            : "Une rencontre. Un premier diagnostic.",
        )}
        description="Renseigne la situation du jeune de 15 à 29 ans avec son accord. Les champs servent à préparer son accompagnement."
      />
      <form className="p-panel p-form" onSubmit={submit}>
        <h2>{t("01 · Identité & contact")}</h2>
        <div className="p-form-grid">
          <Field label={text("Nom complet")} name="name" value={d?.name} />
          <Field
            label={text("Date de naissance")}
            name="birthDate"
            type="date"
            value={d?.birthDate}
          />
          <Select
            label={text("Genre")}
            name="gender"
            value={d?.gender}
            options={[
              ["F", "Femme"],
              ["M", "Homme"],
            ]}
          />
          <Field
            label={text("Téléphone du jeune ou d’un proche")}
            name="phone"
            type="tel"
            value={d?.phone}
          />
          <Field
            label={text("Commune / douar")}
            name="commune"
            value={d?.commune}
          />
          <Field
            label={text("Représentant légal (obligatoire si mineur)")}
            name="guardianName"
            required={false}
            value={d?.guardianName}
          />
        </div>
        <CheckField name="rural" checked={d?.rural}>
          {t("Résidence en milieu rural")}
        </CheckField>
        <h2>{t("02 · Situation & aspirations")}</h2>
        <div className="p-form-grid">
          <Select
            label={text("Niveau scolaire")}
            name="education"
            value={d?.education}
            options={[
              ["none", "Sans diplôme"],
              ["college", "Collège"],
              ["bac", "Baccalauréat"],
              ["qualified", "Diplôme / qualification professionnelle"],
            ]}
          />
          <Select
            label={text("Situation actuelle")}
            name="situation"
            value={d?.situation}
            options={[
              ["inactive", "Inactif, sans recherche active"],
              ["seeking", "En recherche d’emploi"],
            ]}
          />
          <Field
            label={text("Compétences (séparées par des virgules)")}
            name="skills"
            value={d?.skills}
          />
          <Field
            label={text("Intérêts et aspirations")}
            name="interests"
            value={d?.interests}
          />
          <Select
            label={text("Mobilité")}
            name="mobility"
            value={d?.mobility}
            options={[
              ["local", "Commune uniquement"],
              ["regional", "Déplacement régional possible"],
            ]}
          />
          <Select
            label={text("Disponibilité")}
            name="availability"
            value={d?.availability}
            options={[
              ["flexible", "Temps plein / flexible"],
              ["part-time", "Temps partiel uniquement"],
            ]}
          />
        </div>
        <CheckField name="childcare" checked={d?.childcare}>
          {t("Une solution de garde d’enfants est nécessaire")}
        </CheckField>
        <h2>{t("03 · Synthèse & consentement")}</h2>
        <Select
          label={text("Profil proposé par le médiateur")}
          name="profile"
          value={d?.profile}
          options={[
            ["A", "A · Prêt à l’emploi"],
            ["B", "B · À requalifier"],
            ["C", "C · Remobilisation progressive"],
          ]}
        />
        <div className="p-consent">
          <p>
            {t(
              "Explique au jeune la collecte pour son accompagnement, les destinataires et son droit de demander une correction ou un retrait auprès de l’équipe. Le formulaire consigne l’accord déclaré ; il ne constitue pas une signature électronique certifiée.",
            )}
          </p>
          <CheckField name="consent" checked={d?.consent} required>
            {t(
              "Le jeune accepte l’enregistrement pour son accompagnement ; l’accord du représentant légal a été recueilli si nécessaire.",
            )}
          </CheckField>
          <CheckField name="partnerConsent" checked={d?.partnerConsent}>
            {t(
              "Le jeune autorise la transmission des informations nécessaires à une orientation partenaire.",
            )}
          </CheckField>
        </div>
        <button className="button button-primary" type="submit">
          {t("Enregistrer le diagnostic ")}
          <ArrowRight size={16} />
        </button>
      </form>
    </>
  );
}

function YouthDetail({
  youth,
  data,
  professional,
  mutate,
}: {
  youth: Youth;
  data: PlatformData;
  professional: boolean;
  mutate: Mutation;
}) {
  const { t, text, formatted } = useTranslation();

  const [edit, setEdit] = useState(false);
  const [agree, setAgree] = useState(false);
  if (edit)
    return (
      <>
        <button className="p-text-link" onClick={() => setEdit(false)}>
          {t("← Retour au dossier")}
        </button>
        <DiagnosisForm youth={youth} onSave={mutate} />
      </>
    );
  const progress = journeyState(
    (data.journeys || []).filter((e) => e.youth_id === youth.id),
  );
  const matches = matchOffers(
    youth,
    data.offers,
    data.referrals,
    new Date(),
    progress.activation?.data,
  );
  const duplicates = data.people.filter(
    (p) =>
      p.id !== youth.id &&
      p.data.name.toLowerCase() === youth.data.name.toLowerCase() &&
      p.data.birthDate === youth.data.birthDate,
  );
  return (
    <>
      <Header
        title={text(youth.data.name)}
        description={`${ageAt(youth.data.birthDate)} ans · ${youth.data.commune} · Profil ${youth.data.profile}`}
        action={
          professional &&
          youth.status !== "validated" && (
            <button
              className="button button-secondary"
              onClick={() => setEdit(true)}
            >
              {t("Modifier le diagnostic")}
            </button>
          )
        }
      />
      <div className="p-two-columns">
        <section className="p-panel">
          <h2>{t("Le diagnostic")}</h2>
          <dl className="p-details">
            <dt>{t("Statut")}</dt>
            <dd>
              <Tag>{t(statuses[youth.status])}</Tag>
            </dd>
            <dt>{t("Situation")}</dt>
            <dd>
              {t(
                youth.data.situation === "seeking"
                  ? "Recherche active"
                  : "Inactif",
              )}
            </dd>
            <dt>{t("Contact")}</dt>
            <dd>{t(youth.data.phone)}</dd>
            <dt>{t("Compétences")}</dt>
            <dd>{youth.data.skills}</dd>
            <dt>{t("Aspirations")}</dt>
            <dd>{youth.data.interests}</dd>
            <dt>{t("Mobilité")}</dt>
            <dd>
              {t(youth.data.mobility === "local" ? "Locale" : "Régionale")}
            </dd>
            <dt>{t("Disponibilité")}</dt>
            <dd>
              {t(
                youth.data.availability === "part-time"
                  ? "Temps partiel"
                  : "Flexible",
              )}
            </dd>
            <dt>{t("Garde d’enfants")}</dt>
            <dd>{t(youth.data.childcare ? "Nécessaire" : "Non déclarée")}</dd>
            <dt>{t("Consentement")}</dt>
            <dd>
              {t(formatted(youth.data.consentAt))} {t(" ·")}
              {t(" ")}
              {t(
                youth.data.partnerConsent
                  ? "Transmission autorisée"
                  : "Accompagnement uniquement",
              )}
            </dd>
          </dl>
          {youth.review_note && (
            <div className="p-error">
              {t("Révision : ")}
              {t(youth.review_note)}
            </div>
          )}
          {duplicates.length > 0 && (
            <div className="p-error">
              {t("Doublon potentiel :")}
              {t(" ")}
              {duplicates.map((p) => p.data.name).join(", ")}
              {t(". Vérifie l’identité avant validation.")}
            </div>
          )}
        </section>
        <section className="p-panel">
          <h2>{t("Validation & accompagnement")}</h2>
          <p className="p-muted">
            {t(
              "La validation prépare l’orientation. Une recommandation ne garantit pas une place ni un emploi.",
            )}
          </p>
          {data.user.role === "admin" ? (
            <form
              className="p-form"
              onSubmit={(e) => {
                const f = formData(e);
                void mutate("review", {
                  youthId: youth.id,
                  status: string(f, "status"),
                  note: string(f, "note"),
                });
              }}
            >
              <Select
                label={text("Décision de consolidation")}
                name="status"
                options={[
                  ["validated", "Valider le dossier"],
                  ["revision", "Demander une correction"],
                ]}
              />
              <Field
                label={text("Motif / remarque")}
                name="note"
                required={false}
              />
              <button className="button button-primary">
                {t("Enregistrer la décision")}
              </button>
            </form>
          ) : (
            <div className="p-calm">
              <ShieldCheck size={25} />
              <p>
                {t(
                  youth.status === "validated"
                    ? "Dossier validé par l’administration."
                    : "L’administration doit valider le dossier avant orientation.",
                )}
              </p>
            </div>
          )}
          {data.user.role === "admin" && (
            <form
              className="p-form p-divider"
              onSubmit={(e) => {
                const f = formData(e);
                void mutate("link-account", {
                  youthId: youth.id,
                  userId: string(f, "userId"),
                });
              }}
            >
              <Select
                label={text("Associer un compte jeune")}
                name="userId"
                value={youth.user_id || ""}
                options={[
                  ["", "Choisir un compte"],
                  ...data.contacts
                    .filter((c) => c.role === "neet")
                    .map((c) => [c.id, c.name] as [string, string]),
                ]}
              />
              <button className="button button-secondary">
                {t("Associer le compte")}
              </button>
            </form>
          )}
        </section>
      </div>
      <JourneyPanel
        key={youth.id}
        youth={youth}
        data={data}
        mutate={mutate}
        editable={professional}
      />
      <section className="p-panel p-space">
        <div className="p-panel-head">
          <h2>{t("Les parcours recommandés")}</h2>
          <Tag>{t("Règles V1 · explications visibles")}</Tag>
        </div>
        {youth.status !== "validated" ? (
          <Empty>{t("Valide le dossier pour préparer une orientation.")}</Empty>
        ) : !progress.activation ? (
          <Empty>
            {t(
              "Confirme l’entrée au programme et le résultat de l’activation pour préparer l’orientation.",
            )}
          </Empty>
        ) : matches.length ? (
          <>
            <div className="p-card-grid">
              {matches.map((m) => (
                <article className="p-opportunity" key={m.offer.id}>
                  <div className="p-opportunity-top">
                    <Tag>{t(m.offer.data.type)}</Tag>
                    <strong>
                      {t(m.score)}
                      {t("/100")}
                    </strong>
                  </div>
                  <h3>{m.offer.data.title}</h3>
                  <p>
                    {m.offer.data.organization} {t(" · ")}
                    {m.offer.data.commune}
                  </p>
                  <ul>
                    {m.reasons.map((r) => (
                      <li key={r}>{t(r)}</li>
                    ))}
                  </ul>
                  {professional && (
                    <button
                      className="button button-primary"
                      disabled={
                        !agree ||
                        !youth.data.partnerConsent ||
                        data.referrals.some(
                          (r) =>
                            r.youth_id === youth.id &&
                            r.offer_id === m.offer.id,
                        )
                      }
                      onClick={() =>
                        mutate("refer", {
                          youthId: youth.id,
                          offerId: m.offer.id,
                          youthAgreed: true,
                        })
                      }
                    >
                      {t(
                        data.referrals.some(
                          (r) =>
                            r.youth_id === youth.id &&
                            r.offer_id === m.offer.id,
                        )
                          ? "Déjà orienté"
                          : "Valider cette orientation",
                      )}
                    </button>
                  )}
                </article>
              ))}
            </div>
            {professional && (
              <label className="p-checkbox p-space">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
                {t(
                  "J’ai présenté les options au jeune ; il accepte l’orientation sélectionnée.",
                )}
              </label>
            )}
            {!youth.data.partnerConsent && (
              <p className="p-error">
                {t(
                  "La transmission partenaire n’est pas autorisée dans ce diagnostic.",
                )}
              </p>
            )}
          </>
        ) : (
          <Empty>
            {t(
              "Aucune offre disponible ne respecte toutes les contraintes. Prépare une activité locale et réexamine le catalogue.",
            )}
          </Empty>
        )}
      </section>
      <section className="p-panel p-space">
        <h2>{t("Orientations du dossier")}</h2>
        <Referrals data={data} mutate={mutate} youthId={youth.id} />
      </section>
    </>
  );
}

function Referrals({
  data,
  mutate,
  youthId,
}: {
  data: PlatformData;
  mutate: Mutation;
  youthId?: string;
}) {
  const { t } = useTranslation();

  const refs = data.referrals.filter((r) => !youthId || r.youth_id === youthId);
  return refs.length ? (
    <div>
      {refs.map((r) => (
        <div className="p-referral" key={r.id}>
          <div>
            <b>
              {data.offers.find((o) => o.id === r.offer_id)?.data.title ||
                "Offre archivée"}
            </b>
            <p>
              {data.people.find((p) => p.id === r.youth_id)?.data.name}{" "}
              {t(" · Score")}
              {t(" ")}
              {t(r.score)}
              {t("/100")}
            </p>
            <small>{t(r.reasons.join(" · "))}</small>
          </div>
          <Tag tone={r.status === "rejected" ? "orange" : "teal"}>
            {t(statuses[r.status])}
          </Tag>
          {r.status === "proposed" &&
            ["admin", "partner"].includes(data.user.role) && (
              <div className="p-actions">
                <button
                  className="button button-primary"
                  onClick={() =>
                    mutate("referral-status", {
                      referralId: r.id,
                      status: "accepted",
                    })
                  }
                >
                  {t("Accepter")}
                </button>
                <button
                  className="button button-secondary"
                  onClick={() =>
                    mutate("referral-status", {
                      referralId: r.id,
                      status: "rejected",
                    })
                  }
                >
                  {t("Refuser")}
                </button>
              </div>
            )}
          {["proposed", "accepted"].includes(r.status) &&
            data.user.role !== "partner" && (
              <button
                className="p-text-link"
                onClick={() =>
                  mutate("referral-status", {
                    referralId: r.id,
                    status: "withdrawn",
                  })
                }
              >
                {t("Retirer l’orientation")}
              </button>
            )}
        </div>
      ))}
    </div>
  ) : (
    <Empty>{t("Aucune orientation pour le moment.")}</Empty>
  );
}

function Offers({ data, mutate }: { data: PlatformData; mutate: Mutation }) {
  const { t, text, formatted } = useTranslation();

  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState<Offer | undefined>();
  const [search, setSearch] = useState("");
  const manage = ["admin", "partner"].includes(data.user.role);
  return (
    <>
      <Header
        title={text("Des opportunités concrètes.")}
        description="Un catalogue pour construire des parcours adaptés aux contraintes de chaque jeune."
        action={
          manage && (
            <button
              className="button button-primary"
              onClick={() => {
                setEditing(undefined);
                setShow(!show);
              }}
            >
              <Plus size={16} />
              {t("Publier une offre")}
            </button>
          )
        }
      />
      {show && (
        <OfferForm
          key={editing?.id || "new"}
          offer={editing}
          mutate={mutate}
          done={() => setShow(false)}
        />
      )}
      <div className="p-toolbar">
        <label className="p-search">
          <Search size={17} />
          <input
            aria-label={text("Rechercher une opportunité")}
            placeholder={text("Métier, organisme ou commune…")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>
      <div className="p-card-grid">
        {data.offers
          .filter((o) =>
            `${o.data.title} ${o.data.organization} ${o.data.commune}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((o) => (
            <article className="p-panel p-opportunity" key={o.id}>
              <Tag tone={o.active ? "teal" : "orange"}>
                {t(o.active ? o.data.type : "Suspendue")}
              </Tag>
              <h2>{o.data.title}</h2>
              <p>
                {o.data.organization} {t(" · ")}
                {o.data.commune}
              </p>
              <p>{o.data.description}</p>
              <div className="p-offer-meta">
                <span>
                  {t(o.data.minAge)}
                  {t("–")}
                  {t(o.data.maxAge)} {t(" ans")}
                </span>
                <span>
                  {t("Capacité : ")}
                  {t(o.data.capacity)}
                </span>
                <span>
                  {t("Avant le ")}
                  {t(formatted(o.data.deadline))}
                </span>
              </div>
              {manage && (
                <div className="p-actions">
                  <button
                    className="button button-secondary"
                    onClick={() => {
                      setEditing(o);
                      setShow(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {t("Modifier")}
                  </button>
                  <button
                    className="p-text-link"
                    onClick={() =>
                      mutate("toggle-offer", {
                        offerId: o.id,
                        active: !o.active,
                      })
                    }
                  >
                    {t(o.active ? "Suspendre" : "Réactiver")}
                  </button>
                </div>
              )}
            </article>
          ))}
      </div>
      {!data.offers.length && <Empty>{t("Aucune opportunité publiée.")}</Empty>}
      <section className="p-panel p-space">
        <h2>{t("Orientations & réponses partenaires")}</h2>
        <Referrals data={data} mutate={mutate} />
      </section>
    </>
  );
}
function OfferForm({
  offer,
  mutate,
  done,
}: {
  offer?: Offer;
  mutate: Mutation;
  done: () => void;
}) {
  const { t, text } = useTranslation();

  const d = offer?.data;
  return (
    <form
      className="p-panel p-form p-space"
      onSubmit={async (e) => {
        const f = formData(e);
        const values: OfferData = {
          title: string(f, "title"),
          organization: string(f, "organization"),
          type: string(f, "type") as OfferData["type"],
          commune: string(f, "commune"),
          minAge: Number(f.get("minAge")),
          maxAge: Number(f.get("maxAge")),
          education: string(f, "education") as OfferData["education"],
          skills: string(f, "skills"),
          capacity: Number(f.get("capacity")),
          deadline: string(f, "deadline"),
          partTime: f.has("partTime"),
          childcare: f.has("childcare"),
          description: string(f, "description"),
        };
        if (await mutate("save-offer", { id: offer?.id, data: values })) done();
      }}
    >
      <h2>
        {t(offer ? "Modifier l’opportunité" : "Une nouvelle opportunité")}
      </h2>
      <div className="p-form-grid">
        <Field label={text("Titre")} name="title" value={d?.title} />
        <Field
          label={text("Organisme")}
          name="organization"
          value={d?.organization}
        />
        <Select
          label={text("Type")}
          name="type"
          value={d?.type}
          options={["Formation", "Emploi", "Stage", "Entrepreneuriat"].map(
            (v) => [v, v],
          )}
        />
        <Field
          label={text("Commune (ou En ligne)")}
          name="commune"
          value={d?.commune}
        />
        <Field
          label={text("Âge minimum")}
          name="minAge"
          type="number"
          min={15}
          max={29}
          value={d?.minAge || 18}
        />
        <Field
          label={text("Âge maximum")}
          name="maxAge"
          type="number"
          min={15}
          max={29}
          value={d?.maxAge || 29}
        />
        <Select
          label={text("Diplôme requis")}
          name="education"
          value={d?.education}
          options={[
            ["any", "Aucun prérequis de diplôme"],
            ["bac", "Baccalauréat"],
            ["qualified", "Qualification professionnelle"],
          ]}
        />
        <Field
          label={text("Compétences / mots-clés")}
          name="skills"
          value={d?.skills}
        />
        <Field
          label={text("Nombre de places")}
          name="capacity"
          type="number"
          min={1}
          max={1000}
          value={d?.capacity || 10}
        />
        <Field
          label={text("Date limite")}
          name="deadline"
          type="date"
          value={d?.deadline}
        />
      </div>
      <Field
        label={text("Description")}
        name="description"
        value={d?.description}
      />
      <CheckField name="partTime" checked={d?.partTime}>
        {t("Compatible avec le temps partiel")}
      </CheckField>
      <CheckField name="childcare" checked={d?.childcare}>
        {t("Une solution de garde est disponible")}
      </CheckField>
      <div className="p-actions">
        <button className="button button-primary">
          {t("Enregistrer l’offre")}
        </button>
        <button
          type="button"
          className="button button-secondary"
          onClick={done}
        >
          {t("Annuler")}
        </button>
      </div>
    </form>
  );
}

function YouthSelect({ data }: { data: PlatformData }) {
  const { text } = useTranslation();

  return (
    <Select
      label={text("Jeune concerné")}
      name="youthId"
      options={[
        ["", "Choisir un jeune"],
        ...data.people.map((p) => [p.id, p.data.name] as [string, string]),
      ]}
    />
  );
}
function Activities({
  data,
  professional,
  mutate,
}: {
  data: PlatformData;
  professional: boolean;
  mutate: Mutation;
}) {
  const { t, text, formatted } = useTranslation();

  const [show, setShow] = useState(false);
  return (
    <>
      <Header
        title={text("Une première victoire.")}
        description="Des activités locales pour reprendre confiance, découvrir et apprendre."
        action={
          professional && (
            <button
              className="button button-primary"
              onClick={() => setShow(!show)}
            >
              <Plus size={16} />
              {t("Créer une activité")}
            </button>
          )
        }
      />
      {show && (
        <form
          className="p-panel p-form p-space"
          onSubmit={async (e) => {
            const f = formData(e);
            if (
              await mutate("activity", {
                title: string(f, "title"),
                commune: string(f, "commune"),
                date: string(f, "date"),
                capacity: Number(f.get("capacity")),
                category: string(f, "category"),
              })
            )
              setShow(false);
          }}
        >
          <div className="p-form-grid">
            <Field label={text("Activité")} name="title" />
            <Field label={text("Commune")} name="commune" />
            <Field label={text("Date")} name="date" type="date" />
            <Field
              label={text("Capacité")}
              name="capacity"
              type="number"
              min={1}
              max={1000}
            />
            <Select
              label={text("Catégorie")}
              name="category"
              options={[
                "Remobilisation",
                "Employabilité",
                "Compétences",
                "Immersion",
                "Entrepreneuriat",
              ].map((v) => [v, v])}
            />
          </div>
          <button className="button button-primary">
            {t("Enregistrer l’activité")}
          </button>
        </form>
      )}
      <div className="p-card-grid">
        {data.activities.map((a) => (
          <section key={a.id} className="p-panel">
            <Tag>{t(a.data.category)}</Tag>
            <h2 className="p-space">{a.data.title}</h2>
            <p>
              {a.data.commune} {t(" · ")}
              {t(formatted(a.data.date))}
            </p>
            <p className="p-muted">
              {t("Capacité : ")}
              {t(a.data.capacity)}
            </p>
            {data.participations
              .filter((p) => p.activity_id === a.id)
              .map((p) => (
                <div key={p.id} className="p-person">
                  <div>
                    <b>
                      {data.people.find((y) => y.id === p.youth_id)?.data.name}
                    </b>
                    <small>
                      {t(p.attended ? "Présence confirmée" : "Inscrit")}
                    </small>
                  </div>
                  {professional && (
                    <button
                      className="p-text-link"
                      onClick={() =>
                        mutate("participation", {
                          youthId: p.youth_id,
                          activityId: a.id,
                          attended: !p.attended,
                        })
                      }
                    >
                      {t(
                        p.attended
                          ? "Corriger la présence"
                          : "Confirmer présence",
                      )}
                    </button>
                  )}
                </div>
              ))}
            {professional && (
              <form
                className="p-form p-space"
                onSubmit={(e) => {
                  const f = formData(e);
                  void mutate("participation", {
                    youthId: string(f, "youthId"),
                    activityId: a.id,
                    attended: false,
                  });
                }}
              >
                <YouthSelect data={data} />
                <button className="button button-secondary">
                  {t("Inscrire le jeune")}
                </button>
              </form>
            )}
          </section>
        ))}
      </div>
      {!data.activities.length && (
        <Empty>{t("Aucune activité planifiée.")}</Empty>
      )}
    </>
  );
}

function Followups({
  data,
  professional,
  mutate,
}: {
  data: PlatformData;
  professional: boolean;
  mutate: Mutation;
}) {
  const { t, text, formatted } = useTranslation();

  return (
    <>
      <Header
        title={text("Garder le lien.")}
        description="Planifie les contacts et consigne les résultats pour repérer les blocages."
      />
      {professional && (
        <form
          className="p-panel p-form p-space"
          onSubmit={async (e) => {
            const form = e.currentTarget;
            const f = formData(e);
            if (
              await mutate("followup", {
                youthId: string(f, "youthId"),
                dueDate: string(f, "dueDate"),
                note: string(f, "note"),
                outcome: string(f, "outcome"),
              })
            )
              form.reset();
          }}
        >
          <h2>{t("Planifier ou enregistrer un contact")}</h2>
          <div className="p-form-grid">
            <YouthSelect data={data} />
            <Field
              label={text("Date de suivi")}
              name="dueDate"
              type="date"
              value={today()}
            />
            <Select
              label={text("Résultat")}
              name="outcome"
              options={Object.entries(statuses).filter(([k]) =>
                [
                  "planned",
                  "completed",
                  "unreachable",
                  "dropout",
                  "inserted",
                ].includes(k),
              )}
            />
            <Field label={text("Observation / action prévue")} name="note" />
          </div>
          <button className="button button-primary">
            {t("Enregistrer le suivi")}
          </button>
        </form>
      )}
      <section className="p-panel p-space">
        <h2>{t("La file de suivi")}</h2>
        {data.followups.length ? (
          data.followups.map((f) => (
            <div className="p-followup" key={f.id}>
              <div>
                <b>{data.people.find((p) => p.id === f.youth_id)?.data.name}</b>
                <p>{f.note}</p>
                <small>{t(formatted(f.due_date))}</small>
              </div>
              <Tag
                tone={
                  f.outcome === "planned" && f.due_date.slice(0, 10) < today()
                    ? "orange"
                    : "teal"
                }
              >
                {t(
                  f.outcome === "planned" && f.due_date.slice(0, 10) < today()
                    ? "En retard"
                    : statuses[f.outcome],
                )}
              </Tag>
              {professional && f.outcome === "planned" && (
                <form
                  className="p-inline-form"
                  onSubmit={(e) => {
                    const values = formData(e);
                    void mutate("complete-followup", {
                      id: f.id,
                      outcome: string(values, "outcome"),
                      note: string(values, "note"),
                    });
                  }}
                >
                  <Select
                    label={text("Résultat du contact")}
                    name="outcome"
                    options={Object.entries(statuses).filter(([k]) =>
                      [
                        "completed",
                        "unreachable",
                        "dropout",
                        "inserted",
                      ].includes(k),
                    )}
                  />
                  <Field
                    label={text("Compte rendu")}
                    name="note"
                    value={f.note}
                  />
                  <button className="button button-secondary">
                    {t("Clôturer")}
                  </button>
                </form>
              )}
            </div>
          ))
        ) : (
          <Empty>{t("Aucun suivi enregistré.")}</Empty>
        )}
      </section>
    </>
  );
}

function Agenda({
  data,
  professional,
  mutate,
}: {
  data: PlatformData;
  professional: boolean;
  mutate: Mutation;
}) {
  const { t, text, locale } = useTranslation();

  return (
    <>
      <Header
        title={text("Préparer les rencontres.")}
        description="Un agenda partagé pour accompagner chaque étape."
      />
      {professional && (
        <form
          className="p-panel p-form p-space"
          onSubmit={async (e) => {
            const form = e.currentTarget;
            const f = formData(e);
            const startsAt = new Date(string(f, "startsAt")).toISOString();
            if (
              await mutate("appointment", {
                youthId: string(f, "youthId"),
                startsAt,
                title: string(f, "title"),
                location: string(f, "location"),
              })
            )
              form.reset();
          }}
        >
          <h2>{t("Un nouveau rendez-vous")}</h2>
          <div className="p-form-grid">
            <YouthSelect data={data} />
            <Field
              label={text("Date et heure (heure de ton appareil)")}
              name="startsAt"
              type="datetime-local"
            />
            <Field label={text("Objet")} name="title" />
            <Field label={text("Lieu")} name="location" />
          </div>
          <button className="button button-primary">
            {t("Planifier le rendez-vous")}
          </button>
        </form>
      )}
      <section className="p-panel p-space">
        <h2>{t("Les rendez-vous")}</h2>
        {data.appointments.length ? (
          data.appointments.map((a) => (
            <div className="p-person" key={a.id}>
              <span className="p-date">
                <CalendarDays />
              </span>
              <div>
                <b>{t(a.title)}</b>
                <small>
                  {data.people.find((p) => p.id === a.youth_id)?.data.name}{" "}
                  {t(" ·")}
                  {t(" ")}
                  {t(a.location)}
                </small>
                <p>
                  {t(
                    new Date(a.starts_at).toLocaleString(
                      locale === "ar" ? "ar-MA" : "fr-MA",
                      {
                        timeZone: "Africa/Casablanca",
                      },
                    ),
                  )}
                  {t(" ")}
                  {t("· Maroc")}
                </p>
              </div>
            </div>
          ))
        ) : (
          <Empty>{t("Aucun rendez-vous planifié.")}</Empty>
        )}
      </section>
    </>
  );
}

function Messages({ data, mutate }: { data: PlatformData; mutate: Mutation }) {
  const { t, text, formatted } = useTranslation();

  const [recipient, setRecipient] = useState(data.contacts[0]?.id || "");
  return (
    <>
      <Header
        title={text("Le dialogue fait avancer.")}
        description="Les messages sont conservés dans la plateforme. Aucun SMS ou e-mail externe n’est envoyé."
      />
      <div className="p-two-columns">
        <section className="p-panel">
          <h2>{t("Écrire à l’équipe")}</h2>
          <form
            className="p-form"
            onSubmit={async (e) => {
              const form = e.currentTarget;
              const f = formData(e);
              if (
                await mutate("message", {
                  recipientId: recipient,
                  body: string(f, "body"),
                })
              )
                form.reset();
            }}
          >
            <label className="form-field">
              {t("Destinataire")}
              <select
                className="field-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              >
                <option value="">{t("Choisir un contact")}</option>
                {data.contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {t(" · ")}
                    {t(roleNames[c.role])}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-field">
              {t("Message")}
              <textarea
                name="body"
                className="field-input"
                rows={6}
                required
                maxLength={2000}
              />
            </label>
            <button className="button button-primary">
              {t("Envoyer le message ")}
              <ArrowRight size={16} />
            </button>
          </form>
        </section>
        <section className="p-panel">
          <h2>{t("La conversation")}</h2>
          {data.messages.filter(
            (m) => m.sender_id === recipient || m.recipient_id === recipient,
          ).length ? (
            data.messages
              .filter(
                (m) =>
                  m.sender_id === recipient || m.recipient_id === recipient,
              )
              .slice()
              .reverse()
              .map((m) => (
                <div
                  className={`p-message ${m.sender_id === data.user.id ? "p-message-mine" : ""}`}
                  key={m.id}
                >
                  <small>
                    {m.sender_id === data.user.id
                      ? text("Toi")
                      : data.contacts.find((c) => c.id === m.sender_id)?.name}
                    {t(" ")}
                    {t("· ")}
                    {t(formatted(m.created_at))}
                  </small>
                  <p>{m.body}</p>
                </div>
              ))
          ) : (
            <Empty>{t("Aucun message dans cette conversation.")}</Empty>
          )}
        </section>
      </div>
    </>
  );
}

function Team({ data, mutate }: { data: PlatformData; mutate: Mutation }) {
  const { t, text } = useTranslation();

  return (
    <>
      <Header
        title={text("Une équipe, des accès maîtrisés.")}
        description="Les comptes professionnels nécessitent une validation de l’administration."
      />
      <section className="p-panel">
        <h2>{t("Demandes d’accès")}</h2>
        {data.requests.length ? (
          data.requests.map((r) => (
            <div className="p-person" key={r.id}>
              <div>
                <b>{r.name}</b>
                <small>
                  {t(r.email)} {t(" · ")}
                  {r.organization} {t(" · ")}
                  {t(roleNames[r.role])}
                </small>
              </div>
              <button
                className="button button-primary"
                onClick={() =>
                  mutate("access-request", { requestId: r.id, approve: true })
                }
              >
                {t("Approuver")}
              </button>
              <button
                className="button button-secondary"
                onClick={() =>
                  mutate("access-request", { requestId: r.id, approve: false })
                }
              >
                {t("Refuser")}
              </button>
            </div>
          ))
        ) : (
          <Empty>{t("Aucune demande en attente.")}</Empty>
        )}
      </section>
      <section className="p-panel p-space">
        <h2>{t("Les comptes de la plateforme")}</h2>
        {data.contacts.map((c) => (
          <div className="p-person" key={c.id}>
            <span className="avatar">{c.name[0]}</span>
            <div>
              <b>{c.name}</b>
              <small>
                {t(roleNames[c.role])} {t(" · ")}
                {c.organization}
              </small>
            </div>
          </div>
        ))}
      </section>
      <section className="p-panel p-space">
        <h2>{t("Réinitialiser un accès")}</h2>
        <p className="p-muted">
          {t(
            "Toutes les sessions du compte seront fermées. Transmets le nouveau mot de passe au titulaire par un canal approprié.",
          )}
        </p>
        <form
          className="p-form"
          onSubmit={async (e) => {
            const form = e.currentTarget;
            const f = formData(e);
            if (
              await mutate("reset-account", {
                userId: string(f, "userId"),
                password: string(f, "password"),
              })
            )
              form.reset();
          }}
        >
          <Select
            label={text("Compte")}
            name="userId"
            options={[
              ["", "Choisir un compte"],
              ...data.contacts.map((c) => [c.id, c.name] as [string, string]),
            ]}
          />
          <Field
            label={text("Nouveau mot de passe (12 caractères minimum)")}
            name="password"
            type="password"
            min={12}
          />
          <button className="button button-secondary">
            {t("Réinitialiser l’accès")}
          </button>
        </form>
      </section>
    </>
  );
}

function Reports({ data }: { data: PlatformData }) {
  const { t, text, formatted } = useTranslation();

  const states = data.people.map((p) =>
    journeyState((data.journeys || []).filter((e) => e.youth_id === p.id)),
  );
  const inserted = states.filter((s) => s.insertion).length;
  const activated = states.filter((s) => s.activation).length;
  const onboarded = states.filter((s) => s.onboarding).length;
  const stabilized = states.filter((s) => s.stabilized).length;
  const oriented = new Set(
    data.referrals
      .filter((r) => ["proposed", "accepted"].includes(r.status))
      .map((r) => r.youth_id),
  ).size;
  function exportData() {
    downloadCsv("bidayaneet-parcours.csv", [
      [
        "Identifiant",
        "Nom",
        "Commune",
        "Profil",
        "Statut",
        "Parcours",
        "Entrée au programme",
        "Activation",
        "Entrée effective en activité",
        "Vérification prévue",
        "Dernier contrôle",
        "Maintien confirmé",
      ].map(text),
      ...data.people.map((p) => {
        const progress = journeyState(
          (data.journeys || []).filter((e) => e.youth_id === p.id),
        );
        return [
          p.id,
          p.data.name,
          p.data.commune,
          p.data.profile,
          text(statuses[p.status]),
          text(progress.label),
          progress.onboarding?.data.date || "",
          progress.activation?.data.date || "",
          progress.insertion?.data.date || "",
          progress.insertion?.data.checkDueDate || "",
          progress.check?.data.date || "",
          text(progress.stabilized ? "Oui" : "Non"),
        ];
      }),
    ]);
  }
  return (
    <>
      <Header
        title={text("Mesurer les parcours.")}
        description="Ces indicateurs décrivent les données de démonstration enregistrées, pas un impact réel sur le territoire."
        action={
          <button className="button button-secondary" onClick={exportData}>
            <Download size={16} />
            {t("Exporter les dossiers")}
          </button>
        }
      />
      <Metrics
        items={[
          ["Enregistrés", data.people.length, "Diagnostics conservés"],
          [
            "Validés",
            data.people.filter((p) => p.status === "validated").length,
            "Dossiers contrôlés",
          ],
          ["Activés", activated, "Capacités et projet documentés"],
          ["Orientés", oriented, "Orientation proposée ou acceptée"],
        ]}
      />
      <div className="p-two-columns">
        <section className="p-panel">
          <h2>{t("Le parcours d’accompagnement")}</h2>
          {[
            ["Enregistrés", data.people.length],
            [
              "Validés",
              data.people.filter((p) => p.status === "validated").length,
            ],
            ["Activés", activated],
            ["Orientés", oriented],
            ["Entrées au programme", onboarded],
            ["Entrées en activité documentées", inserted],
            ["Maintien confirmé à l’échéance", stabilized],
          ].map(([l, n]) => (
            <div className="p-funnel" key={String(l)}>
              <span>{t(l)}</span>
              <div>
                <i
                  style={{
                    width: `${data.people.length ? (Number(n) / data.people.length) * 100 : 0}%`,
                  }}
                />
              </div>
              <b>{t(n)}</b>
            </div>
          ))}
          <p className="p-muted p-space">
            {t(
              "L’insertion déclarée correspond à un contact enregistré. Elle nécessite une vérification à M3/M6 pour mesurer l’impact durable.",
            )}
          </p>
        </section>
        <section className="p-panel">
          <h2>{t("La cible reste visible")}</h2>
          <Metrics
            items={[
              [
                "Jeunes femmes",
                data.people.filter((p) => p.data.gender === "F").length,
                "Dans les dossiers",
              ],
              [
                "Jeunes ruraux",
                data.people.filter((p) => p.data.rural).length,
                "Dans les dossiers",
              ],
              [
                "Profils C",
                data.people.filter((p) => p.data.profile === "C").length,
                "Remobilisation progressive",
              ],
            ]}
          />
        </section>
      </div>
      {data.user.role === "admin" && (
        <section className="p-panel p-space">
          <h2>{t("Journal des opérations")}</h2>
          {data.audit.length ? (
            data.audit.map((a) => (
              <div className="p-audit" key={a.id}>
                <b>{t(a.action)}</b>
                <span>
                  {data.contacts.find((c) => c.id === a.actor_id)?.name ||
                    data.user.name}
                </span>
                <small>{t(formatted(a.created_at))}</small>
              </div>
            ))
          ) : (
            <Empty>{t("Aucune opération journalisée.")}</Empty>
          )}
        </section>
      )}
    </>
  );
}
function Account({ data, mutate }: { data: PlatformData; mutate: Mutation }) {
  const { t, text } = useTranslation();

  return (
    <>
      <Header
        title={text("Ton espace personnel.")}
        description="Retrouve les informations de ton compte et protège ton accès."
      />
      <section className="p-panel">
        <dl className="p-details">
          <dt>{t("Nom")}</dt>
          <dd>{data.user.name}</dd>
          <dt>{t("Adresse e-mail")}</dt>
          <dd>{t(data.user.email)}</dd>
          <dt>{t("Espace")}</dt>
          <dd>{t(roleNames[data.user.role])}</dd>
          <dt>{t("Organisme")}</dt>
          <dd>{data.user.organization || "—"}</dd>
        </dl>
        <form
          className="p-form p-space"
          onSubmit={async (e) => {
            const form = e.currentTarget;
            const f = formData(e);
            if (
              await mutate("password", {
                currentPassword: string(f, "currentPassword"),
                password: string(f, "password"),
              })
            )
              form.reset();
          }}
        >
          <h2>{t("Changer mon mot de passe")}</h2>
          <Field
            label={text("Mot de passe actuel")}
            name="currentPassword"
            type="password"
          />
          <Field
            label={text("Nouveau mot de passe (12 caractères minimum)")}
            name="password"
            type="password"
            min={12}
          />
          <button className="button button-primary">
            {t("Enregistrer le mot de passe")}
          </button>
        </form>
      </section>
    </>
  );
}
