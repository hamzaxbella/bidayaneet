"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSimulatedState } from "@/lib/simulated-backend";

type YouthState = {
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
