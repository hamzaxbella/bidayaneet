"use client";

import { createContext, useContext, useEffect, useMemo, type Dispatch, type SetStateAction, type ReactNode } from "react";
import { useSimulatedState } from "@/lib/simulated-backend";
import { normalizeYouthProfile, youthProfileFixture } from "@/lib/youth-ar";

type YouthState = {
  profile: Record<string, string>;
  setProfile: Dispatch<SetStateAction<Record<string, string>>>;
  saved: string[];
  applications: string[];
  completed: number[];
  enrolled: number[];
  toggleSaved: (id: string) => void;
  apply: (id: string) => void;
  toggleCompleted: (id: number) => void;
  toggleEnrolled: (id: number) => void;
};
const Context = createContext<YouthState | null>(null);
export default function YouthProvider({ children }: { children: ReactNode }) {
  const [storedProfile, setProfile] = useSimulatedState("neet.profile", youthProfileFixture);
  const profile = useMemo(() => normalizeYouthProfile(storedProfile), [storedProfile]);
  useEffect(() => {
    if (JSON.stringify(storedProfile) !== JSON.stringify(profile)) setProfile(profile);
  }, [storedProfile, profile, setProfile]);
  const [saved, setSaved] = useSimulatedState<string[]>("neet.saved", []);
  const [applications, setApplications] = useSimulatedState<string[]>(
    "neet.applications",
    [],
  );
  const [completed, setCompleted] = useSimulatedState<number[]>(
    "neet.completed",
    [0],
  );
  const [enrolled, setEnrolled] = useSimulatedState<number[]>(
    "neet.enrolled",
    [],
  );
  return (
    <Context.Provider
      value={{
        profile,
        setProfile,
        saved,
        applications,
        completed,
        enrolled,
        toggleSaved: (id) =>
          setSaved((current) =>
            current.includes(id)
              ? current.filter((item) => item !== id)
              : [...current, id],
          ),
        apply: (id) =>
          setApplications((current) =>
            current.includes(id) ? current : [...current, id],
          ),
        toggleCompleted: (id) =>
          setCompleted((current) =>
            current.includes(id)
              ? current.filter((item) => item !== id)
              : [...current, id],
          ),
        toggleEnrolled: (id) =>
          setEnrolled((current) =>
            current.includes(id)
              ? current.filter((item) => item !== id)
              : [...current, id],
          ),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useYouth() {
  const state = useContext(Context);
  if (!state) throw new Error("Youth UI must be rendered inside YouthProvider");
  return state;
}
