"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ArrowUpLeft,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  ChartNoAxesCombined,
  CircleHelp,
  ClipboardList,
  House,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  MessageCircle,
  Settings,
  Sparkles,
  Star,
  UserRound,
  Users,
  X,
  Zap,
  Map,
  ShieldCheck,
} from "lucide-react";
import Brand from "@/components/Brand";
import { useSimulatedState } from "@/lib/simulated-backend";
import { profileFixtures } from "@/lib/demo-data";
import { locationsAr, normalizeYouthProfile, youthName, youthProfileFixture } from "@/lib/youth-ar";
import YouthNotifications from "./YouthNotifications";
import YouthAssistant from "./YouthAssistant";

export type WorkspaceRole = "neet" | "mediator" | "admin" | "partner";
const navigation = {
  neet: [
    ["", "الرئيسية", House],
    ["/opportunities", "فرصي", Settings],
    ["/stories", "قصص ملهمة", Star],
    ["/journey", "مساري", ClipboardList],
    ["/micro-actions", "خطوات صغيرة", ShieldCheck],
    ["/messages", "الرسائل", MessageCircle],
    ["/profile", "ملفي", UserRound],
    ["/help", "المساعدة", CircleHelp],
  ],
  mediator: [
    ["", "Vue d’ensemble", House],
    ["/caseload", "Jeunes accompagnés", Users],
    ["/appointments", "Mon agenda", CalendarDays],
    ["/opportunities", "Opportunités & orientations", BriefcaseBusiness],
    ["/micro-actions", "Actions de terrain", Zap],
    ["/messages", "Messages", MessageCircle],
    ["/reports", "Mon activité", ChartNoAxesCombined],
    ["/profile", "Mon profil", UserRound],
    ["/help", "Centre d’aide", CircleHelp],
  ],
  admin: [
    ["/", "Dashboard", House],
    ["/neets", "NEETs", Users],
    ["/mediators", "Mediators", ShieldCheck],
    ["/programs", "Programs", ClipboardList],
    ["/opportunities", "Opportunities", BriefcaseBusiness],
    ["/micro-actions", "Micro-actions", Zap],
    ["/heatmap", "Heatmap", Map],
    ["/reports", "Reports", ChartNoAxesCombined],
    ["/alerts", "Alerts", Bell],
    ["/settings", "Settings", Settings],
  ],
  partner: [
    ["", "Overview", House],
    ["#referrals", "Referrals", Users],
    ["#programs", "Programs & capacity", BriefcaseBusiness],
    ["#activity", "Activity", ChartNoAxesCombined],
  ],
} as const;
const identities = {
  neet: {
    name: "Yassine El Amrani",
    label: "فضاء الشباب",
    initials: "YE",
    photo: "/editorial/story-khalid.webp",
  },
  mediator: {
    name: "Imane Rami",
    label: "Espace médiateur",
    initials: "IR",
    photo: "/editorial/story-amina.webp",
  },
  admin: {
    name: "Amina El Mansouri",
    label: "Regional administration",
    initials: "AE",
    photo: "",
  },
  partner: {
    name: "OFPPT Souss-Massa",
    label: "Program collaborator",
    initials: "OF",
    photo: "",
  },
};

function subscribeToHash(notify: () => void) {
  window.addEventListener("hashchange", notify);
  window.addEventListener("popstate", notify);
  return () => {
    window.removeEventListener("hashchange", notify);
    window.removeEventListener("popstate", notify);
  };
}
function getHash() {
  return window.location.hash;
}
function getServerHash() {
  return "";
}

