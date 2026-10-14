"use client";
import {casablancaInstant} from "@/lib/casablanca-time";
import { useTranslation as useUiTranslation } from "@/components/LanguageProvider";

import Translated from "@/components/Translated";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import {
  workspaceDatasets,
  workspaceState,
  type WorkspaceData,
  type AppointmentView,
} from "@/lib/workspace-data";
type Command = { action: string; payload: unknown };
type State = {
  data: WorkspaceData;
  values: Record<string, unknown>;
  command: (command: Command) => Promise<boolean>;
  set: (key: string, value: unknown) => void;
};
const Context = createContext<State | null>(null);
export function LiveProvider({
  initial,
  children,
}: {
  initial: WorkspaceData;
  children: ReactNode;
}) {
  const { text: uiText } = useUiTranslation();

  const {text}=useUiTranslation();
  const [data, setData] = useState(initial),
    [values, setValues] = useState(() => workspaceState(initial)),
    [notice, setNotice] = useState(""),
    [error, setError] = useState(false);
  const latest = useRef(values),
    pending = useRef(0),
    chain = useRef(Promise.resolve());
  const reload = async () => {
    const r = await fetch("/api/workspace", { cache: "no-store" });
    if (r.status === 401) {
      location.assign("/auth/" + initial.user.role + "/sign-in");
      return;
    }
    if (!r.ok) throw Error("Actualisation indisponible.");
    const fresh = (await r.json()) as WorkspaceData;
    if (
      fresh.user.id !== initial.user.id ||
      fresh.user.role !== initial.user.role
    ) {
      location.assign(
        {
          admin: "/",
          mediator: "/mediator",
          partner: "/partner",
          neet: "/neet",
        }[fresh.user.role],
      );
      return;
    }
    setData(fresh);
    const next = workspaceState(fresh);
    latest.current = next;
    setValues(next);
  };
  useEffect(() => {
    const tick = setInterval(() => {
      if (!pending.current) void reload().catch(() => {});
    }, 15000);
    return () => clearInterval(tick);
  }, []);
  async function command(c: Command) {
    pending.current++;
    try {
      const r = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Workspace-User":initial.user.id },
        body: JSON.stringify(c),
      });
      const result = await r.json();
      if (!r.ok) throw Error(result.error || "Modification impossible.");
      await reload();
      setError(false);
      setNotice("Modification enregistrée dans la base.");
      return true;
    } catch (e) {
      setError(true);
      setNotice(e instanceof Error ? e.message : "Connexion indisponible.");
      await reload().catch(() => {});
      return false;
    } finally {
      pending.current--;
    }
  }
  function set(key: string, value: unknown) {
    const prev = latest.current[key];
    latest.current = { ...latest.current, [key]: value };
    setValues(latest.current);
    try {
      const cmds = commandsFor(key, prev, value, data);
      chain.current = chain.current.then(async () => {
        for (const c of cmds) if (!(await command(c))) break;
      });
    } catch (e) {
      latest.current = workspaceState(data);
      setValues(latest.current);
      setError(true);
      setNotice(e instanceof Error ? e.message : "Action indisponible.");
    }
  }
  return (
    <Context.Provider value={{ data, values, set, command }}>
      {children}
      {notice && (
        <div
          className={`live-feedback ${error ? "live-feedback-error" : ""}`}
          role={error ? "alert" : "status"}
        >
          <span>{text(notice)}</span>
          <button onClick={() => setNotice("")} aria-label={uiText("Fermer")}>
            <Translated value="×" />
          </button>
        </div>
      )}
    </Context.Provider>
  );
}
export function useWorkspace() {
  const c = useContext(Context);
  if (!c) throw Error("Authenticated workspace required");
  return c;
}
export function useWorkspaceDatasets() {
  return workspaceDatasets(useWorkspace().data);
}
export function useWorkspaceState<T>(
  key: string,
  _initial: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const c = useWorkspace();
  const [local, setLocal] = useState<T>(_initial);
  const value = (c.values[key] ?? local) as T;
  if (key.startsWith("ui.")) return [local, setLocal];
  return [
    value,
    (update) =>
      c.set(
        key,
        typeof update === "function" ? (update as (v: T) => T)(value) : update,
      ),
  ];
}
function commandsFor(
  key: string,
  previous: unknown,
  next: unknown,
  data: WorkspaceData,
): Command[] {
  const command = (action: string, payload: unknown) => [{ action, payload }];
  if (key.endsWith(".profile")) return command("workspace-profile", next);
  if (key === "neet.saved") return command("bookmark-set", next);
  if (key === "neet.completed") return command("checklist-set", next);
  if (key === "neet.enrolled") return command("enrollment-set", next);
  if (key === "neet.applications") {
    const before = previous as string[],
      id = (next as string[]).find((id) => !before.includes(id));
    return id ? command("application", { offerId: id }) : [];
  }
  if (key.startsWith("mediator.notes.")) {
    const note = (next as { text: string; action: string }[])[0];
    return command("case-note", {
      id: crypto.randomUUID(),
      youthId: key.slice("mediator.notes.".length),
      body: note.text,
      nextAction: note.action,
    });
  }
  if (key === "mediator.appointments") {
    const before = previous as AppointmentView[],
      after = next as AppointmentView[];
    const changed = after.find(
      (a) => !before.some((b) => b.id === a.id && b.done === a.done),
    );
    if (!changed) return [];
    if (before.some((a) => a.id === changed.id))
      return command("appointment-done", {
        id: changed.id,
        done: changed.done,
      });
    const youth = data.people.find(
      (p) => p.id === changed.youthId || p.id === changed.name,
    );
    if (!youth) throw Error("Sélectionne le dossier du jeune.");
    return command("appointment", {
      youthId: youth.id,
      startsAt: casablancaInstant(changed.date,changed.time),
      title: changed.type,
      location: changed.location,
    });
  }
  if (key === "mediator.referrals") {
    const before = previous as { offer: string; person: string }[],
      after = next as { offer: string; person: string }[];
    const added = after.find(
      (r) => !before.some((b) => b.offer === r.offer && b.person === r.person),
    );
    return added
      ? command("referral-draft", {
          id: crypto.randomUUID(),
          youthId: added.person,
          offerId: added.offer,
        })
      : [];
  }
  if (key === "mediator.attendees") {
    const before = previous as Record<string, string[]>,
      after = next as Record<string, string[]>;
    const result: Command[] = [];
    for (const id of new Set([...Object.keys(before), ...Object.keys(after)])) {
      for (const person of new Set([
        ...(before[id] || []),
        ...(after[id] || []),
      ])) {
        const attended = (after[id] || []).includes(person);
        if (attended !== (before[id] || []).includes(person))
          result.push({
            action: "participation",
            payload: { youthId: person, activityId: id, attended },
          });
      }
    }
    return result;
  }
  if (key.startsWith("messages.")) {
    const before = previous as Record<string, unknown[]>,
      after = next as Record<string, { text: string }[]>;
    const peer = Object.keys(after).find(
      (k) => after[k].length > (before[k]?.length || 0),
    );
    return peer
      ? command("message", {
          recipientId: peer,
          body: after[peer].at(-1)?.text,
        })
      : [];
  }
  if (key === "partner.referrals") {
    const before = previous as { id: string; status: string; notes: string }[],
      after = next as typeof before;
    const p = after.find(
      (r) =>
        !before.some(
          (b) => b.id === r.id && b.status === r.status && b.notes === r.notes,
        ),
    );
    return p
      ? command("referral-stage", {
          id: p.id,
          status: p.status,
          notes: p.notes,
        })
      : [];
  }
  if (key === "partner.opportunities") {
    const before = previous as {
        id: string;
        capacity: number;
        status: string;
      }[],
      after = next as typeof before;
    const offer = after.find(
      (r) =>
        !before.some(
          (b) =>
            b.id === r.id && b.capacity === r.capacity && b.status === r.status,
        ),
    );
    return offer ? command("partner-offer", offer) : [];
  }
  if (key === "partner.activity") return [];
  throw Error("Cette action doit être enregistrée depuis son formulaire.");
}
