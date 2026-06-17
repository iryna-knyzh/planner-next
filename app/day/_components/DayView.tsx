"use client";

import { useRef, useState } from "react";
import { usePlannerStore, type Entry } from "@/hooks/usePlannerStore";
import { NavHeader } from "@/components/NavHeader";
import { EmojiBlock } from "@/components/EmojiBlock";
import {
  RichNoteEditor,
  type RichNoteEditorHandle,
} from "@/components/RichNoteEditor";
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
  const editorRef = useRef<RichNoteEditorHandle>(null);

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
            <RichNoteEditor
              key={key}
              ref={editorRef}
              value={entry.note}
              onChange={(note) => update(key, { note })}
              placeholder="Write anything... (paste or drop an image)"
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        <EmojiBlock onSelect={(emoji) => editorRef.current?.insert(emoji)} />
      </div>
    </div>
  );
}
