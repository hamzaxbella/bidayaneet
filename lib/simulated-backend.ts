"use client";

import {
  useCallback,
  useState,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";

/** Device-local demo repository. Replace this adapter with the business API later. */
const prefix = "bidayaneet.demo.v2.";
const cache = new Map<string, unknown>();
const listeners = new Map<string, Set<() => void>>();

function read<T>(key: string, initial: T): T {
  if (!cache.has(key)) {
    let value = initial;
    try {
      const stored = window.localStorage.getItem(prefix + key);
      if (stored !== null) value = JSON.parse(stored) as T;
    } catch {
      // Private browsing or invalid stored data falls back to a working demo.
    }
    cache.set(key, value);
  }
  return cache.get(key) as T;
}

export function useSimulatedState<T>(
  key: string,
  initial: T | (() => T),
): [T, Dispatch<SetStateAction<T>>] {
  const [initialValue] = useState<T>(initial);
  const subscribe = useCallback(
    (notify: () => void) => {
      const subscribers = listeners.get(key) ?? new Set<() => void>();
      subscribers.add(notify);
      listeners.set(key, subscribers);
      function sync(event: StorageEvent) {
        if (event.key !== prefix + key && event.key !== null) return;
        cache.delete(key);
        subscribers.forEach((listener) => listener());
      }
      window.addEventListener("storage", sync);
      return () => {
        subscribers.delete(notify);
        window.removeEventListener("storage", sync);
      };
    },
    [key],
  );
  const snapshot = useCallback(
    () => read(key, initialValue),
    [key, initialValue],
  );
  const serverSnapshot = useCallback(() => initialValue, [initialValue]);
  const value = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (update) => {
      const previous = read(key, initialValue);
      const next =
        typeof update === "function"
          ? (update as (current: T) => T)(previous)
          : update;
      cache.set(key, next);
      try {
        window.localStorage.setItem(prefix + key, JSON.stringify(next));
      } catch {
        /* In-memory mode remains available. */
      }
      listeners.get(key)?.forEach((listener) => listener());
    },
    [key, initialValue],
  );
  return [value, setValue];
}
