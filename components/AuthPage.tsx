"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Users,
} from "lucide-react";
import Brand from "./Brand";
import { roleLabels, type AuthMode, type AuthRole } from "@/lib/auth-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Alert, AlertDescription } from "@/components/ui/alert";

const titles: Record<AuthMode, string> = {
  "sign-in": "Heureux de te retrouver.",
  register: "Un nouveau départ.",
  "forgot-password": "Retrouver ton accès.",
  "reset-password": "Un nouveau mot de passe.",
};
const descriptions: Record<AuthMode, string> = {
  "sign-in": "Connecte-toi à ton espace BidayaNeet.",
  register: "Quelques informations pour commencer.",
  "forgot-password": "Indique l’adresse e-mail de ton compte.",
  "reset-password": "Choisis un mot de passe d’au moins 8 caractères.",
};
const arTitles: Record<AuthMode, string> = {
  "sign-in": "سعداء بعودتك.",
  register: "بدايتك الجديدة هنا.",
  "forgot-password": "استرجاع الوصول لحسابك.",
  "reset-password": "كلمة مرور جديدة.",
};
const arDescriptions: Record<AuthMode, string> = {
  "sign-in": "سجّل الدخول إلى فضائك في بداية.",
  register: "معلومات بسيطة لبدء رحلتك.",
  "forgot-password": "أدخل البريد الإلكتروني المرتبط بحسابك.",
  "reset-password": "اختر كلمة مرور تتكوّن من 8 أحرف على الأقل.",
};

