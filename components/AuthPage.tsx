"use client";

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
}: {
  role: AuthRole;
  mode: AuthMode;
}) {
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const base = `/auth/${role}`;
  const privileged = role !== "neet";
  function submit(event: FormEvent<HTMLFormElement>) {
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
    setStatus(
      mode === "forgot-password"
        ? "Formulaire vérifié. Le service de récupération n’est pas encore connecté ; aucun e-mail n’a été envoyé."
        : mode === "reset-password"
          ? "Formulaire vérifié. Aucun mot de passe réel n’a été modifié."
          : mode === "register"
            ? "Formulaire vérifié. Aucun compte n’a été créé : le service d’authentification sera connecté prochainement."
            : "Formulaire vérifié. La connexion sera disponible après activation du service d’authentification.",
    );
    event.currentTarget.reset();
  }
  return (
    <div className="auth-page">
      <section className="auth-story">
        <div className="auth-brand">
          <Brand width={135} height={62} />
        </div>
        <div className="auth-story-copy">
          <div className="eyebrow">PREMIER PAS. UN AVENIR MEILLEUR.</div>
          <h1>
            {role === "neet" ? (
              <>
                Ton avenir mérite
                <br />
                un nouveau départ.
              </>
            ) : role === "mediator" ? (
              <>
                Une rencontre.
                <br />
                Une nouvelle possibilité.
              </>
            ) : role === "partner" ? (
              <>
                Ensemble, ouvrons
                <br />
                le champ des possibles.
              </>
            ) : (
              <>
                Une vision commune.
                <br />
                Un impact durable.
              </>
            )}
          </h1>
          <p>
            {role === "neet"
              ? "Des opportunités qui te ressemblent, une équipe qui croit en toi."
              : "Un espace pour créer des liens, accompagner les parcours et rapprocher les jeunes de leur avenir."}
          </p>
        </div>
        <Image
          src="/editorial/mountain-progress.webp"
          alt="Un chemin qui mène au sommet"
          width={580}
          height={450}
          className="auth-illustration"
          preload
        />
        <div className="auth-story-footer">
          <ShieldCheck size={16} />
          <span>L’accompagnement commence par la confiance.</span>
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
                Nom complet
                <input
                  className="field-input"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Ton prénom et ton nom"
                  maxLength={120}
                />
              </label>
            )}
            {mode !== "reset-password" && (
              <label className="form-field">
                Adresse e-mail
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="toi@exemple.com"
                  maxLength={254}
                />
              </label>
            )}
            {mode === "register" && privileged && (
              <label className="form-field">
                Organisme
                <input
                  className="field-input"
                  name="organization"
                  required
                  placeholder="Ton association ou organisme"
                  maxLength={200}
                />
              </label>
            )}
            {(mode === "sign-in" ||
              mode === "reset-password" ||
              (mode === "register" && !privileged)) && (
              <label className="form-field">
                Mot de passe
                <div className="password-field">
                  <input
                    className="field-input"
                    name="password"
                    type={visible ? "text" : "password"}
                    autoComplete={
                      mode === "sign-in" ? "current-password" : "new-password"
                    }
                    required
                    minLength={mode === "sign-in" ? 1 : 8}
                    maxLength={128}
                    placeholder={
                      mode === "sign-in"
                        ? "Ton mot de passe"
                        : "Au moins 8 caractères"
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setVisible(!visible)}
                    aria-label={
                      visible
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    aria-pressed={visible}
                  >
                    {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
            )}
            {mode === "reset-password" && (
              <label className="form-field">
                Confirmer le mot de passe
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
                  Mot de passe oublié ?
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
            <button className="button button-primary auth-submit" type="submit">
              {mode === "sign-in"
                ? "Se connecter"
                : mode === "register"
                  ? privileged
                    ? "Demander un accès"
                    : "Créer mon compte"
                  : mode === "forgot-password"
                    ? "Préparer la récupération"
                    : "Définir le mot de passe"}
              <ArrowRight size={17} />
            </button>
          </form>
          <div className="auth-service-note">
            <span className="small-dot" />
            Écran de démonstration · connexion des comptes à venir.
          </div>
          {mode === "sign-in" && (
            <p className="auth-switch">
              {privileged
                ? "Besoin d’un accès ?"
                : "C’est ton premier pas ici ?"}{" "}
              <Link href={`${base}/register`}>
                {privileged ? "Demander un compte" : "Créer mon compte"}
              </Link>
            </p>
          )}
          {mode === "register" && (
            <p className="auth-switch">
              Déjà un compte ?{" "}
              <Link href={`${base}/sign-in`}>Se connecter</Link>
            </p>
          )}
          <p className="auth-bottom-note">
            Tes identifiants ne sont ni transmis ni enregistrés dans cette
            démonstration.
          </p>
        </div>
        <footer className="auth-footer">
          © 2026 BidayaNeet<span>Premier pas. Un avenir meilleur.</span>
        </footer>
      </main>
    </div>
  );
}
