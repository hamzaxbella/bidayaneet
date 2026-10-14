"use client";
import { useTranslation } from "@/components/LanguageProvider";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import type { PlatformData, Youth } from "@/lib/platform-types";
import { recommendActivities } from "@/lib/activation";
import { journeyState, journeyLabels, type JourneyInput } from "@/lib/journey";
const today = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(
    new Date(),
  );
function Input({
  label,
  name,
  type = "text",
  value,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string;
}) {
  const { t } = useTranslation();

  return (
    <label className="form-field">
      {t(label)}
      <input
        className="field-input"
        name={name}
        type={type}
        dir={type === "text" ? "auto" : undefined}
        defaultValue={value}
        required
        max={type === "date" && name !== "checkDueDate" ? today() : undefined}
        maxLength={type === "text" ? 1500 : undefined}
      />
    </label>
  );
}
export default function JourneyPanel({
  youth,
  data,
  mutate,
  editable,
}: {
  youth: Youth;
  data: PlatformData;
  mutate: (action: string, payload: unknown) => Promise<boolean>;
  editable: boolean;
}) {
  const { t, text } = useTranslation();

  const events = (data.journeys || []).filter((e) => e.youth_id === youth.id),
    state = journeyState(events);
  const step = !state.onboarding
    ? "onboarding"
    : !state.activation
      ? "activation"
      : !state.insertion
        ? "insertion"
        : "stabilisation";
  const eventId = useRef<string>("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    eventId.current = "";
  }, [step, events.length]);
  const activities = data.activities.filter((a) =>
    data.participations.some(
      (p) => p.youth_id === youth.id && p.activity_id === a.id && p.attended,
    ),
  );
  const accepted = data.referrals.filter(
    (r) => r.youth_id === youth.id && r.status === "accepted",
  );
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = new FormData(e.currentTarget),
      v = (n: string) => String(form.get(n) || "");
    eventId.current ||= crypto.randomUUID();
    let detail: JourneyInput["data"];
    if (step === "onboarding")
      detail = {
        date: v("date"),
        programExplained: form.has("programExplained") as true,
        joined: form.has("joined") as true,
        note: v("note"),
      };
    else if (step === "activation")
      detail = {
        date: v("date"),
        activityIds: form.getAll("activityIds").map(String),
        abilities: v("abilities"),
        project: v("project"),
        path: v("path") as "Formation",
      };
    else if (step === "insertion")
      detail = {
        date: v("date"),
        referralId: v("referralId"),
        organization: v("organization"),
        position: v("position"),
        checkDueDate: v("checkDueDate"),
        note: v("note"),
      };
    else
      detail = {
        date: v("date"),
        status: v("status") as "continuing",
        note: v("note"),
      };
    setBusy(true);
    try {
      const ok = await mutate("journey-step", {
        id: eventId.current,
        youthId: youth.id,
        step,
        data: detail,
      });
      if (ok) eventId.current = "";
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="p-panel p-space">
      <div className="p-panel-head">
        <h2>{t("Le parcours nominal")}</h2>
        <span className="p-tag p-tag-teal">{t(state.label)}</span>
      </div>
      <p className="p-muted">
        {t(
          "Chaque étape est datée et documentée par l’accompagnateur. Le maintien se confirme après l’échéance choisie, à partir d’un constat de suivi.",
        )}
      </p>
      <div className="journey-progress">
        {Object.entries(journeyLabels).map(([key, label]) => {
          const done =
            key === "stabilisation"
              ? state.stabilized
              : events.some((e) => e.step === key);
          return (
            <div
              className={done ? "journey-node journey-done" : "journey-node"}
              key={key}
            >
              {done ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              <span>{t(label)}</span>
            </div>
          );
        })}
      </div>
      {state.onboarding && !state.activation && (
        <div className="p-space">
          <h3>{t("Premières activités proposées")}</h3>
          <p className="p-muted">
            {t(
              "Propositions à discuter avec le jeune. Le choix n’inscrit pas automatiquement et ne confirme pas une présence.",
            )}
          </p>
          {recommendActivities(youth, data).map(({ activity, reasons }) => (
            <div className="p-calm" key={activity.id}>
              <div>
                <strong>
                  {activity.data.title} {t(" · ")}
                  {t(activity.data.date)}
                </strong>
                <p>{t(reasons.join(" · "))}</p>
              </div>
            </div>
          ))}
          {!recommendActivities(youth, data).length && (
            <p className="p-muted">
              {t(
                "Aucune activité à venir compatible et disponible. Prépare une rencontre adaptée dans Activités de terrain.",
              )}
            </p>
          )}
        </div>
      )}
      {events.length > 0 && (
        <ol className="journey-history">
          {events.map((event) => (
            <li key={event.id}>
              <strong>{t(journeyLabels[event.step])}</strong>
              <span className="p-muted">{t(event.data.date)}</span>
              <p style={{ whiteSpace: "pre-line" }}>
                {event.step === "activation" ? (
                  <>
                    {t(event.data.path)} · {event.data.project}
                    {"\n"}
                    {t("Capacités observées :")} {event.data.abilities}
                  </>
                ) : event.step === "insertion" ? (
                  <>
                    {t(event.data.activityType || "Activité")} ·{" "}
                    {event.data.position} · {event.data.organization}
                    {"\n"}
                    {event.data.note}
                    {"\n"}
                    {t("Vérification prévue le")} {event.data.checkDueDate}
                  </>
                ) : event.step === "stabilisation" ? (
                  <>
                    {t(
                      event.data.status === "continuing"
                        ? "Activité maintenue"
                        : "Activité interrompue",
                    )}{" "}
                    · {event.data.note}
                  </>
                ) : (
                  event.data.note
                )}
              </p>
            </li>
          ))}
        </ol>
      )}
      {editable && (
        <div className="p-divider">
          <h3>{t(journeyLabels[step])}</h3>
          {step === "activation" && !activities.length ? (
            <p className="p-muted">
              {t(
                "Confirme une présence dans Activités de terrain, puis consigne les capacités observées et le projet choisi.",
              )}
            </p>
          ) : step === "insertion" && !accepted.length ? (
            <p className="p-muted">
              {t(
                "Une orientation acceptée par le partenaire est nécessaire. Documente ici le démarrage réel lorsqu’il a eu lieu.",
              )}
            </p>
          ) : (
            <form
              key={step + events.length}
              className="p-form"
              onSubmit={submit}
            >
              <Input
                label={text(
                  step === "insertion"
                    ? "Date de démarrage réel"
                    : "Date du constat",
                )}
                name="date"
                type="date"
                value={today()}
              />
              {step === "onboarding" && (
                <>
                  <label className="p-checkbox">
                    <input type="checkbox" name="programExplained" required />
                    {t(
                      "Le programme et son fonctionnement ont été expliqués au jeune.",
                    )}
                  </label>
                  <label className="p-checkbox">
                    <input type="checkbox" name="joined" required />
                    {t("Le jeune confirme son entrée dans le parcours.")}
                  </label>
                  <Input
                    label={text("Compte rendu de l’entrée au programme")}
                    name="note"
                  />
                </>
              )}
              {step === "activation" && (
                <>
                  <fieldset>
                    <legend>
                      {t("Activités suivies et présences confirmées")}
                    </legend>
                    {activities.map((a) => (
                      <label className="p-checkbox" key={a.id}>
                        <input
                          type="checkbox"
                          name="activityIds"
                          value={a.id}
                        />
                        {a.data.title} {t(" · ")}
                        {t(a.data.date)}
                      </label>
                    ))}
                  </fieldset>
                  <Input
                    label={text("Capacités observées après les activités")}
                    name="abilities"
                  />
                  <Input
                    label={text("Projet clarifié avec le jeune")}
                    name="project"
                  />
                  <label className="form-field">
                    {t("Voie choisie")}
                    <select name="path" className="field-input">
                      <option>{t("Formation")}</option>
                      <option>{t("Emploi")}</option>
                      <option>{t("Entrepreneuriat")}</option>
                    </select>
                  </label>
                </>
              )}
              {step === "insertion" && (
                <>
                  <label className="form-field">
                    {t("Orientation acceptée")}
                    <select name="referralId" className="field-input">
                      {accepted.map((r) => (
                        <option key={r.id} value={r.id}>
                          {t(
                            data.offers.find((o) => o.id === r.offer_id)?.data
                              .title || "Opportunité liée",
                          )}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Input
                    label={text("Structure d’accueil effective")}
                    name="organization"
                  />
                  <Input
                    label={text("Emploi, formation ou activité démarrée")}
                    name="position"
                  />
                  <Input
                    label={text("Date prévue de vérification du maintien")}
                    name="checkDueDate"
                    type="date"
                  />
                  <Input
                    label={text("Éléments attestant le démarrage")}
                    name="note"
                  />
                </>
              )}
              {step === "stabilisation" && (
                <>
                  <p className="p-muted">
                    {t("Échéance de maintien : ")}
                    {t(state.insertion?.data.checkDueDate)}
                    {t(
                      ". Un suivi antérieur est conservé sans déclarer le parcours stabilisé.",
                    )}
                  </p>
                  <label className="form-field">
                    {t("Situation constatée")}
                    <select name="status" className="field-input">
                      <option value="continuing">
                        {t("Activité maintenue")}
                      </option>
                      <option value="interrupted">
                        {t("Activité interrompue")}
                      </option>
                    </select>
                  </label>
                  <Input
                    label={text("Éléments vérifiés et prochaine action")}
                    name="note"
                  />
                </>
              )}
              <button disabled={busy} className="button button-primary">
                {t(busy ? "Enregistrement…" : "Documenter cette étape")}
              </button>
            </form>
          )}
        </div>
      )}
    </section>
  );
}
