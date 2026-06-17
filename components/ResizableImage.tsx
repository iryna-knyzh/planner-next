"use client";

import { useRef } from "react";
import Image from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";

const MIN_WIDTH = 50; // px

/** Image node view: shows a drag handle (bottom-right) to resize the image. */
function ImageNodeView({ node, updateAttributes, selected }: NodeViewProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const { src, alt, title, width } = node.attrs as {
    src: string;
    alt: string | null;
    title: string | null;
    width: number | null;
  };

  const startResize = (event: React.PointerEvent) => {
    event.preventDefault();
    const img = imgRef.current;
    if (!img) return;

    const startX = event.clientX;
    const startWidth = img.offsetWidth;

    const onMove = (e: PointerEvent) => {
      const next = Math.max(MIN_WIDTH, startWidth + (e.clientX - startX));
      updateAttributes({ width: Math.round(next) });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <NodeViewWrapper className="rich-img" data-selected={selected || undefined}>
      <img
        ref={imgRef}
        src={src}
        alt={alt ?? ""}
        title={title ?? undefined}
        draggable={false}
        style={{ width: width ? `${width}px` : undefined }}
      />
      <span className="rich-img-handle" onPointerDown={startResize} />
    </NodeViewWrapper>
  );
}

/**
 * The base image extension plus a `width` attribute (serialized to the img's
 * inline style so it persists) and a node view with a drag-to-resize handle.
 */
export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (element) => {
          const raw = element.style.width || element.getAttribute("width");
          const value = raw ? parseInt(raw, 10) : NaN;
          return Number.isNaN(value) ? null : value;
        },
        renderHTML: (attributes) => {
          const width = (attributes as { width: number | null }).width;
          return width ? { style: `width: ${width}px` } : {};
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
