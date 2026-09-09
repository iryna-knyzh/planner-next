"use client";

import { useCallback, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { EmojiBlock } from "@/components/EmojiBlock";
import { RichNoteEditor } from "@/components/RichNoteEditor";
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

// Habit tracker: the list of habit columns for a month is stored as JSON under
// one key; each day's checkmark is its own key so toggles write independently.
type Habit = { id: string; name: string };
const habitsKey = (year: number, monthIndex: number) =>
  `habits:${year}-${monthIndex}`;
const habitCheckKey = (
  year: number,
  monthIndex: number,
  habitId: string,
  day: number,
) => `habit:${year}-${monthIndex}:${habitId}:${day}`;

function parseHabits(raw: string): Habit[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Habit[]) : [];
  } catch {
    return [];
  }
}

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

  // Habit tracker columns for the visible month.
  const hKey = habitsKey(year, monthIndex);
  const habits = parseHabits(get(hKey).note);
  const setHabits = (next: Habit[]) =>
    update(hKey, { note: JSON.stringify(next) });
  const addHabit = () =>
    setHabits([...habits, { id: crypto.randomUUID(), name: "" }]);
  const renameHabit = (id: string, name: string) =>
    setHabits(habits.map((h) => (h.id === id ? { ...h, name } : h)));
  const removeHabit = (id: string) =>
    setHabits(habits.filter((h) => h.id !== id));
  const isDone = (id: string, day: number) =>
    get(habitCheckKey(year, monthIndex, id, day)).note === "1";
  const toggleHabit = (id: string, day: number) =>
    update(habitCheckKey(year, monthIndex, id, day), {
      note: isDone(id, day) ? "" : "1",
    });

  return (
    <div>
      <NavHeader
        title={`${t.months[monthIndex]} ${year}`}
        onPrev={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
        onNext={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
      />

      <div className={`flex flex-col lg:flex-row border-t lg:border ${colors.border}`}>
        {/* Left 50% — days of the month + habit tracker */}
        <div className={`w-full lg:w-1/2 flex flex-col lg:border-r ${colors.border}`}>
          {/* Habit tracker header: add button + editable habit names */}
          <div
            className={`flex items-end gap-2 px-3 py-2 border-b ${colors.border} ${colors.bgHeader}`}
          >
            <span className="w-10 flex-shrink-0" />
            <div className="flex-grow flex items-center justify-end">
              <button
                type="button"
                onClick={addHabit}
                className={`inline-flex items-center gap-1 text-[11px] ${colors.textMuted} hover:text-black transition-colors`}
              >
                <span className="text-sm leading-none">+</span>
                {t.addHabit}
              </button>
            </div>
            {habits.length > 0 && (
              <div className="flex-shrink-0 flex">
                {habits.map((h) => (
                  <div key={h.id} className="w-6 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => removeHabit(h.id)}
                      aria-label="Remove habit"
                      className="mb-1 text-[10px] leading-none text-[#D4D4D4] hover:text-black transition-colors"
                    >
                      ×
                    </button>
                    <input
                      value={h.name}
                      onChange={(e) => renameHabit(h.id, e.target.value)}
                      placeholder={t.habitName}
                      style={{ writingMode: "vertical-rl" }}
                      className={`h-20 w-full text-[12px] bg-transparent outline-none ${colors.textBody} ${colors.placeholder} focus:text-black`}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

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
                  className={`w-full flex-grow resize-none bg-transparent outline-none text-[13px] leading-snug ${colors.textBody} ${colors.placeholder} focus:text-black transition-colors duration-300`}
                  rows={1}
                />
                {habits.length > 0 && (
                  <div className="flex-shrink-0 flex pt-0.5">
                    {habits.map((h) => {
                      const done = isDone(h.id, day);
                      return (
                        <div key={h.id} className="w-6 flex justify-center">
                          <button
                            type="button"
                            onClick={() => toggleHabit(h.id, day)}
                            aria-label={h.name || t.habitName}
                            aria-pressed={done}
                            className={`w-5 h-5 rounded-[4px] border flex items-center justify-center text-[12px] leading-none transition-colors ${
                              done
                                ? "bg-[#16A34A] border-[#16A34A] text-white"
                                : "border-[#D4D4D4] text-transparent hover:border-[#A3A3A3]"
                            }`}
                          >
                            ✓
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
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
          {/* `key` remounts the editor when the month changes: Tiptap owns its
              DOM, so it is not swapped by a `value` prop alone. */}
          <div className="flex-grow p-6 md:p-8 focus-within:bg-white transition-colors duration-300">
            <RichNoteEditor
              key={monthEntryKey(year, monthIndex)}
              value={monthNoteValue}
              onChange={(note) => update(monthEntryKey(year, monthIndex), { note })}
              placeholder={t.monthNotesPlaceholder}
              editorClass={`min-h-[300px] text-lg font-light leading-relaxed ${colors.textBody}`}
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <EmojiBlock />
      </div>
    </div>
  );
}
