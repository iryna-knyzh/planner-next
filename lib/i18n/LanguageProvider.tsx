"use client";

import { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import {
  DEFAULT_LANG,
  translations,
  type Dict,
  type Lang,
} from "./translations";

const STORAGE_KEY = "planner-lang";

// The chosen language lives in localStorage so it survives reloads. We read it
// through useSyncExternalStore: the server (and first client render) use
// DEFAULT_LANG, then React swaps in the stored value after hydration without a
// mismatch warning.
let listeners: (() => void)[] = [];

function subscribe(callback: () => void) {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function emit() {
  for (const l of listeners) l();
}

function getSnapshot(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
  return stored && stored in translations ? stored : DEFAULT_LANG;
}

function getServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

function setLangGlobal(next: Lang) {
  localStorage.setItem(STORAGE_KEY, next);
  emit();
}

interface I18nContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Keep the document language attribute in sync (external-system update).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider
      value={{ lang, setLang: setLangGlobal, t: translations[lang] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within a LanguageProvider");
  }
  return ctx;
}
