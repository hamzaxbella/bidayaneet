"use client";
import Translated from "@/components/Translated";

import { useState, type FormEvent } from "react";
import { User, MapPin, Shield, KeyRound, Link, Check } from "lucide-react";
import { useWorkspace } from "@/components/workspace/LiveProvider";
import { useTranslation } from "@/components/LanguageProvider";

export default function SettingsPage() {
  const { data, command } = useWorkspace();
  const { locale } = useTranslation();
  const tr = (fr: string, ar: string) => (locale === "ar" ? ar : fr);
  const [tab, setTab] = useState("profile"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [resetLink, setResetLink] = useState(""),
    [resetName, setResetName] = useState("");
  const tabs = [
    ["profile", tr("Profil et compte", "الملف والحساب"), User],
    ["region", tr("Configuration", "الإعدادات"), MapPin],
    ["roles", tr("Utilisateurs et accès", "المستخدمون والصلاحيات"), Shield],
    ["recovery", tr("Récupération de compte", "استرجاع الحساب"), KeyRound],
    ["integrations", tr("Intégrations", "التكاملات"), Link],
  ] as const;
  async function submit(e: FormEvent<HTMLFormElement>, action: string) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = e.currentTarget;
    const p = Object.fromEntries(new FormData(form));
    if (action === "workspace-settings")
      Object.assign(p, { followupDays: Number(p.followupDays) });
    const ok = await command({ action, payload: p });
    if (ok && action === "professional-create") form.reset();
    setBusy(false);
  }
  async function recovery(id: string, name: string) {
    setBusy(true);
    setError("");
    setResetLink("");
    try {
      const r = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset-link", payload: { userId: id } }),
      });
      const result = await r.json();
      if (!r.ok)
        throw Error(
          result.error ||
            tr("Impossible de créer le lien.", "تعذر إنشاء الرابط."),
        );
      setResetName(name);
      setResetLink(new URL(result.path, location.origin).href);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : tr("Connexion indisponible.", "الاتصال غير متاح."),
      );
    } finally {
      setBusy(false);
    }
  }
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #E8ECF0",
    borderRadius: 8,
    background: "#F9FAFB",
    color: "#1A2B3C",
  };
  const labelStyle = {
    display: "grid",
    gap: 6,
    fontSize: 13,
    color: "#4A5568",
  };
  const field = (
    label: string,
    name: string,
    value: string,
    type = "text",
    readOnly = false,
  ) => (
    <label style={labelStyle}>
      {label}
      <input
        style={inputStyle}
        name={name}
        defaultValue={value}
        type={type}
        required={!readOnly}
        readOnly={readOnly}
      />
    </label>
  );
  const name = data.user.name.split(" ");
  return (
    <div style={{ minHeight: "100vh" }}>
      <header
        style={{
          padding: "20px 28px",
          background: "white",
          borderBottom: "1px solid #E8ECF0",
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>
          {tr("Paramètres", "الإعدادات")}
        </h1>
        <p style={{ color: "#7F8C9A", marginTop: 4 }}>
          {tr(
            "Gérer les comptes et la configuration de la plateforme.",
            "إدارة الحسابات وإعدادات المنصة.",
          )}
        </p>
      </header>
      <div
        className="admin-settings-layout"
        style={{ padding: "24px 28px", display: "flex", gap: 24 }}
      >
        <nav
          className="settings-navigation"
          style={{ width: 220, flexShrink: 0 }}
        >
          <div className="card" style={{ padding: 12 }}>
            {tabs.map(([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => {
                  setTab(id);
                  setResetLink("");
                  setError("");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  padding: 12,
                  border: 0,
                  borderRadius: 10,
                  marginBottom: 4,
                  textAlign: "start",
                  background: tab === id ? "#E0F7F5" : "transparent",
                  color: tab === id ? "#008C81" : "#4A5568",
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </nav>
        <main
          style={{
            flex: 1,
            minWidth: 0,
            display: "grid",
            gap: 20,
            alignContent: "start",
          }}
        >
          {error && (
            <p
              role="alert"
              style={{
                padding: 14,
                background: "#FFF1F0",
                borderRadius: 10,
                color: "#AD2F2F",
              }}
            >
              {error}
            </p>
          )}
          {tab === "profile" && (
            <form
              className="card"
              style={{ padding: 28, display: "grid", gap: 18 }}
              onSubmit={(e) => submit(e, "workspace-profile")}
            >
              <h2 className="section-title">
                {tr("Profil et compte", "الملف والحساب")}
              </h2>
              {field(tr("Prénom", "الاسم"), "firstName", name[0] || "")}
              {field(tr("Nom", "النسب"), "lastName", name.slice(1).join(" "))}
              {field(
                tr("E-mail", "البريد الإلكتروني"),
                "email",
                data.user.email,
                "email",
                true,
              )}
              {field(
                tr("Téléphone", "الهاتف"),
                "phone",
                data.profile.phone || "",
                "tel",
              )}
              {field(tr("Ville", "المدينة"), "city", data.profile.city || "")}
              <button className="btn-primary" disabled={busy}>
                <Check size={14} />
                {tr("Enregistrer", "حفظ")}
              </button>
            </form>
          )}
          {tab === "region" && (
            <form
              className="card"
              style={{ padding: 28, display: "grid", gap: 18 }}
              onSubmit={(e) => submit(e, "workspace-settings")}
            >
              <h2 className="section-title">
                {tr("Configuration régionale", "الإعدادات الجهوية")}
              </h2>
              {field(
                tr("Région", "الجهة"),
                "region",
                String(data.settings.region || "Souss-Massa"),
              )}
              {field(
                tr("Organisme", "المؤسسة"),
                "organization",
                String(
                  data.settings.organization ||
                    data.user.organization ||
                    "BidayaNeet",
                ),
              )}
              <label style={labelStyle}>
                {tr("Langue par défaut", "اللغة الافتراضية")}
                <select
                  style={inputStyle}
                  name="language"
                  defaultValue={String(data.settings.language || "fr")}
                >
                  <option value="fr">
                    <Translated value="Français" />
                  </option>
                  <option value="ar">العربية</option>
                </select>
              </label>
              <label style={labelStyle}>
                {tr("Délai de suivi (jours)", "مهلة المتابعة بالأيام")}
                <input
                  style={inputStyle}
                  name="followupDays"
                  type="number"
                  min={1}
                  max={365}
                  defaultValue={Number(data.settings.followupDays || 14)}
                  required
                />
              </label>
              <button className="btn-primary" disabled={busy}>
                {tr("Enregistrer", "حفظ")}
              </button>
            </form>
          )}
          {tab === "roles" && (
            <>
              <section className="card" style={{ padding: 24 }}>
                <h2 className="section-title">
                  {tr("Demandes d’accès", "طلبات الدخول")}
                </h2>
                {!data.requests.length && (
                  <p>
                    {tr("Aucune demande en attente.", "لا توجد طلبات معلقة.")}
                  </p>
                )}
                {data.requests.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      flexWrap: "wrap",
                      padding: "14px 0",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <strong>{r.name}</strong>
                      <p>
                        {r.email} · {r.role} · {r.organization}
                      </p>
                    </div>
                    {[true, false].map((approve) => (
                      <button
                        key={String(approve)}
                        className={approve ? "btn-primary" : "btn-secondary"}
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          await command({
                            action: "access-request",
                            payload: { requestId: r.id, approve },
                          });
                          setBusy(false);
                        }}
                      >
                        {approve
                          ? tr("Approuver", "قبول")
                          : tr("Refuser", "رفض")}
                      </button>
                    ))}
                  </div>
                ))}
              </section>
              <section
                className="card"
                style={{ padding: 24, overflowX: "auto" }}
              >
                <h2 className="section-title">
                  {tr("Utilisateurs professionnels", "المستخدمون المهنيون")}
                </h2>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    marginTop: 18,
                  }}
                >
                  <thead>
                    <tr>
                      {[
                        tr("Nom", "الاسم"),
                        "E-mail",
                        tr("Rôle", "الدور"),
                        tr("État", "الحالة"),
                        tr("Accès", "الدخول"),
                      ].map((h) => (
                        <th key={h} style={{ textAlign: "start", padding: 10 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.staff.map((u) => (
                      <tr
                        key={String(u.id)}
                        style={{ borderTop: "1px solid #E8ECF0" }}
                      >
                        <td style={{ padding: 10 }}>{String(u.name)}</td>
                        <td>{String(u.email)}</td>
                        <td>{String(u.role)}</td>
                        <td>
                          {u.active
                            ? tr("Actif", "نشط")
                            : tr("Désactivé", "معطّل")}
                        </td>
                        <td>
                          <button
                            className="btn-secondary"
                            disabled={busy || u.id === data.user.id}
                            onClick={async () => {
                              setBusy(true);
                              await command({
                                action: "user-active",
                                payload: { id: u.id, active: !u.active },
                              });
                              setBusy(false);
                            }}
                          >
                            {u.active
                              ? tr("Désactiver", "تعطيل")
                              : tr("Activer", "تفعيل")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <form
                className="card"
                style={{ padding: 24, display: "grid", gap: 16 }}
                onSubmit={(e) => submit(e, "professional-create")}
              >
                <h2 className="section-title">
                  {tr("Créer un compte professionnel", "إنشاء حساب مهني")}
                </h2>
                {field(tr("Nom complet", "الاسم الكامل"), "name", "")}
                {field("E-mail", "email", "", "email")}
                {field(tr("Organisme", "المؤسسة"), "organization", "")}
                <label style={labelStyle}>
                  {tr("Rôle", "الدور")}
                  <select style={inputStyle} name="role">
                    <option value="mediator">{tr("Médiateur", "وسيط")}</option>
                    <option value="partner">{tr("Partenaire", "شريك")}</option>
                  </select>
                </label>
                <label style={labelStyle}>
                  {tr(
                    "Mot de passe initial (8 caractères minimum)",
                    "كلمة السر الأولية (8 أحرف على الأقل)",
                  )}
                  <input
                    style={inputStyle}
                    name="password"
                    type="password"
                    minLength={8}
                    maxLength={128}
                    autoComplete="new-password"
                    required
                  />
                </label>
                <button className="btn-primary" disabled={busy}>
                  {tr("Créer le compte", "إنشاء الحساب")}
                </button>
              </form>
            </>
          )}
          {tab === "recovery" && (
            <section className="card" style={{ padding: 24 }}>
              <h2 className="section-title">
                {tr("Demandes de récupération", "طلبات استرجاع الحساب")}
              </h2>
              <p style={{ margin: "12px 0", color: "#7F8C9A" }}>
                {tr(
                  "Le lien est personnel, utilisable une seule fois et valable une heure. Remets-le directement au titulaire du compte. Un nouveau lien remplace le précédent.",
                  "الرابط شخصي، يستعمل مرة واحدة وصالح لمدة ساعة. سلّمه مباشرة لصاحب الحساب. الرابط الجديد يلغي الرابط السابق.",
                )}
              </p>
              {!data.recovery.length && (
                <p>
                  {tr("Aucune demande en attente.", "لا توجد طلبات معلقة.")}
                </p>
              )}
              {data.recovery.map((r) => (
                <div
                  key={String(r.user_id)}
                  style={{
                    padding: "14px 0",
                    borderTop: "1px solid #E8ECF0",
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <strong>{String(r.name)}</strong>
                    <p>
                      {String(r.email)} · {String(r.role)}
                    </p>
                  </div>
                  <button
                    className="btn-primary"
                    disabled={busy}
                    onClick={() => recovery(String(r.user_id), String(r.name))}
                  >
                    {tr("Créer le lien", "إنشاء الرابط")}
                  </button>
                </div>
              ))}
              {resetLink && (
                <div
                  role="status"
                  style={{
                    padding: 18,
                    marginTop: 16,
                    background: "#E0F7F5",
                    borderRadius: 12,
                  }}
                >
                  <strong>{resetName}</strong>
                  <label style={{ ...labelStyle, marginTop: 12 }}>
                    {tr("Lien personnel", "الرابط الشخصي")}
                    <input
                      readOnly
                      value={resetLink}
                      style={inputStyle}
                      onFocus={(e) => e.target.select()}
                    />
                  </label>
                  <button
                    className="btn-secondary"
                    style={{ marginTop: 10 }}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(resetLink);
                      } catch {
                        setError(
                          tr(
                            "Sélectionne et copie le lien dans le champ.",
                            "حدد الرابط وانسخه من الحقل.",
                          ),
                        );
                      }
                    }}
                  >
                    {tr("Copier", "نسخ")}
                  </button>
                </div>
              )}
            </section>
          )}
          {tab === "integrations" && (
            <section className="card" style={{ padding: 24 }}>
              <h2 className="section-title">
                {tr("Services de la plateforme", "خدمات المنصة")}
              </h2>
              <p style={{ marginTop: 14 }}>
                {tr(
                  "Les dossiers, orientations et rendez-vous sont enregistrés dans la base de données de la plateforme. La synchronisation mobile utilise une session authentifiée.",
                  "تُحفظ الملفات والتوجيهات والمواعيد في قاعدة بيانات المنصة. تستخدم مزامنة الهاتف جلسة موثقة.",
                )}
              </p>
              <p style={{ marginTop: 14, color: "#7F8C9A" }}>
                {tr(
                  "ANAPEC, INDH, WhatsApp et SMS : intégrations prévues dans la feuille de route.",
                  "ANAPEC وINDH وWhatsApp والرسائل القصيرة: تكاملات ضمن خارطة الطريق.",
                )}
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