export default function AuthPage({
  role,
  mode,
}: {
  role: AuthRole;
  mode: AuthMode;
}) {
  const arabic = role === "neet";
  const t = (fr: string, ar: string) => (arabic ? ar : fr);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [invalidField, setInvalidField] = useState("");
  const errorId = mode === "reset-password" ? "auth-password-error" : "auth-form-error";
  const [status, setStatus] = useState("");
  const base = "/auth/" + role;
  const privileged = role !== "neet";
  const label = arabic ? "فضاء الشباب" : roleLabels[role];
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setStatus("");
    const data = new FormData(event.currentTarget);
    for (const input of Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>("input"))) {
      const value = input.value.trim();
      const label = input.name === "name" ? t("ton nom complet", "اسمك الكامل") : input.name === "organization" ? "ton organisme" : input.name === "email" ? t("ton adresse e-mail", "بريدك الإلكتروني") : input.name === "confirmPassword" ? t("la confirmation du mot de passe", "تأكيد كلمة المرور") : t("ton mot de passe", "كلمة المرور");
      const message = !value && input.required ? t(`Renseigne ${label}.`, `أدخل ${label}.`) : input.type === "email" && input.validity.typeMismatch ? t("Indique une adresse e-mail valide, par exemple nom@exemple.com.", "أدخل بريداً إلكترونياً صحيحاً، مثل name@example.com.") : input.minLength > 1 && value.length < input.minLength ? t("Choisis un mot de passe d’au moins 8 caractères.", "اختر كلمة مرور تتكوّن من 8 أحرف على الأقل.") : "";
      if (message) { setInvalidField(input.name); setError(message); input.focus(); return; }
    }
    setInvalidField("");
    if (
      mode === "reset-password" &&
      data.get("password") !== data.get("confirmPassword")
    ) {
      setInvalidField("confirmPassword");
      setError(
        t(
          "Les deux mots de passe doivent être identiques.",
          "يجب أن تتطابق كلمتا المرور.",
        ),
      );
      event.currentTarget
        .querySelector<HTMLInputElement>("#auth-confirm")
        ?.focus();
      return;
    }
    setStatus(
      mode === "forgot-password"
        ? t(
            "Formulaire vérifié. Aucun e-mail n’a été envoyé : le service de récupération n’est pas encore connecté.",
            "تم التحقق من النموذج. لم يتم إرسال بريد إلكتروني لأن خدمة الاسترجاع غير متصلة بعد.",
          )
        : mode === "reset-password"
          ? t(
              "Formulaire vérifié. Aucun mot de passe réel n’a été modifié.",
              "تم التحقق من النموذج. لم يتم تغيير أي كلمة مرور فعلية.",
            )
          : mode === "register"
            ? t(
                "Formulaire vérifié. Aucun compte n’a été créé : le service d’authentification n’est pas encore connecté.",
                "تم التحقق من النموذج. لم يتم إنشاء حساب لأن خدمة تسجيل الدخول غير متصلة بعد.",
              )
            : t(
                "Formulaire vérifié. La connexion sera disponible après activation du service d’authentification.",
                "تم التحقق من النموذج. سيتاح تسجيل الدخول بعد تفعيل خدمة الحسابات.",
              ),
    );
    event.currentTarget.reset();
    setVisible(false);
  }
  const hasPassword =
    mode === "sign-in" ||
    mode === "reset-password" ||
    (mode === "register" && !privileged);
  return (
    <div
      className={"auth-page auth-" + role}
      dir={arabic ? "rtl" : "ltr"}
      lang={arabic ? "ar" : "fr"}
    >
      <section
        className="auth-story"
        aria-label={t(
          "BidayaNeet, un accompagnement humain",
          "بداية، مواكبة إنسانية",
        )}
      >
        <Image
          src="/editorial/auth-community.webp"
          alt={t(
            "Des jeunes adultes et une conseillère autour d’un projet dans un atelier au Maroc",
            "شباب ومستشارة يناقشون مشروعًا في ورشة بالمغرب",
          )}
          fill
          sizes="50vw"
          className="auth-story-photo"
          preload
        />
        <div className="auth-story-copy">
          <div className="eyebrow">
            {t("BIDAYANEET · SOUSS-MASSA", "بداية · سوس ماسة")}
          </div>
          <h1>
            {arabic ? (
              <>
                كل بداية صغيرة
                <br />
                تفتح أفقًا جديدًا.
              </>
            ) : role === "mediator" ? (
              <>
                Une rencontre.
                <br />
                Un avenir qui s’ouvre.
              </>
            ) : role === "partner" ? (
              <>
                Ensemble, créons
                <br />
                des opportunités.
              </>
            ) : (
              <>
                Un premier pas.
                <br />
                De nouvelles possibilités.
              </>
            )}
          </h1>
        </div>
        <div className="auth-story-footer">
          <Users size={18} />
          <span>
            {t(
              "Des jeunes, des médiateurs, un avenir en commun.",
              "شباب ومواكبون، نبني المستقبل معًا.",
            )}
          </span>
        </div>
      </section>
      <main className="auth-main">
        <div className="auth-brand-row">
        <Link
          className="auth-main-brand"
          href={role === "admin" ? "/" : "/" + role}
          aria-label={t(
            "Ouvrir l’espace de démonstration BidayaNeet",
            "فتح فضاء بداية التجريبي",
          )}
        >
          <Brand width={110} height={80} />
        </Link>
        <span className="auth-role-tag"><LockKeyhole size={13} />{label}</span>
        </div>
        <div className="auth-form-shell">
          {mode !== "sign-in" && (
            <Link href={base + "/sign-in"} className="auth-back">
              {arabic ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}{" "}
              {t("Retour à la connexion", "العودة إلى تسجيل الدخول")}
            </Link>
          )}
          <h2>
            {mode === "register" && privileged
              ? "Demander un accès."
              : arabic
                ? arTitles[mode]
                : titles[mode]}
          </h2>
          <p className="auth-description">
            {mode === "register" && privileged
              ? "L’équipe régionale valide les accès professionnels."
              : arabic
                ? arDescriptions[mode]
                : descriptions[mode]}
          </p>
          <form
            noValidate
            onSubmit={submit}
            onInput={() => {
              setError("");
              setInvalidField("");
              setStatus("");
            }}
            className="auth-form"
          >
            {error && <Alert id={errorId} variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
            <FieldGroup>
              {mode === "register" && (
                <Field data-invalid={invalidField === "name"}>
                  <FieldLabel htmlFor="auth-name">
                    {t("Nom complet", "الاسم الكامل")}
                  </FieldLabel>
                  <Input
                    aria-invalid={invalidField === "name"}
                    aria-describedby={invalidField === "name" ? errorId : undefined}
                    id="auth-name"
                    name="name"
                    autoComplete="name"
                    required
                    placeholder={t(
                      "Ton prénom et ton nom",
                      "الاسم الشخصي والعائلي",
                    )}
                    maxLength={120}
                  />
                </Field>
              )}
              {mode !== "reset-password" && (
                <Field data-invalid={invalidField === "email"}>
                  <FieldLabel htmlFor="auth-email">
                    {t("Adresse e-mail", "البريد الإلكتروني")}
                  </FieldLabel>
                  <Input
                    aria-invalid={invalidField === "email"}
                    aria-describedby={invalidField === "email" ? errorId : undefined}
                    id="auth-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    dir="ltr"
                    required
                    placeholder={arabic ? "name@example.com" : "nom@exemple.com"}
                    maxLength={254}
                  />
                </Field>
              )}
              {mode === "register" && privileged && (
                <Field data-invalid={invalidField === "organization"}>
                  <FieldLabel htmlFor="auth-organization">Organisme</FieldLabel>
                  <Input
                    aria-invalid={invalidField === "organization"}
                    aria-describedby={invalidField === "organization" ? errorId : undefined}
                    id="auth-organization"
                    name="organization"
                    required
                    placeholder="Ton association ou organisme"
                    maxLength={200}
                  />
                </Field>
              )}
              {hasPassword && (
                <Field data-invalid={invalidField === "password"}>
                  <FieldLabel htmlFor="auth-password">
                    {t("Mot de passe", "كلمة المرور")}
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      aria-invalid={invalidField === "password"}
                      aria-describedby={invalidField === "password" ? errorId : undefined}
                      id="auth-password"
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
                          ? t("Ton mot de passe", "كلمة المرور")
                          : t("Au moins 8 caractères", "8 أحرف على الأقل")
                      }
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton
                        type="button"
                        size="icon-sm"
                        onClick={() => setVisible(!visible)}
                        aria-label={
                          visible
                            ? t("Masquer le mot de passe", "إخفاء كلمة المرور")
                            : t("Afficher le mot de passe", "إظهار كلمة المرور")
                        }
                        aria-pressed={visible}
                      >
                        {visible ? <EyeOff /> : <Eye />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                </Field>
              )}
              {mode === "reset-password" && (
                <Field data-invalid={invalidField === "confirmPassword"}>
                  <FieldLabel htmlFor="auth-confirm">
                    {t("Confirmer le mot de passe", "تأكيد كلمة المرور")}
                  </FieldLabel>
                  <Input
                    id="auth-confirm"
                    name="confirmPassword"
                    type={visible ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    minLength={8}
                    maxLength={128}
                    aria-invalid={invalidField === "confirmPassword"}
                    aria-describedby={invalidField === "confirmPassword" ? errorId : undefined}
                  />
                </Field>
              )}
            </FieldGroup>
            {mode === "sign-in" && (
              <div className="auth-forgot">
                <Link href={base + "/forgot-password"}>
                  {t("Mot de passe oublié ?", "نسيت كلمة المرور؟")}
                </Link>
              </div>
            )}
            {status && (
              <Alert role="status">
                <AlertDescription>{status}</AlertDescription>
              </Alert>
            )}
            <Button className="auth-submit" type="submit">
              {mode === "sign-in"
                ? t("Se connecter", "تسجيل الدخول")
                : mode === "register"
                  ? privileged
                    ? "Demander un accès"
                    : "إنشاء حسابي"
                  : mode === "forgot-password"
                    ? t("Préparer la récupération", "طلب الاسترجاع")
                    : t("Définir le mot de passe", "تعيين كلمة المرور")}
              {arabic ? (
                <ArrowLeft data-icon="inline-end" />
              ) : (
                <ArrowRight data-icon="inline-end" />
              )}
            </Button>
          </form>
          {mode === "sign-in" && (
            <p className="auth-switch">
              {t(
                privileged
                  ? "Besoin d’un accès ?"
                  : "C’est ton premier pas ici ?",
                "أول خطوة لك هنا؟",
              )}{" "}
              <Link href={base + "/register"}>
                {t(
                  privileged ? "Demander un compte" : "Créer mon compte",
                  "إنشاء حسابي",
                )}
              </Link>
            </p>
          )}
          {mode === "register" && (
            <p className="auth-switch">
              {t("Déjà un compte ?", "لديك حساب؟")}{" "}
              <Link href={base + "/sign-in"}>
                {t("Se connecter", "تسجيل الدخول")}
              </Link>
            </p>
          )}
          <div className="auth-service-note">
            {t(
              "Démonstration · service de connexion à venir.",
              "نسخة تجريبية · خدمة تسجيل الدخول قيد الإعداد.",
            )}
          </div>
        </div>
        <footer className="auth-footer">
          <span>© 2026 BidayaNeet</span>
          <span>
            {t("Premier pas. Un avenir meilleur.", "خطوة أولى. مستقبل أفضل.")}
          </span>
        </footer>
      </main>
    </div>
  );
}
