"use client";
import LanguageSwitcher, {
  useTranslation,
} from "@/components/LanguageProvider";
import { useEffect, useState, useRef, useCallback } from "react";
import { DiagnosisForm } from "./Platform";
import Link from "next/link";
import Brand from "../Brand";
import {
  allRecords,
  putRecord,
  removeRecord,
  type Draft,
} from "@/lib/offline-store";
import type { Diagnosis, User, Youth } from "@/lib/platform-types";
export default function Terrain() {
  const { t } = useTranslation();

  const [user, setUser] = useState<User | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [online, setOnline] = useState(true);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [edit, setEdit] = useState<Draft | null>(null);
  const locked = useRef(false);
  const refresh = useCallback(async () => {
    const records = await allRecords();
    const identity = records.find((r) => r.id === "identity") as
      { user: User } | undefined;
    setUser(identity?.user || null);
    setDrafts(records.filter((r) => r.id !== "identity") as Draft[]);
  }, []);
  const sync = useCallback(async () => {
    if (locked.current || !navigator.onLine) return;
    locked.current = true;
    setBusy(true);
    try {
      const response = await fetch("/api/session", { cache: "no-store" });
      if (!response.ok) {
        setNotice(
          "Reconnecte-toi au compte médiateur pour synchroniser. Les dossiers restent sur cet appareil.",
        );
        return;
      }
      setOnline(true);
      const { user: current } = await response.json();
      await putRecord({ id: "identity", user: current });
      if (!["admin", "mediator"].includes(current.role)) {
        setNotice("Un compte médiateur est nécessaire.");
        return;
      }
      const records = (await allRecords()).filter(
        (r) => r.id !== "identity",
      ) as Draft[];
      let count = 0;
      for (const draft of records) {
        if (draft.owner !== current.id) continue;
        const result = await fetch("/api/platform", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "save-youth",
            payload: { id: draft.id, data: draft.data, version: 0 },
          }),
        });
        if (result.ok) {
          await removeRecord(draft.id);
          count++;
        } else {
          const body = await result.json();
          await putRecord({
            ...draft,
            error: body.error || "Synchronisation refusée",
          });
          if (result.status === 401) break;
        }
      }
      const remaining = records.filter((d) => d.owner !== current.id).length;
      setNotice(
        `${count} dossier(s) synchronisé(s).${remaining ? " Des dossiers attendent leur compte d’origine." : ""}`,
      );
    } catch {
      setOnline(false);
      setNotice(
        "Connexion indisponible. Les dossiers restent enregistrés sur cet appareil.",
      );
    } finally {
      await refresh().catch(() => {});
      locked.current = false;
      setBusy(false);
    }
  }, [refresh]);
  useEffect(() => {
    let active = true;
    const connection = () => {
      setOnline(navigator.onLine);
      if (navigator.onLine) void sync();
    };
    void Promise.resolve()
      .then(refresh)
      .then(() => setOnline(navigator.onLine))
      .then(() => sync())
      .catch((e) => setNotice(e.message));
    if ("serviceWorker" in navigator && window.isSecureContext) {
      void navigator.serviceWorker
        .register("/terrain-worker.js")
        .then(() => navigator.serviceWorker.ready)
        .then(
          (registration) =>
            new Promise<void>((resolve, reject) => {
              const channel = new MessageChannel();
              channel.port1.onmessage = (event) => {
                channel.port1.close();
                if (event.data.ok) resolve();
                else reject(new Error("Cache incomplet"));
              };
              registration.active?.postMessage(
                {
                  type: "PREPARE",
                  urls: performance
                    .getEntriesByType("resource")
                    .map((entry) => entry.name),
                },
                [channel.port2],
              );
            }),
        )
        .then(() => {
          if (active) setReady(true);
        })
        .catch(() =>
          setNotice("Le mode hors connexion n’a pas pu être préparé."),
        );
    } else
      void Promise.resolve().then(() =>
        setNotice(
          "Une connexion HTTPS est nécessaire pour préparer le mode hors connexion sur Android.",
        ),
      );
    window.addEventListener("online", connection);
    window.addEventListener("offline", connection);
    const interval = setInterval(() => {
      if (navigator.onLine) void sync();
    }, 5000);
    return () => {
      active = false;
      clearInterval(interval);
      window.removeEventListener("online", connection);
      window.removeEventListener("offline", connection);
    };
  }, [refresh, sync]);
  async function save(_action: string, payload: unknown) {
    if (locked.current || !user || !["admin", "mediator"].includes(user.role))
      return false;
    locked.current = true;
    setBusy(true);
    try {
      const value = payload as { id: string; data: Diagnosis };
      await putRecord({
        id: value.id,
        owner: user.id,
        data: value.data,
        createdAt: new Date().toISOString(),
      });
      await refresh();
      setNotice("Diagnostic enregistré sur cet appareil.");
      void navigator.storage?.persist?.();
      return true;
    } catch (e) {
      setNotice((e as Error).message);
      return false;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="terrain-page">
      <header className="terrain-top">
        <LanguageSwitcher />
        <Brand />
        <Link href="/platform" prefetch={false}>
          {t("Retour à la plateforme")}
        </Link>
      </header>
      <section className="p-panel">
        <h1>{t("Terrain · hors connexion")}</h1>
        <p role="status">
          {t(online ? "En ligne" : "Hors connexion")} {t(" ·")}
          {t(" ")}
          {t(
            ready
              ? "Prêt hors connexion"
              : "Préparation du mode hors connexion…",
          )}
        </p>
        <p>
          {user
            ? `Compte de collecte : ${user.name} (${user.email})`
            : "Connecte-toi à la plateforme avec un compte médiateur, puis ouvre cet espace en ligne une première fois."}
        </p>
        <p>
          {t(
            "Sur Android : menu Chrome → Installer l’application / Ajouter à l’écran d’accueil. Les dossiers en attente sont conservés dans ce navigateur. Utilise un appareil personnel verrouillé ; le stockage local n’est pas chiffré. Ne vide pas les données du navigateur avant la synchronisation.",
          )}
        </p>
        <button
          className="button button-primary"
          disabled={!online || busy}
          onClick={() => void sync()}
        >
          {t("Synchroniser maintenant")}
        </button>
        {notice && <p role="alert">{t(notice)}</p>}
      </section>
      <section className="p-panel">
        <h2>
          {t("Dossiers en attente (")}
          {t(drafts.length)}
          {t(")")}
        </h2>
        {drafts.map((d) => (
          <div className="terrain-draft" key={d.id}>
            <strong>
              {d.owner === user?.id ? d.data.name : "Dossier d’un autre compte"}
            </strong>
            <span>
              {t(
                d.error
                  ? `À corriger : ${d.error}`
                  : "En attente de synchronisation",
              )}
            </span>
            {d.owner === user?.id && d.error && (
              <button
                className="button"
                disabled={busy}
                onClick={() => {
                  setEdit(d);
                }}
              >
                {t("Corriger")}
              </button>
            )}
          </div>
        ))}
      </section>
      {user && ["admin", "mediator"].includes(user.role) && (
        <fieldset className="p-workspace-fieldset" disabled={busy}>
          <DiagnosisForm
            key={edit?.id || generation}
            offline
            onSave={save}
            youth={
              edit
                ? ({ id: edit.id, data: edit.data, version: 0 } as Youth)
                : undefined
            }
          />
        </fieldset>
      )}
      {user && ["admin", "mediator"].includes(user.role) && (
        <button
          className="button"
          disabled={busy}
          onClick={() => {
            setEdit(null);
            setGeneration((g) => g + 1);
          }}
        >
          {t("Nouveau diagnostic")}
        </button>
      )}
    </main>
  );
}
