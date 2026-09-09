"use client";

import { useState } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  getDay,
  getISOWeekYear,
  getISOWeek,
} from "date-fns";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { EmojiBlock } from "@/components/EmojiBlock";
import { RichNoteEditor } from "@/components/RichNoteEditor";
import { saveWeekEntry } from "../actions";
import { useI18n } from "@/lib/i18n/LanguageProvider";

enum DAYS {
  MON = 0,
  TUE = 1,
  WED = 2,
  THU = 3,
  FRI = 4,
  SAT = 5,
  SUN = 6,
}

const weekEntryKey = (year: number, week: number) => `week:${year}-${week}`;
const dayEntryKey = (dateKey: string) => `day:${dateKey}`;

// Only desktop arranges the week into two columns:
//   Mon  Thu
//   Tue  Fri
//   Wed  Sat Sun
// Days are rendered in natural Mon→Sun DOM order (so mobile and tablet read
// correctly) and reordered into the layout above with CSS `order`, which only
// applies from `lg` up. The index of a day in VISUAL_ORDER is its position on
// desktop.
const VISUAL_ORDER = [
  DAYS.MON,
  DAYS.THU,
  DAYS.TUE,
  DAYS.FRI,
  DAYS.WED,
  DAYS.SAT,
  DAYS.SUN,
];

// Static classes so Tailwind can see them. Index = desktop visual position.
const ORDER_CLASSES = [
  "lg:order-none",
  "lg:order-1",
  "lg:order-2",
  "lg:order-3",
  "lg:order-4",
  "lg:order-5",
  "lg:order-6",
];

export function WeekView({
  initialEntries,
}: {
  initialEntries: Record<string, Entry>;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { get, update } = usePlannerStore(initialEntries, saveWeekEntry);
  const { t } = useI18n();

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  // Natural Mon→Sun order; tablet/desktop reorder happens via CSS below.
  const weekDays = allDays;

  // ISO week-numbering year + ISO week so late-December weeks that belong to
  // week 1 of the next year are keyed under that year, not the calendar year.
  const year = getISOWeekYear(weekStart);
  const weekKey = getISOWeek(weekStart);
  const weekEntry = get(weekEntryKey(year, weekKey));

  return (
    <div>
      <NavHeader
        title={t.months[weekStart.getMonth()]}
        onPrev={() => setCurrentDate(subWeeks(currentDate, 1))}
        onNext={() => setCurrentDate(addWeeks(currentDate, 1))}
      />

      <div className="p-5">
        {/* Week Theme Input */}
        <div className="flex-grow flex flex-col lg:flex-row">
          <div className="w-full flex items-center mb-5 md:mb-10 pb-2 border-b border-[#E5E5E5]">
            <label
              htmlFor="week-theme"
              className="mr-4 text-xs font-medium uppercase tracking-[0.25em] text-[#737373]"
            >
              {t.theme}
            </label>
            <input
              id="week-theme"
              type="text"
              value={weekEntry.theme}
              onChange={(e) =>
                update(weekEntryKey(year, weekKey), { theme: e.target.value })
              }
              placeholder={t.weekThemePlaceholder}
              className="w-full bg-transparent text-1xl md:text-1xl font-normal tracking-tight outline-none border-none placeholder:text-[#D4D4D4] focus:text-black transition-colors duration-300"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-grow flex flex-col lg:flex-row gap-8 lg:gap-5 border-[#E5E5E5]">
          {/* Days Grid */}
          <div className="w-full lg:w-3/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t lg:border-l lg:border-r border-[#E5E5E5]">
            {weekDays.map((day, dayIndex) => {
              const isTodayDate = isToday(day);
              const dayOfWeek = getDay(day);
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const dateKey = format(day, "yyyy-MM-dd");

              // Position within the desktop two-column layout.
              const visualPos = VISUAL_ORDER.indexOf(dayIndex);
              const isLeftColumn = visualPos % 2 === 0;

              // Tablet is a natural-order list, so the only inner divider is
              // between Saturday and Sunday (Sat sits in the left cell).
              // `dayOfWeek` is date-fns getDay(): Sun=0 … Sat=6.
              const isSaturday = dayOfWeek === 6;
              const hasMdBorder = isSaturday;
              // Desktop: right border on left-column weekdays and the
              // right-column weekend cell (Sat). `md:border-r` already covers
              // `lg`, so Sat only needs the md rule.
              const hasLgBorder = isWeekend ? !isLeftColumn : isLeftColumn;
              const borderClass = hasMdBorder
                ? "md:border-r"
                : hasLgBorder
                  ? "lg:border-r"
                  : "";

              return (
                <div
                  key={day.toString()}
                  className={`
                    min-h-[300px] p-6 flex flex-col gap-4
                    ${ORDER_CLASSES[visualPos]}
                    ${isWeekend ? "" : "col-span-2"}
                    border-b border-[#E5E5E5]
                    ${borderClass}
                    ${isWeekend ? "bg-[#FFFBF5]" : "bg-transparent"}
                    transition-colors duration-500
                  `}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-light tracking-tighter">
                      {format(day, "d")}
                    </span>
                    <span
                      className={`text-xs font-medium uppercase tracking-[0.25em] ${
                        isWeekend ? "text-[#A67C52]" : "text-[#737373]"
                      }`}
                    >
                      {t.weekdaysShort[getDay(day)]}
                    </span>
                    {isTodayDate && (
                      <span className="w-1.5 h-1.5 bg-black rounded-full ml-auto" />
                    )}
                  </div>
                  <textarea
                    value={get(dayEntryKey(dateKey)).note}
                    onChange={(e) =>
                      update(dayEntryKey(dateKey), { note: e.target.value })
                    }
                    className="underlined-textarea flex-grow w-full resize-none bg-transparent outline-none text-sm font-normal leading-relaxed text-[#404040] placeholder:text-[#D4D4D4] focus:text-black transition-colors duration-300"
                  />
                </div>
              );
            })}
          </div>

          {/* Weekly Notes Sidebar */}
          <div className="w-full lg:w-3/6 lg:border-l lg:border-r lg:border-b border-t border-[#E5E5E5] flex flex-col">
            <div className="p-6 md:p-8 border-b border-[#E5E5E5] bg-[#FAFAFA]">
              <h2 className="text-xs font-medium uppercase tracking-[0.25em] text-[#737373] mb-1">
                {t.weeklyNotes}
              </h2>
            </div>
            {/* `key` remounts the editor when the week changes: Tiptap owns its
                DOM, so it is not swapped by a `value` prop alone. */}
            <div className="flex-grow p-6 md:p-8 focus-within:bg-white transition-colors duration-300">
              <RichNoteEditor
                key={weekEntryKey(year, weekKey)}
                value={weekEntry.note}
                onChange={(note) => update(weekEntryKey(year, weekKey), { note })}
                placeholder={t.weeklyNotesPlaceholder}
                editorClass="min-h-[300px] text-lg font-light leading-relaxed text-[#404040]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <EmojiBlock />
      </div>
    </div>
  );
}
