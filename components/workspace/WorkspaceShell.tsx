"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import LanguageSwitcher, {
  useTranslation,
} from "@/components/LanguageProvider";
import { useWorkspaceDatasets } from "./LiveProvider";
import type {
  AppointmentView,
  OpportunityView,
  FieldActionView,
} from "@/lib/workspace-data";

import type { ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
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
import { useWorkspaceState as useSimulatedState } from "./LiveProvider";

export type WorkspaceRole = "neet" | "mediator" | "admin" | "partner";
const navigation = {
  neet: [
    ["", "Home", House],
    ["/opportunities", "Mes opportunités", Settings],
    ["/stories", "Histoires inspirantes", Star],
    ["/journey", "Mon parcours", ClipboardList],
    ["/micro-actions", "Micro-actions", ShieldCheck],
    ["/messages", "Messages", MessageCircle],
    ["/profile", "Mon profil", UserRound],
    ["/help", "Aide", CircleHelp],
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
    label: "Espace jeune",
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
  const { text: uiText } = useUiTranslation();

  const { locale, text } = useTranslation();
  const { profileFixtures } = useWorkspaceDatasets();

  const path = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useSimulatedState(
    `ui.navigation.${role}.collapsed`,
    false,
  );
  const sidebarRef = useRef<HTMLElement>(null);
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
  const [profile] = useSimulatedState(`${role}.profile`, profileFixtures[role]);
  const identity = {
    ...identities[role],
    name: `${profile.firstName} ${profile.lastName}`,
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
      className={`workspace workspace-${role} ${path === prefix ? "workspace-home" : ""} ${collapsed ? "workspace-collapsed" : ""}`}
      lang={locale}
    >
      <a className="skip-link" href="#workspace-content">
        {role === "admin" || role === "partner"
          ? text("Skip to content")
          : "Aller au contenu"}
      </a>
      {open && (
        <button
          className="sidebar-backdrop"
          aria-label={uiText("Fermer le menu")}
          tabIndex={-1}
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        ref={sidebarRef}
        id={`navigation-${role}`}
        className={`workspace-sidebar ${open ? "is-open" : ""}`}
        aria-label={uiText("Navigation principale")}
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
            aria-label={collapsed ? "Développer la navigation" : "Réduire la navigation"}
            aria-expanded={!collapsed}
            aria-controls={`navigation-${role}`}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>
          <button
            className="mobile-close icon-button"
            aria-label={uiText("Fermer le menu")}
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-label">{text(identity.label)}</div>
        <div style={{ padding: "8px 16px" }}>
          <LanguageSwitcher />
          <button
            type="button"
            className="text-link"
            onClick={async () => {
              const response = await fetch("/api/auth/logout", {
                method: "POST",
              });
              if (response.ok) location.assign(`/auth/${role}/sign-in`);
            }}
          >
            {text("Se déconnecter")}
          </button>
        </div>
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
                aria-label={text(label)}
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
                <span>{text(label)}</span>
                {label === "Messages" && <span className="nav-count">2</span>}
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
            <Image
              src={identity.photo}
              alt={uiText("")}
              width={38}
              height={38}
            />
          ) : (
            <span className="avatar">{identity.initials}</span>
          )}
          <span>
            <b>{identity.name}</b>
            <small>{role === "neet" ? "Mon profil" : identity.label}</small>
          </span>
          <ArrowUpRight size={15} />
        </Link>
        <div className="sidebar-support">
          {role === "neet" ? (
            <Image
              src="/editorial/mountain-progress.webp"
              alt={uiText("")}
              width={94}
              height={50}
            />
          ) : (
            <Sparkles size={18} />
          )}
          <b>
            {role === "admin" || role === "partner"
              ? text("Need help?")
              : "Besoin d’aide ?"}
          </b>
          <p>
            {role === "neet"
              ? "Ton médiateur est là pour t’accompagner."
              : role === "mediator"
                ? "Ensemble, rapprochons les jeunes de leurs ambitions."
                : text("Working together for youth integration.")}
          </p>
          <Link href={help}>
            {role === "admin" || role === "partner"
              ? text("Help Center")
              : "Centre d’aide"}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div className="workspace-body">
        <header className="workspace-topbar">
          <button
            className="mobile-menu icon-button"
            aria-label={uiText("Ouvrir le menu")}
            aria-expanded={open}
            aria-controls={`navigation-${role}`}
            onClick={() => setOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="breadcrumb">
            <House size={15} />
            <span>/</span>
            <span>{text(current)}</span>
          </div>
          <div className="topbar-end">
            <span className="demo-label">
              <Translated value={role === "admin" || role === "partner"
                ? "Espace BidayaNeet"
                : "Espace BidayaNeet"} />
            </span>
            <span className="topbar-location">
              <MapPin size={14} />
              <Translated value="Souss-Massa" />
            </span>
            <Link
              href={
                role === "admin"
                  ? "/alerts"
                  : role === "partner"
                    ? "/auth/partner/sign-in"
                    : `${prefix}/messages`
              }
              className="icon-button"
              aria-label={role === "admin" ? "View alerts" : "Voir les notifications"}
            >
              <Bell size={19} />
            </Link>
            <LanguageSwitcher />
            <button
              type="button"
              onClick={async () => {
                const response = await fetch("/api/auth/logout", {
                  method: "POST",
                });
                if (response.ok) location.assign(`/auth/${role}/sign-in`);
              }}
              className="account-link"
            >
              <Translated value={role === "admin" || role === "partner"
                ? "Log out"
                : "Se déconnecter"} />
              <ArrowUpRight size={13} />
            </button>
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
          <span>
            <Translated value="© 2026 BidayaNeet" />
          </span>
          <span>
            <Translated value={role === "admin" || role === "partner"
              ? "First step. Brighter future."
              : "Premier pas. Un avenir meilleur."} />
          </span>
        </footer>
      </div>
    </div>
  );
}
