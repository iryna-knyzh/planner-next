"use client";

import { useCallback, useRef, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { EmojiBlock } from "@/components/EmojiBlock";
import {
  RichNoteEditor,
  type RichNoteEditorHandle,
} from "@/components/RichNoteEditor";
import { useI18n } from "@/lib/i18n/LanguageProvider";
import { saveYearEntry } from "../actions";
import {
  MONTH_NAMES,
  MONTH_SEASONS,
  SEASON_EMOJI,
  yearLabels,
  yearTabs,
  type Cols,
  type Season,
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

// Row tint + text colour per season, matching the reference months sheet.
const SEASON_CLASS: Record<Season, { row: string; text: string }> = {
  winter: { row: "bg-[#EFF6FF]", text: "text-[#3730A3]" },
  spring: { row: "bg-[#F0FDF4]", text: "text-[#166534]" },
  summer: { row: "bg-[#FEFCE8]", text: "text-[#A16207]" },
  autumn: { row: "bg-[#FFF7ED]", text: "text-[#EA580C]" },
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
  const editorRef = useRef<RichNoteEditorHandle>(null);
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

  const renderGroup = (g: YGroup, i: number) => (
    <div key={i} className="flex flex-col gap-2">
      {g.title && (
        <h3 className="text-sm font-medium tracking-tight text-[#404040]">
          {tr(g.title)}
        </h3>
      )}
      {g.hint && <p className={`-mt-1 text-xs ${colors.textMuted}`}>{tr(g.hint)}</p>}
      {g.numbered ? (
        <div className={`grid grid-cols-1 ${COLS_CLASS[g.cols]} gap-x-6 gap-y-1`}>
          {g.fields.map((f, n) => (
            <div
              key={f.key}
              className={`flex items-baseline gap-3 border-b ${colors.border} py-1.5`}
            >
              <span className={`w-6 shrink-0 text-right tabular-nums ${labelClass}`}>
                {n + 1}
              </span>
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

  // Same rich editor as the Day page; `key` remounts it when the year changes
  // so Tiptap loads that year's note instead of keeping the previous one.
  const renderNote = () => {
    const key = K("description");
    return (
      <div className={`min-h-[300px] border ${colors.border} p-6`}>
        <RichNoteEditor
          key={key}
          ref={editorRef}
          value={get(key).note}
          onChange={(note) => update(key, { note })}
          placeholder={tr("desc.placeholder")}
        />
      </div>
    );
  };

  // One block per month: the coloured name row from the reference sheet
  // (number · emoji + ru · en · uk) with a free-text note right below it.
  const renderMonths = () => (
    <div className={`border ${colors.border}`}>
      {MONTH_SEASONS.map((season, m) => {
        const c = SEASON_CLASS[season];
        const key = K(`month.${m}`);
        return (
          <div key={m} className={`border-b ${colors.border} last:border-b-0`}>
            <div
              className={`grid grid-cols-[2rem_1fr_1fr_1fr] items-center gap-2 px-3 py-2.5 text-sm ${c.row} ${c.text}`}
            >
              <span className="text-center font-semibold tabular-nums">{m + 1}</span>
              <span className="truncate">
                {SEASON_EMOJI[season]} {MONTH_NAMES.ru[m]}
              </span>
              <span className="truncate">{MONTH_NAMES.en[m]}</span>
              <span className="truncate">{MONTH_NAMES.uk[m]}</span>
            </div>
            <textarea
              value={get(key).note}
              onChange={(e) => update(key, { note: e.target.value })}
              rows={3}
              placeholder={tr("month.placeholder")}
              className={`${inputBase} block resize-y px-3 py-2.5 leading-relaxed`}
            />
          </div>
        );
      })}
    </div>
  );

  const renderBody = () => {
    if (tab.kind === "note") return renderNote();
    if (tab.kind === "months") return renderMonths();
    return <div className="flex flex-col gap-8">{tab.groups.map(renderGroup)}</div>;
  };

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
        <div className="mt-6">{renderBody()}</div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <EmojiBlock
          onSelect={
            tab.kind === "note"
              ? (emoji) => editorRef.current?.insert(emoji)
              : undefined
          }
        />
      </div>
    </div>
  );
}
