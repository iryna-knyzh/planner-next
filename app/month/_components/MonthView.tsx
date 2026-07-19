"use client";

import { useCallback, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { saveMonthEntry } from "../actions";
import { useI18n } from "@/lib/i18n/LanguageProvider";

const colors = {
  border: "border-[#E5E5E5]",
  bgHeader: "bg-[#FAFAFA]",
  bgWeekend: "bg-[#FFFBF5]",
  textMuted: "text-[#737373]",
  textLabel: "text-[#A3A3A3]",
  textWeekend: "text-[#A67C52]",
  textBody: "text-[#404040]",
  placeholder: "placeholder:text-[#D4D4D4]",
} as const;

const monthEntryKey = (year: number, monthIndex: number) =>
  `month:${year}-${monthIndex}`;
const dayEntryKey = (dateKey: string) => `day:${dateKey}`;

function getMonthDays(
  year: number,
  monthIndex: number,
): { day: number; dow: number; isWeekend: boolean }[] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const days: { day: number; dow: number; isWeekend: boolean }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, monthIndex, d).getDay();
    days.push({
      day: d,
      dow,
      isWeekend: dow === 0 || dow === 6,
    });
  }
  return days;
}

function makeDateKey(year: number, monthIndex: number, day: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
    day,
  ).padStart(2, "0")}`;
}

export function MonthView({
  initialEntries,
}: {
  initialEntries: Record<string, Entry>;
}) {
  // Track the first day of the visible month; prev/next step one month.
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  // Months only have notes, so persist just the note field.
  const save = useCallback(
    (key: string, entry: Entry) => saveMonthEntry(key, entry.note),
    [],
  );
  const { get, update } = usePlannerStore(initialEntries, save);
  const { t } = useI18n();

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  const year = cursor.getFullYear();
  const monthIndex = cursor.getMonth();
  const days = getMonthDays(year, monthIndex);
  const monthNoteValue = get(monthEntryKey(year, monthIndex)).note;

  return (
    <div>
      <NavHeader
        title={`${t.months[monthIndex]} ${year}`}
        onPrev={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
        onNext={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
      />

      <div className={`flex flex-col lg:flex-row border-t lg:border ${colors.border}`}>
        {/* Left 50% — days of the month */}
        <div className={`w-full lg:w-1/2 flex flex-col lg:border-r ${colors.border}`}>
          {days.map(({ day, dow, isWeekend }) => {
            const isToday =
              year === todayYear &&
              monthIndex === todayMonth &&
              day === todayDay;
            const dateKey = makeDateKey(year, monthIndex, day);
            const noteValue = get(dayEntryKey(dateKey)).note;

            return (
              <div
                key={day}
                className={`flex items-start gap-2 border-b ${colors.border} px-3 py-1.5 ${
                  isWeekend ? colors.bgWeekend : ""
                }`}
              >
                <span
                  className={`flex-shrink-0 flex items-baseline gap-1 pt-0.5 w-10 ${
                    isWeekend ? colors.textWeekend : colors.textLabel
                  }`}
                >
                  <span
                    className={`text-[11px] leading-none ${
                      isToday
                        ? "inline-flex items-center justify-center w-4 h-4 bg-black text-white rounded-full text-[9px]"
                        : ""
                    }`}
                  >
                    {day}
                  </span>
                  <span className="text-[9px] uppercase">
                    {t.weekdaysMin[dow]}
                  </span>
                </span>
                <textarea
                  value={noteValue}
                  onChange={(e) =>
                    update(dayEntryKey(dateKey), { note: e.target.value })
                  }
                  className={`w-full flex-grow resize-none bg-transparent outline-none text-[11px] leading-tight ${colors.textBody} ${colors.placeholder} focus:text-black transition-colors duration-300`}
                  rows={1}
                />
              </div>
            );
          })}
        </div>

        {/* Right 50% — month notes */}
        <div className="w-full lg:w-1/2 flex flex-col">
          <div className={`p-6 md:p-8 border-b ${colors.border} ${colors.bgHeader}`}>
            <h2
              className={`text-xs font-medium uppercase tracking-[0.25em] ${colors.textMuted}`}
            >
              {t.monthNotes}
            </h2>
          </div>
          <textarea
            value={monthNoteValue}
            onChange={(e) =>
              update(monthEntryKey(year, monthIndex), { note: e.target.value })
            }
            placeholder={t.monthNotesPlaceholder}
            className={`flex-grow w-full min-h-[300px] p-6 md:p-8 resize-none bg-transparent outline-none text-lg font-light leading-relaxed ${colors.textBody} ${colors.placeholder} focus:bg-white transition-colors duration-300`}
          />
        </div>
      </div>
    </div>
  );
}
