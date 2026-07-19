"use client";

import { useCallback, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { saveYearEntry } from "../actions";
import {
  yearLabels,
  yearTabs,
  type Cols,
  type YField,
  type YGroup,
} from "@/lib/i18n/yearContent";

const colors = {
  border: "border-[#E5E5E5]",
  textMuted: "text-[#737373]",
  textLabel: "text-[#A3A3A3]",
  textBody: "text-[#404040]",
  placeholder: "placeholder:text-[#D4D4D4]",
} as const;

const labelClass = `text-xs font-medium uppercase tracking-[0.15em] ${colors.textMuted}`;
const inputBase = `w-full bg-transparent outline-none text-sm ${colors.textBody} ${colors.placeholder} focus:text-black transition-colors duration-300`;

// Static column classes so Tailwind keeps them in the build.
const COLS_CLASS: Record<Cols, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

export function YearView({
  initialEntries,
}: {
  initialEntries: Record<string, Entry>;
}) {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [activeTab, setActiveTab] = useState(yearTabs[0].id);
  const save = useCallback(
    (key: string, entry: Entry) => saveYearEntry(key, entry.note),
    [],
  );
  const { get, update } = usePlannerStore(initialEntries, save);
  const { lang } = useI18n();

  const tr = (key?: string) => (key ? (yearLabels[lang][key] ?? key) : "");
  const K = (field: string) => `year:${year}:${field}`;

  const tab = yearTabs.find((t) => t.id === activeTab) ?? yearTabs[0];

  const renderField = (f: YField) => (
    <div key={f.key} className="flex flex-col gap-1">
      {f.label && <span className={labelClass}>{tr(f.label)}</span>}
      {f.kind === "line" ? (
        <input
          type="text"
          value={get(K(f.key)).note}
          onChange={(e) => update(K(f.key), { note: e.target.value })}
          className={`${inputBase} border-b ${colors.border} py-1.5`}
        />
      ) : (
        <textarea
          value={get(K(f.key)).note}
          onChange={(e) => update(K(f.key), { note: e.target.value })}
          rows={f.rows ?? 2}
          className={`${inputBase} resize-none border ${colors.border} p-2.5 leading-relaxed`}
        />
      )}
    </div>
  );

  const renderGroup = (g: YGroup, i: number) => (
    <div key={i} className="flex flex-col gap-2">
      {g.title && (
        <h3 className="text-sm font-medium tracking-tight text-[#404040]">
          {tr(g.title)}
        </h3>
      )}
      {g.hint && <p className={`-mt-1 text-xs ${colors.textMuted}`}>{tr(g.hint)}</p>}
      <div className={`grid grid-cols-1 ${COLS_CLASS[g.cols]} gap-x-6 gap-y-4`}>
        {g.fields.map(renderField)}
      </div>
    </div>
  );

  return (
    <div>
      <NavHeader
        title={year}
        onPrev={() => setYear((v) => v - 1)}
        onNext={() => setYear((v) => v + 1)}
      />

      {/* Tab bar */}
      <div
        className={`flex gap-1 overflow-x-auto overflow-y-hidden border-b ${colors.border} mb-6`}
      >
        {yearTabs.map((t) => {
          const isActive = t.id === activeTab;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`shrink-0 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-200 ${
                isActive
                  ? "border-black text-black"
                  : `border-transparent ${colors.textMuted} hover:text-black`
              }`}
            >
              {tr(t.label)}
            </button>
          );
        })}
      </div>

      {/* Active tab content */}
      <div className={`border ${colors.border} bg-white p-6 md:p-8`}>
        {tab.eyebrow && (
          <p className={`text-[11px] font-medium uppercase tracking-[0.25em] ${colors.textLabel}`}>
            {tab.eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-lg md:text-xl font-medium tracking-tight">
          {tr(tab.label)}
        </h2>
        {tab.subtitle && (
          <p className={`mt-2 text-sm font-light italic ${colors.textMuted}`}>
            {tr(tab.subtitle)}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-8">
          {tab.groups.map(renderGroup)}
        </div>
      </div>
    </div>
  );
}
