"use client";

import { forwardRef, useEffect, useImperativeHandle } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import { ResizableImage } from "./ResizableImage";
import { FormatBubbleMenu } from "./FormatBubbleMenu";

/** Upload a pasted/dropped image and return the URL to embed in the note. */
async function uploadImage(file: File): Promise<string | null> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/uploads", { method: "POST", body });
  if (!res.ok) return null;
  const { url } = (await res.json()) as { url: string };
  return url;
}

// Anchored on the block tags `editor.getHTML()` can start with. A loose test
// would misread plain prose that merely contains "<" — e.g. "budget <b at 5> ok"
// — as markup and let the parser silently drop it.
const LOOKS_LIKE_HTML =
  /^\s*<(p|h[1-6]|ul|ol|li|blockquote|pre|hr|img|div|figure|br)\b/i;

/** Old notes are plain text; render them as paragraphs instead of raw HTML. */
function toContent(value: string): string {
  if (!value) return "";
  if (LOOKS_LIKE_HTML.test(value)) return value;
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped
    .split(/\n/)
    .map((line) => `<p>${line || "<br>"}</p>`)
    .join("");
}

export type RichNoteEditorHandle = {
  /** Insert text (e.g. an emoji) at the current cursor position. */
  insert: (text: string) => void;
};

export const RichNoteEditor = forwardRef<
  RichNoteEditorHandle,
  {
    value: string;
    onChange: (html: string) => void;
    placeholder?: string;
    /** Typography/sizing of the editable area; defaults to the Day note look. */
    editorClass?: string;
  }
>(function RichNoteEditor({ value, onChange, placeholder, editorClass }, ref) {
  const editor = useEditor({
    // Required in the Next.js App Router to avoid SSR hydration mismatches.
    immediatelyRender: false,
    extensions: [
      StarterKit, // bold/italic/underline/strike are already in here
      ResizableImage,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
    ],
    content: toContent(value),
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: `outline-none ${
          editorClass ??
          "min-h-[60vh] text-lg font-light leading-relaxed text-[#404040]"
        }`,
      },
      handlePaste: (_view, event) => insertFiles(event.clipboardData?.files),
      handleDrop: (_view, event) => insertFiles(event.dataTransfer?.files),
    },
  });

  // Keep the editor in sync when the parent swaps the note (e.g. day nav).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(toContent(value), { emitUpdate: false });
    }
  }, [value, editor]);

  useImperativeHandle(
    ref,
    () => ({
      insert: (text: string) =>
        editor?.chain().focus().insertContent(text).run(),
    }),
    [editor],
  );

  function insertFiles(files: FileList | null | undefined): boolean {
    const images = files
      ? Array.from(files).filter((f) => f.type.startsWith("image/"))
      : [];
    if (images.length === 0) return false;
    void (async () => {
      for (const file of images) {
        const url = await uploadImage(file);
        if (url) editor?.chain().focus().setImage({ src: url }).run();
      }
    })();
    return true; // we handled it; stop the default paste/drop
  }

  return (
    <>
      {/* Guarded: BubbleMenu calls document.createElement during render, so it
          must never reach the server. `immediatelyRender: false` keeps `editor`
          null there (and on the first client render). */}
      {editor && <FormatBubbleMenu editor={editor} />}
      <EditorContent editor={editor} className="rich-note" />
    </>
  );
});
