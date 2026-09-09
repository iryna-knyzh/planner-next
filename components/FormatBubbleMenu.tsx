"use client";

import { BubbleMenu } from "@tiptap/react/menus";
import { useEditorState, type Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  RemoveFormatting,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/LanguageProvider";

/**
 * Floating toolbar shown over a text selection inside a Tiptap editor:
 * bold / italic / underline / strike, a fixed highlight palette and a reset.
 *
 * Rendered by `RichNoteEditor`, so every note that uses that editor gets it.
 */

// Muted highlighter tones, kept in the planner's pastel range.
const HIGHLIGHTS = ["#FEF3C7", "#DCFCE7", "#DBEAFE", "#FCE7F3", "#EDE9FE"];

const btnClass =
  "flex h-8 w-8 items-center justify-center rounded transition-colors duration-150 hover:bg-[#F5F5F5]";
const activeClass = "bg-[#EDEDED] text-black";
const iconClass = "w-3.5 h-3.5 stroke-[1.5px]";
const dividerClass = "mx-1 h-4 w-px bg-[#E5E5E5]";

export function FormatBubbleMenu({ editor }: { editor: Editor }) {
  const { t } = useI18n();

  // Re-render only this toolbar when the selection or its marks change.
  // Reading `editor.isActive()` straight in the render would instead re-render
  // on every keystroke, since any transaction bumps the editor.
  const marks = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor.isActive("bold"),
      italic: editor.isActive("italic"),
      underline: editor.isActive("underline"),
      strike: editor.isActive("strike"),
      highlight:
        (editor.getAttributes("highlight").color as string | undefined) ?? "",
    }),
  });

  const chain = () => editor.chain().focus();
  const marked = (on: boolean) => `${btnClass} ${on ? activeClass : ""}`;
  // Clicking a toolbar button would otherwise blur the editor and drop the
  // caret; the commands themselves work off the stored selection.
  const keepSelection = (e: React.MouseEvent) => e.preventDefault();

  return (
    <BubbleMenu
      editor={editor}
      // Only for a real text selection — an image is selected as a node and has
      // nothing to format.
      // Replacing the library default, so re-state the checks it made: a real,
      // non-empty text range, and not an image (selected as a node).
      shouldShow={({ editor, state, from, to }) =>
        from !== to &&
        !state.selection.empty &&
        state.doc.textBetween(from, to).length > 0 &&
        !editor.isActive("image")
      }
      options={{ placement: "top", offset: 8 }}
      // Below the fixed EmojiBlock (z-50) so the two never fight.
      className="z-40 flex items-center rounded border border-[#E5E5E5] bg-white p-1 shadow-sm"
    >
      <button
        type="button"
        onMouseDown={keepSelection}
        aria-label={t.format.bold}
        title={t.format.bold}
        onClick={() => chain().toggleBold().run()}
        className={marked(marks.bold)}
      >
        <Bold className={iconClass} />
      </button>
      <button
        type="button"
        onMouseDown={keepSelection}
        aria-label={t.format.italic}
        title={t.format.italic}
        onClick={() => chain().toggleItalic().run()}
        className={marked(marks.italic)}
      >
        <Italic className={iconClass} />
      </button>
      <button
        type="button"
        onMouseDown={keepSelection}
        aria-label={t.format.underline}
        title={t.format.underline}
        onClick={() => chain().toggleUnderline().run()}
        className={marked(marks.underline)}
      >
        <Underline className={iconClass} />
      </button>
      <button
        type="button"
        onMouseDown={keepSelection}
        aria-label={t.format.strike}
        title={t.format.strike}
        onClick={() => chain().toggleStrike().run()}
        className={marked(marks.strike)}
      >
        <Strikethrough className={iconClass} />
      </button>

      <span className={dividerClass} />

      {HIGHLIGHTS.map((color) => (
        <button
          key={color}
          type="button"
          onMouseDown={keepSelection}
          aria-label={`${t.format.highlight} ${color}`}
          title={t.format.highlight}
          onClick={() => chain().toggleHighlight({ color }).run()}
          className="flex h-7 w-5 items-center justify-center"
        >
          <span
            className={`h-4 w-4 rounded-full border transition-colors duration-150 ${
              marks.highlight === color ? "border-black" : "border-[#D4D4D4]"
            }`}
            style={{ backgroundColor: color }}
          />
        </button>
      ))}

      <span className={dividerClass} />

      <button
        type="button"
        onMouseDown={keepSelection}
        aria-label={t.format.clear}
        title={t.format.clear}
        // clearNodes() as well: StarterKit's markdown input rules let "# " or
        // "- " create headings and lists, which unsetAllMarks() cannot undo.
        onClick={() => chain().unsetAllMarks().clearNodes().run()}
        className={btnClass}
      >
        <RemoveFormatting className={iconClass} />
      </button>
    </BubbleMenu>
  );
}
