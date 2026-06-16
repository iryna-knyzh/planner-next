"use client";

import { useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { saveDayEntry } from "../actions";

function formatDate(date: Date): string {
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.toLocaleDateString("en-US", { day: "numeric" });
  return `${month} ${day}`;
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function DayView({
  initialEntries,
}: {
  initialEntries: Record<string, Entry>;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { get, update } = usePlannerStore(initialEntries, saveDayEntry);

  const key = dateKey(currentDate);
  const entry = get(key);

  const prev = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const next = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  return (
    <div>
      <NavHeader title={formatDate(currentDate)} onPrev={prev} onNext={next} />
      <div className="p-5">
        <div className="flex-grow flex flex-col lg:flex-row">
          <div className="w-full flex items-center mb-2 md:mb-10 pb-2 border-b border-[#E5E5E5]">
            <label
              htmlFor="day-theme"
              className="mr-4 text-xs font-medium uppercase tracking-[0.25em] text-[#737373]"
            >
              Theme:
            </label>
            <input
              id="day-theme"
              type="text"
              value={entry.theme}
              onChange={(e) => update(key, { theme: e.target.value })}
              placeholder="Focus, intention, or goal for this day..."
              className="w-full bg-transparent font-normal tracking-tight outline-none border-none placeholder:text-[#D4D4D4] focus:text-black transition-colors duration-300"
            />
          </div>
        </div>
        <div className="border-t border-l border-r border-b border-[#E5E5E5]">
          <div className="min-h-[300px] p-6 flex flex-col gap-4">
            <textarea
              value={entry.note}
              onChange={(e) => update(key, { note: e.target.value })}
              placeholder="Write anything..."
              className="flex-grow w-full min-h-[60vh] resize-none bg-transparent outline-none text-sm font-normal leading-relaxed text-[#404040] placeholder:text-[#D4D4D4] focus:text-black transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
