"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

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
  const [saved, setSaved] = useState<string[]>([]);
  const [applications, setApplications] = useState<string[]>([]);
  const [completed, setCompleted] = useState<number[]>([0]);
  const [enrolled, setEnrolled] = useState<number[]>([]);
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