export default function WorkspaceShell({
  role,
  children,
}: {
  role: WorkspaceRole;
  children: ReactNode;
}) {
  const path = usePathname();
  const messenger = path.endsWith("/messages");
  const english = role === "admin" || role === "partner";
  const ExternalArrow = role === "neet" ? ArrowUpLeft : ArrowUpRight;
  const ExpandNavigation = role === "neet" ? PanelRightOpen : PanelLeftOpen;
  const CollapseNavigation = role === "neet" ? PanelRightClose : PanelLeftClose;
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useSimulatedState(
    `navigation.${role}.collapsed`,
    false,
  );
  const sidebarRef = useRef<HTMLElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!messenger) return;
    const workspace = workspaceRef.current;
    const viewport = window.visualViewport;
    const updateHeight = () => workspace?.style.setProperty(
      "--workspace-viewport-height",
      `${Math.min(window.innerHeight, viewport?.height ?? window.innerHeight)}px`,
    );
    updateHeight();
    window.addEventListener("resize", updateHeight);
    viewport?.addEventListener("resize", updateHeight);
    return () => {
      workspace?.style.removeProperty("--workspace-viewport-height");
      window.removeEventListener("resize", updateHeight);
      viewport?.removeEventListener("resize", updateHeight);
    };
  }, [messenger]);
  useEffect(() => {
    if (!open || !window.matchMedia("(max-width: 760px)").matches) return;
    const sidebar = sidebarRef.current;
    if (!sidebar) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusable = () =>
      Array.from(
        sidebar.querySelectorAll<HTMLElement>("a[href], button"),
      ).filter((element) => element.offsetParent !== null);
    document.body.style.overflow = "hidden";
    focusable()[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);
  const prefix = role === "admin" ? "" : `/${role}`;
  const [profile] = useSimulatedState(
    `${role}.profile`,
    role === "neet" ? youthProfileFixture : profileFixtures[role],
  );
  const youthProfile = role === "neet" ? normalizeYouthProfile(profile) : null;
  const identity = {
    ...identities[role],
    name:
      youthProfile
        ? youthName(youthProfile.firstName, youthProfile.lastName)
        : `${profile.firstName} ${profile.lastName}`,
  };
  const help =
    role === "admin"
      ? "/settings"
      : role === "partner"
        ? "/auth/partner/sign-in"
        : `${prefix}/help`;
  const current =
    navigation[role].find(
      ([suffix]) =>
        (role === "partner" ? path + hash : path) === `${prefix}${suffix}`,
    )?.[1] ?? identity.label;
  return (
    <div
      ref={workspaceRef}
      className={`workspace workspace-${role} ${path === prefix ? "workspace-home" : ""} ${collapsed ? "workspace-collapsed" : ""} ${messenger ? "workspace-messenger" : ""}`}
      lang={
        role === "neet"
          ? "ar"
          : role === "admin" || role === "partner"
            ? "en"
            : "fr"
      }
      dir={role === "neet" ? "rtl" : undefined}
    >
      <a className="skip-link" href="#workspace-content">
        {role === "admin" || role === "partner"
          ? "Skip to content"
          : role === "neet"
            ? "انتقل إلى المحتوى"
            : "Aller au contenu"}
      </a>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label={role === "neet" ? "إغلاق القائمة" : english ? "Close menu" : "Fermer le menu"}
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        id={`navigation-${role}`}
        className={`workspace-sidebar ${open ? "is-open" : ""}`}
        aria-label={
          role === "neet" ? "القائمة الرئيسية" : english ? "Main navigation" : "Navigation principale"
        }
      >
        <div className="workspace-brand">
          <div className="expanded-brand">
            <Brand width={148} height={78} />
          </div>
          <div className="collapsed-brand">
            <Brand width={48} height={48} />
          </div>
          <button
            className="sidebar-collapse icon-button"
            aria-label={
              role === "neet"
                ? collapsed
                  ? "توسيع القائمة"
                  : "طي القائمة"
                : english
                  ? collapsed ? "Expand navigation" : "Collapse navigation"
                  : collapsed
                  ? "Développer la navigation"
                  : "Réduire la navigation"
            }
            aria-expanded={!collapsed}
            aria-controls={`navigation-${role}`}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? (
              <ExpandNavigation size={18} />
            ) : (
              <CollapseNavigation size={18} />
            )}
          </button>
          <button
            className="mobile-close icon-button"
            aria-label={role === "neet" ? "إغلاق القائمة" : english ? "Close menu" : "Fermer le menu"}
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-label">{identity.label}</div>
        <nav>
          {navigation[role].map(([suffix, label, Icon]) => {
            const href = `${prefix}${suffix}`;
            const active =
              (role === "partner" ? path + hash === href : path === href) ||
              (suffix !== "" && suffix !== "/" && path.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={`workspace-nav ${active ? "active" : ""}`}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                title={collapsed ? label : undefined}
                onClick={(event) => {
                  if (role === "partner") {
                    event.preventDefault();
                    window.location.hash = suffix;
                  }
                  setOpen(false);
                }}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {suffix === "/messages" && <span className="nav-count">2</span>}
              </Link>
            );
          })}
        </nav>
        <Link
          className="workspace-user"
          aria-label={identity.name}
          title={collapsed ? identity.name : undefined}
          href={
            role === "admin"
              ? "/settings"
              : role === "partner"
                ? "/auth/partner/sign-in"
                : `${prefix}/profile`
          }
        >
          {identity.photo ? (
            <Image src={identity.photo} alt="" width={38} height={38} />
          ) : (
            <span className="avatar">{identity.initials}</span>
          )}
          <span>
            <b>{identity.name}</b>
            <small>{youthProfile ? `${locationsAr[youthProfile.city] ?? youthProfile.city} · ملفي` : identity.label}</small>
          </span>
          <ExternalArrow size={15} />
        </Link>
        <div className="sidebar-support">
          {role === "neet" ? (
            <Image
              src="/editorial/mountain-progress.webp"
              alt=""
              width={94}
              height={50}
            />
          ) : (
            <Sparkles size={18} />
          )}
          <b>
            {role === "admin" || role === "partner"
              ? "Need help?"
              : role === "neet"
                ? "تحتاج إلى مساعدة؟"
                : "Besoin d’aide ?"}
          </b>
          <p>
            {role === "neet"
              ? "وسيطتك هنا لمواكبتك في كل خطوة."
              : role === "mediator"
                ? "Ensemble, rapprochons les jeunes de leurs ambitions."
                : "Working together for youth integration."}
          </p>
          <Link href={help}>
            {role === "admin" || role === "partner"
              ? "Help Center"
              : role === "neet"
                ? "مركز المساعدة"
                : "Centre d’aide"}
            <ExternalArrow size={14} />
          </Link>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <button
            className="mobile-menu icon-button"
            aria-label={role === "neet" ? "فتح القائمة" : english ? "Open menu" : "Ouvrir le menu"}
            aria-expanded={open}
            aria-controls={`navigation-${role}`}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <House size={15} />
            <span>/</span>
            <span>{current}</span>
          </div>
          <div className="topbar-end">
            <span className="demo-label">
              {role === "admin" || role === "partner"
                ? "Demo workspace"
                : role === "neet"
                  ? "فضاء تجريبي"
                  : "Espace de démonstration"}
            </span>
            <span className="topbar-location">
              <MapPin size={14} />
              {role === "neet" ? "سوس ماسة" : "Souss-Massa"}
            </span>
            {role === "neet" || role === "mediator" ? (
              <YouthNotifications role={role} />
            ) : (
              <Link
                href={
                  role === "admin"
                    ? "/alerts"
                    : role === "partner"
                      ? "/auth/partner/sign-in"
                      : `${prefix}/messages`
                }
                className="icon-button"
                aria-label={
                  role === "admin" ? "View alerts" : english ? "View notifications" : "Voir les notifications"
                }
              >
                <Bell size={19} />
              </Link>
            )}
            {role === "neet" && messenger && <YouthAssistant compact />}
            <Link href={`/auth/${role}/sign-in`} className="account-link">
              {role === "admin" || role === "partner"
                ? "Sign in"
                : role === "neet"
                  ? "تسجيل الدخول"
                  : "Se connecter"}
              <ExternalArrow size={13} />
            </Link>
          </div>
        </header>
        <main
          id="workspace-content"
          className="workspace-content"
          tabIndex={-1}
        >
          {children}
        </main>
        <footer className="workspace-footer">
          <span>© 2026 BidayaNeet</span>
          <span>
            {role === "admin" || role === "partner"
              ? "First step. Brighter future."
              : role === "neet"
                ? "خطوة أولى. مستقبل أفضل."
                : "Premier pas. Un avenir meilleur."}
          </span>
        </footer>
      </div>
      {role === "neet" && !messenger && <YouthAssistant />}
    </div>
  );
}
