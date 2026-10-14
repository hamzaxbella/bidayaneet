"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { designLabels } from "@/lib/design-translations";
import { arabic, type Locale } from "@/lib/translations";
const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
}>({ locale: "fr", setLocale: () => {} });
export function translate(value: string, locale: Locale): string {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (designLabels[normalized])
    return value.replace(normalized, designLabels[normalized][locale]);
  if (locale === "fr") return value;
  if (arabic[normalized]) return value.replace(normalized, arabic[normalized]);
  const skills = value.match(/^Compétences \/ intérêts : (.*)$/);
  if (skills) return `المهارات / الاهتمامات: ${skills[1]}`;
  const profile = value.match(/^Parcours adapté au profil ([ABC])$/);
  if (profile) return `مسار ملائم للفئة ${profile[1]}`;
  const project = value.match(/^Projet clarifié lors de l’activation : (.*)$/);
  if (project)
    return `المشروع المحدد أثناء التفعيل: ${translate(project[1], locale)}`;
  // Compound explanatory labels are translated without altering names or notes.
  if (value.includes(" · "))
    return value
      .split(" · ")
      .map((part) => translate(part, locale))
      .join(" · ");
  return value;
}
export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);
  function setLocale(value: Locale) {
    setLocaleState(value);
    document.cookie = `bidaya-language=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
  }
  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useTranslation() {
  const { locale } = useContext(LanguageContext);
  const text = (value: string) => translate(value, locale);
  const t = (value: ReactNode): ReactNode =>
    typeof value === "string"
      ? text(value)
      : Array.isArray(value)
        ? value.map(t)
        : value;
  const formatted = (value: string) =>
    new Date(value).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-MA", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Africa/Casablanca",
    });
  return { locale, text, t, formatted };
}
export default function LanguageSwitcher() {
  const { locale, setLocale } = useContext(LanguageContext);
  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={locale === "ar" ? "لغة الواجهة" : "Langue de l’interface"}
    >
      <button
        type="button"
        lang="fr"
        aria-pressed={locale === "fr"}
        onClick={() => setLocale("fr")}
      >
        FR
      </button>
      <button
        type="button"
        lang="ar"
        aria-pressed={locale === "ar"}
        onClick={() => setLocale("ar")}
      >
        العربية
      </button>
    </div>
  );
}
