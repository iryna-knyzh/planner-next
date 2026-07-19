"use client";

import { useEffect, useRef, useState } from "react";
import { LANGS } from "@/lib/i18n/translations";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];
  const others = LANGS.filter((l) => l.code !== lang);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="px-2 py-2 text-sm font-medium text-black hover:opacity-60 transition-opacity duration-200"
      >
        {current.label}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-1 flex flex-col bg-white z-50"
        >
          {others.map(({ code, label }) => (
            <button
              key={code}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => {
                setLang(code);
                setOpen(false);
              }}
              className="px-2 py-1.5 text-sm font-medium text-gray-500 hover:text-black text-left transition-colors duration-200"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
