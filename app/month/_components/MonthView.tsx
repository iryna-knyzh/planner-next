"use client";

import { useCallback, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { saveMonthEntry } from "../actions";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

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

function getCalendarDays(year: number, monthIndex: number): (number | null)[] {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length < 42) cells.push(null);
  return cells;
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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  // Months only have notes, so persist just the note field.
  const save = useCallback(
    (key: string, entry: Entry) => saveMonthEntry(key, entry.note),
    [],
  );
  const { get, update } = usePlannerStore(initialEntries, save);

  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();

  return (
    <div>
      <NavHeader
        title={currentYear}
        onPrev={() => setCurrentYear((y) => y - 1)}
        onNext={() => setCurrentYear((y) => y + 1)}
      />

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px border ${colors.border} bg-[#E5E5E5]`}
      >
        {MONTHS.map((month, mIdx) => {
          const cells = getCalendarDays(currentYear, mIdx);
          const monthNoteValue = get(monthEntryKey(currentYear, mIdx)).note;

          return (
            <div key={month} className={`${colors.bgHeader} flex flex-col h-full`}>
              {/* Month header */}
              <div className={`px-4 pt-4 pb-2 border-b ${colors.border}`}>
                <h3
                  className={`text-xs font-medium uppercase tracking-[0.2em] ${colors.textMuted}`}
                >
                  {month}
                </h3>
              </div>

              {/* Calendar with per-day inputs */}
              <div className="px-2 pt-2 pb-1">
                <div className="grid grid-cols-7 mb-1">
                  {WEEKDAY_LABELS.map((d) => (
                    <div
                      key={d}
                      className={`text-center text-[9px] font-medium uppercase ${colors.textLabel} py-0.5`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {cells.map((day, i) => {
                    const colIdx = i % 7;
                    const isWeekend = colIdx >= 5;
                    const isToday =
                      day !== null &&
                      currentYear === todayYear &&
                      mIdx === todayMonth &&
                      day === todayDay;
                    const dateKey =
                      day !== null ? makeDateKey(currentYear, mIdx, day) : null;
                    const noteValue = dateKey
                      ? get(dayEntryKey(dateKey)).note
                      : "";

                    return (
                      <div
                        key={i}
                        className={`flex flex-col border-b border-r ${colors.border} last:border-r-0 p-0.5 min-h-[48px] ${
                          day === null
                            ? "bg-white"
                            : isWeekend
                              ? colors.bgWeekend
                              : ""
                        }`}
                      >
                        {day !== null && (
                          <>
                            <span
                              className={`text-[10px] leading-none mb-0.5 ${
                                isToday
                                  ? "inline-flex items-center justify-center w-4 h-4 bg-black text-white rounded-full text-[9px]"
                                  : isWeekend
                                    ? colors.textWeekend
                                    : colors.textLabel
                              }`}
                            >
                              {day}
                            </span>
                            <textarea
                              value={noteValue}
                              onChange={(e) =>
                                dateKey &&
                                update(dayEntryKey(dateKey), {
                                  note: e.target.value,
                                })
                              }
                              className={`w-full flex-grow resize-none bg-transparent outline-none text-[11px] leading-tight ${colors.textBody} ${colors.placeholder} focus:text-black transition-colors duration-300`}
                              rows={1}
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Month notes */}
              <div
                className={`flex-grow px-3 pb-3 pt-1 border-t ${colors.border}`}
              >
                <textarea
                  value={monthNoteValue}
                  onChange={(e) =>
                    update(monthEntryKey(currentYear, mIdx), {
                      note: e.target.value,
                    })
                  }
                  placeholder="Notes..."
                  className={`w-full h-full min-h-[60px] resize-none bg-transparent outline-none text-sm font-normal leading-relaxed ${colors.textBody} ${colors.placeholder} focus:text-black transition-colors duration-300`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
