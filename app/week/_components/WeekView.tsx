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
  getYear,
  getWeek,
} from "date-fns";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { EmojiBlock } from "./Emoji/Emoji";
import { saveWeekEntry } from "../actions";

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

export function WeekView({
  initialEntries,
}: {
  initialEntries: Record<string, Entry>;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { get, update } = usePlannerStore(initialEntries, saveWeekEntry);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const allDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekDays = [
    allDays[DAYS.MON],
    allDays[DAYS.THU],
    allDays[DAYS.TUE],
    allDays[DAYS.FRI],
    allDays[DAYS.WED],
    allDays[DAYS.SAT],
    allDays[DAYS.SUN],
  ];

  const year = getYear(weekStart);
  const weekKey = getWeek(weekStart);
  const weekEntry = get(weekEntryKey(year, weekKey));

  return (
    <div>
      <NavHeader
        title={weekStart.toLocaleString("default", { month: "long" })}
        onPrev={() => setCurrentDate(subWeeks(currentDate, 1))}
        onNext={() => setCurrentDate(addWeeks(currentDate, 1))}
      />

      <div className="p-5">
        {/* Week Theme Input */}
        <div className="flex-grow flex flex-col lg:flex-row">
          <div className="w-full flex items-center mb-2 md:mb-10 pb-2 border-b border-[#E5E5E5]">
            <label
              htmlFor="week-theme"
              className="mr-4 text-xs font-medium uppercase tracking-[0.25em] text-[#737373]"
            >
              Theme:
            </label>
            <input
              id="week-theme"
              type="text"
              value={weekEntry.theme}
              onChange={(e) =>
                update(weekEntryKey(year, weekKey), { theme: e.target.value })
              }
              placeholder="Focus, intention, or goal for this week..."
              className="w-full bg-transparent text-1xl md:text-1xl font-normal tracking-tight outline-none border-none placeholder:text-[#D4D4D4] focus:text-black transition-colors duration-300"
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex-grow flex flex-col lg:flex-row gap-8 lg:gap-5 border-[#E5E5E5]">
          {/* Days Grid */}
          <div className="w-full lg:w-3/6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t lg:border-l lg:border-r border-[#E5E5E5]">
            {weekDays.map((day) => {
              const isTodayDate = isToday(day);
              const dayOfWeek = getDay(day);
              const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
              const dateKey = format(day, "yyyy-MM-dd");
              return (
                <div
                  key={day.toString()}
                  className={`
                    min-h-[300px] p-6 flex flex-col gap-4
                    ${isWeekend ? "" : "col-span-2"}
                    border-b border-[#E5E5E5]
                    md:border-r
                    ${isWeekend ? "md:odd:border-r-0" : "md:odd:border-r md:even:border-r-0"}
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
                      {format(day, "EEE")}
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
                Weekly Notes
              </h2>
            </div>
            <textarea
              value={weekEntry.note}
              onChange={(e) =>
                update(weekEntryKey(year, weekKey), { note: e.target.value })
              }
              placeholder="Type your thoughts, insights..."
              className="flex-grow w-full h-[300px] p-6 md:p-8 bg-transparent resize-none outline-none text-lg font-light leading-relaxed text-[#404040] placeholder:text-[#D4D4D4] focus:bg-white transition-colors duration-300"
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
