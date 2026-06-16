"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type Entry = { note: string; theme: string };

const EMPTY: Entry = { note: "", theme: "" };

type SaveFn = (key: string, entry: Entry) => Promise<void> | void;

/**
 * Client-side store backing the planner UI with the database.
 *
 * Seeded from server-rendered `initial` entries, it keeps edits in local state
 * for an instant, optimistic UI and persists each changed key via the provided
 * server action, debounced per key so a burst of keystrokes results in a single
 * write.
 */
export function usePlannerStore(
  initial: Record<string, Entry>,
  save: SaveFn,
  delay = 600,
) {
  const [entries, setEntries] = useState<Record<string, Entry>>(initial);
  const entriesRef = useRef(entries);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Flush any pending writes when the component unmounts.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const key of Object.keys(pending)) {
        clearTimeout(pending[key]);
        void save(key, entriesRef.current[key] ?? EMPTY);
      }
    };
  }, [save]);

  const get = useCallback(
    (key: string): Entry => entries[key] ?? EMPTY,
    [entries],
  );

  const update = useCallback(
    (key: string, patch: Partial<Entry>) => {
      const next: Entry = { ...(entriesRef.current[key] ?? EMPTY), ...patch };
      entriesRef.current = { ...entriesRef.current, [key]: next };
      setEntries(entriesRef.current);

      clearTimeout(timers.current[key]);
      timers.current[key] = setTimeout(() => {
        delete timers.current[key];
        void save(key, next);
      }, delay);
    },
    [save, delay],
  );

  return { get, update };
}
