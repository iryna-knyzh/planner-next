"use client";

import "./EmojiBlock.css";
import { useEffect, useRef, useState } from "react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";
import { ArrowDown, ArrowUp } from "lucide-react";

type TooltipState = {
  x: number;
  y: number;
  visible: boolean;
};

/**
 * Floating emoji picker. By default a picked emoji is copied to the clipboard
 * (with a "Copied" tooltip). Pass `onSelect` to instead hand the emoji to the
 * caller — e.g. the Day page inserts it straight into the note.
 */
export const EmojiBlock = ({
  onSelect,
}: {
  onSelect?: (emoji: string) => void;
}) => {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    x: 0,
    y: 0,
    visible: false,
  });

  const onEmojiClick = (emojiData: EmojiClickData, event: MouseEvent) => {
    if (onSelect) {
      onSelect(emojiData.emoji);
      return;
    }

    navigator.clipboard.writeText(emojiData.emoji);

    setTooltip({
      x: event.clientX,
      y: event.clientY,
      visible: true,
    });

    setTimeout(() => {
      setTooltip((t) => ({ ...t, visible: false }));
    }, 1000);
  };

  // Detect clicks outside picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setEmojiOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={pickerRef} className="relative flex flex-col items-center">
      <div className="absolute bottom-full mb-2 right-0">
        <EmojiPicker
          onEmojiClick={onEmojiClick}
          skinTonesDisabled
          open={emojiOpen}
        />
      </div>

      {tooltip.visible && (
        <div
          className="copied-tooltip"
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          Copied ✓
        </div>
      )}
      <button
        onClick={() => setEmojiOpen(!emojiOpen)}
        className="group flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em]"
      >
        <span>Emoji</span>
        {emojiOpen ? (
          <ArrowDown className="w-4 h-4" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </button>
    </div>
  );
};
