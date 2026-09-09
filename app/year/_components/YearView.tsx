"use client";

import { useCallback, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { EmojiBlock } from "@/components/EmojiBlock";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { saveYearEntry } from "../actions";
import {
  yearLabels,
  yearTabs,
  type Cols,
  type YField,
  type YGroup,
  type YTable,
} from "@/lib/i18n/yearContent";

const colors = {
  border: "border-[#E5E5E5]",
  textMuted: "text-[#737373]",
  textLabel: "text-[#A3A3A3]",
  textBody: "text-[#404040]",
  placeholder: "placeholder:text-[#D4D4D4]",
} as const;

const labelClass = `text-xs font-medium uppercase tracking-[0.15em] ${colors.textMuted}`;
const sectionInput = `w-full bg-transparent outline-none text-center transition-colors duration-300 placeholder:text-[#737373] focus:text-black`;
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
    <div key={f.key} className="flex h-full flex-col gap-1">
      {f.label && <span className={labelClass}>{tr(f.label)}</span>}
      {f.kind === "line" ? (
        <input
          type="text"
          value={get(K(f.key)).note}
          onChange={(e) => update(K(f.key), { note: e.target.value })}
          placeholder={tr(f.placeholder)}
          className={`${inputBase} border-b ${colors.border} py-1.5`}
        />
      ) : (
        <textarea
          value={get(K(f.key)).note}
          onChange={(e) => update(K(f.key), { note: e.target.value })}
          rows={f.rows ?? 2}
          placeholder={tr(f.placeholder)}
          className={`${inputBase} flex-1 resize-none border ${colors.border} p-2.5 leading-relaxed`}
        />
      )}
    </div>
  );

  // Grid "table": full column count only on the widest layout, halved on tablet
  // (each habit → why pair on its own line) and fully stacked on phones, where
  // every cell carries its column name as a label.
  const renderTable = (t: YTable) => {
    const n = t.columns.length;
    const wide = n > 2; // 4 columns: two pairs side by side
    const gridClass = wide
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
      : "grid-cols-1 md:grid-cols-2";
    const headerClass = wide ? "hidden lg:grid" : "hidden md:grid";
    const cellLabelClass = wide ? "lg:hidden" : "md:hidden";
    // Where the two pairs share a line (lg only), an 8px gutter splits them and
    // both sides close with the table's own hairline border.
    const gapBefore = (c: number) => wide && c === 2;
    const gapAfter = (c: number) => wide && c === 1;
    // Dividers: between the halves of a pair from md up, around the gap at lg.
    // Bottom line per cell. Stacked and on tablet it closes every line but the
    // row's last one; at lg the row draws nothing and each cell carries the
    // line, which leaves the gutter between the pairs open.
    const cellBottom = (c: number, lastRow: boolean) => {
      if (!wide) return c === n - 1 ? "" : "border-b md:border-b-0";
      const lg = lastRow ? "" : "lg:border-b";
      if (c < 2) return lastRow ? "border-b lg:border-b-0" : "border-b";
      if (c === 2) return `border-b md:border-b-0 ${lg}`;
      return lg;
    };
    // Dividers: between the halves of a pair from md up, around the gap at lg.
    const cellBorder = (c: number, lastRow: boolean) =>
      [
        c % 2 === 1 ? `md:border-l ${colors.border}` : "",
        gapAfter(c) ? `lg:mr-2 lg:border-r ${colors.border}` : "",
        gapBefore(c) ? `lg:border-l ${colors.border}` : "",
        cellBottom(c, lastRow),
      ].join(" ");

    return (
      <div className={`border ${colors.border}`}>
        <div className={`${headerClass} ${gridClass} bg-[#FAFAFA]`}>
          {t.columns.map((c, i) => (
            <div
              key={i}
              className={`border-b px-3 py-2 ${labelClass} ${colors.border} ${
                i > 0 ? `border-l ${colors.border}` : ""
              } ${gapAfter(i) ? `mr-2 border-r ${colors.border}` : ""}`}
            >
              {tr(c)}
            </div>
          ))}
        </div>
        {t.rows.map((row, r) =>
          "title" in row ? (
            <div
              key={row.title}
              className={`border-b ${colors.border} bg-[#FAFAFA] px-3 py-2 text-center ${labelClass} last:border-b-0`}
            >
              {tr(row.title)}
            </div>
          ) : "section" in row ? (
            <div
              key={row.section.key}
              className={`border-b ${colors.border} bg-[#FAFAFA] px-3 py-2 last:border-b-0`}
            >
              <input
                type="text"
                value={get(K(row.section.key)).note}
                onChange={(e) => update(K(row.section.key), { note: e.target.value })}
                placeholder={tr(row.section.placeholder)}
                className={`${sectionInput} ${labelClass}`}
              />
            </div>
          ) : (
            <div
              key={r}
              className={`grid ${gridClass} border-b ${colors.border} last:border-b-0 ${
                wide ? "lg:border-b-0" : ""
              }`}
            >
              {row.cells.map((f, c) => (
                <div
                  key={f.key}
                  className={`flex flex-col gap-1 px-3 py-2 ${colors.border} ${cellBorder(c, r === t.rows.length - 1)}`}
                >
                  <span className={`${cellLabelClass} ${labelClass}`}>
                    {tr(t.columns[c])}
                  </span>
                  <input
                    type="text"
                    value={get(K(f.key)).note}
                    onChange={(e) => update(K(f.key), { note: e.target.value })}
                    className={`${inputBase} py-1`}
                  />
                </div>
              ))}
            </div>
          ),
        )}
      </div>
    );
  };

  const renderGroup = (g: YGroup, i: number) => (
    <div key={i} className="flex flex-col gap-2">
      {g.title && (
        <h3 className="text-sm font-medium tracking-tight text-[#404040]">
          {tr(g.title)}
        </h3>
      )}
      {g.hint && <p className={`-mt-1 text-xs ${colors.textMuted}`}>{tr(g.hint)}</p>}
      {g.table ? (
        renderTable(g.table)
      ) : g.numbered ? (
        <div className={`grid grid-cols-1 ${COLS_CLASS[g.cols]} gap-x-6 gap-y-1`}>
          {g.fields.map((f, n) => (
            <div
              key={f.key}
              className={`flex items-baseline gap-3 border-b ${colors.border} py-1.5`}
            >
              <span className={`w-4 shrink-0 tabular-nums ${labelClass}`}>{n + 1}</span>
              <input
                type="text"
                value={get(K(f.key)).note}
                onChange={(e) => update(K(f.key), { note: e.target.value })}
                className={inputBase}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid grid-cols-1 ${COLS_CLASS[g.cols]} gap-x-6 gap-y-4`}>
          {g.fields.map(renderField)}
        </div>
      )}
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
      <div className="fixed bottom-6 right-6 z-50">
        <EmojiBlock />
      </div>
    </div>
  );
}
