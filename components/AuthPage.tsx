"use client";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Brand from "./Brand";
import { roleLabels, type AuthMode, type AuthRole } from "@/lib/auth-ui";

const titles: Record<AuthMode, string> = {
  "sign-in": "Heureux de te retrouver.",
  register: "Un nouveau départ t’attend.",
  "forgot-password": "Retrouvons ton accès.",
  "reset-password": "Un nouveau mot de passe.",
};
const descriptions: Record<AuthMode, string> = {
  "sign-in": "Connecte-toi pour reprendre là où tu en étais.",
  register: "Quelques informations pour préparer ton futur compte.",
  "forgot-password":
    "Indique ton adresse e-mail pour préparer la récupération de ton compte.",
  "reset-password": "Choisis un mot de passe d’au moins 8 caractères.",
};
export default function AuthPage({
  role,
  mode,
  token,
}: {
  role: AuthRole;
  mode: AuthMode;
  token?: string;
}) {
  const { text: uiText } = useUiTranslation();

  const [busy, setBusy] = useState(false);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const base = `/auth/${role}`;
  const privileged = role !== "neet";
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    const data = new FormData(event.currentTarget);
    if (
      mode === "reset-password" &&
      data.get("password") !== data.get("confirmPassword")
    ) {
      setError("Les deux mots de passe doivent être identiques.");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(data), role, token }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Connexion indisponible.");
      if (mode === "sign-in" || result.redirect) {
        location.assign(
          {
            neet: "/neet",
            mediator: "/mediator",
            admin: "/",
            partner: "/partner",
          }[role],
        );
        return;
      }
      setStatus(result.message || "Demande enregistrée.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Connexion indisponible.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <section className="auth-story">
        <div className="auth-brand">
          <Brand width={135} height={62} />
        </div>
        <div className="auth-story-copy">
          <div className="eyebrow">
            <Translated value="PREMIER PAS. UN AVENIR MEILLEUR." />
          </div>
          <h1>
            {role === "neet" ? (
              <>
                <Translated value="Ton avenir mérite" />
                <br />
                <Translated value="un nouveau départ." />
              </>
            ) : role === "mediator" ? (
              <>
                <Translated value="Une rencontre." />
                <br />
                <Translated value="Une nouvelle possibilité." />
              </>
            ) : role === "partner" ? (
              <>
                <Translated value="Ensemble, ouvrons" />
                <br />
                <Translated value="le champ des possibles." />
              </>
            ) : (
              <>
                <Translated value="Une vision commune." />
                <br />
                <Translated value="Un impact durable." />
              </>
            )}
          </h1>
          <p>
            <Translated value={role === "neet"
              ? "Des opportunités qui te ressemblent, une équipe qui croit en toi."
              : "Un espace pour créer des liens, accompagner les parcours et rapprocher les jeunes de leur avenir."} />
          </p>
        </div>
        <Image
          src="/editorial/mountain-progress.webp"
          alt={uiText("Un chemin qui mène au sommet")}
          width={580}
          height={450}
          className="auth-illustration"
          preload
        />
        <div className="auth-story-footer">
          <ShieldCheck size={16} />
          <span>
            <Translated value="L’accompagnement commence par la confiance." />
          </span>
        </div>
      </section>
      <main className="auth-main">
        <div className="auth-mobile-brand">
          <Brand width={120} height={54} />
        </div>
        <div className="auth-form-shell">
          <Link href={`${base}/sign-in`} className="back-link">
            <ArrowLeft size={14} />
            {mode === "sign-in" ? roleLabels[role] : "Retour à la connexion"}
          </Link>
          <span className="auth-role-tag">
            <LockKeyhole size={12} />
            {roleLabels[role]}
          </span>
          <h2>
            {mode === "register" && privileged
              ? "Rejoignons le même élan."
              : titles[mode]}
          </h2>
          <p className="auth-description">
            {mode === "register" && privileged
              ? "Prépare une demande d’accès à ton espace professionnel. Les comptes sont attribués par l’équipe régionale."
              : descriptions[mode]}
          </p>
          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <label className="form-field">
                <Translated value="Nom complet" />
                <input
                  className="field-input"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder={uiText("Ton prénom et ton nom")}
                  maxLength={120}
                />
              </label>
            )}
            {mode !== "reset-password" && (
              <label className="form-field">
                <Translated value="Adresse e-mail" />
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder={uiText("toi@exemple.com")}
                  maxLength={254}
                />
              </label>
            )}
            {mode === "register" && privileged && (
              <label className="form-field">
                <Translated value="Organisme" />
                <input
                  className="field-input"
                  name="organization"
                  required
                  placeholder={uiText("Ton association ou organisme")}
                  maxLength={200}
                />
              </label>
            )}
            {(mode === "sign-in" ||
              mode === "reset-password" ||
              (mode === "register" && !privileged)) && (
              <label className="form-field">
                <Translated value="Mot de passe" />
                <div className="password-field">
                  <input
                    className="field-input"
                    name="password"
                    type={visible ? "text" : "password"}
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    required
                    minLength={mode === "sign-in" ? 1 : 8}
                    maxLength={128}
                    placeholder={mode === "sign-in"
                        ? "Ton mot de passe"
                        : "Au moins 8 caractères"}
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={visible
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"}
                    aria-pressed={visible}
                  >
                    {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
            )}
            {mode === "reset-password" && (
              <label className="form-field">
                <Translated value="Confirmer le mot de passe" />
                <input
                  className="field-input"
                  name="confirmPassword"
                  type={visible ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={128}
                />
              </label>
            )}
            {mode === "sign-in" && (
              <div className="auth-forgot">
                <Link href={`${base}/forgot-password`}>
                  <Translated value="Mot de passe oublié ?" />
                </Link>
              </div>
            )}
            {error && (
              <div className="auth-error" role="alert">
                {error}
              </div>
            )}
            {status && (
              <div className="inline-alert" role="status">
                <CheckCircle2
                  size={16}
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginRight: 5,
                  }}
                />
                {status}
              </div>
            )}
            <button
              className="button button-primary auth-submit"
              type="submit"
              disabled={busy}
            >
              <Translated value={mode === "sign-in"
                ? "Se connecter"
                : mode === "register"
                  ? privileged
                    ? "Demander un accès"
                    : "Créer mon compte"
                  : mode === "forgot-password"
                    ? "Préparer la récupération"
                    : "Définir le mot de passe"} />
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="auth-service-note">
            <span className="small-dot" />
            <Translated value="Accès sécurisé à ton espace BidayaNeet." />
          </div>
          {mode === "sign-in" && (
            <p className="auth-switch">
              <Translated value={privileged
                ? "Besoin d’un accès ?"
                : "C’est ton premier pas ici ?"} /><Translated value={" "} />
              <Link href={`${base}/register`}>
                <Translated value={privileged ? "Demander un compte" : "Créer mon compte"} />
              </Link>
            </p>
          )}
          {mode === "register" && (
            <p className="auth-switch">
              <Translated value="Déjà un compte ?" /><Translated value={" "} />
              <Link href={`${base}/sign-in`}>
                <Translated value="Se connecter" />
              </Link>
            </p>
          )}
          <p className="auth-bottom-note">
            <Translated value="La connexion utilise une session personnelle. Ne partage pas ton mot de passe." />
          </p>
        </div>
        <footer className="auth-footer">
          <Translated value="© 2026 BidayaNeet" />
          <span>
            <Translated value="Premier pas. Un avenir meilleur." />
          </span>
        </footer>
      </main>
    </div>
  );
}
