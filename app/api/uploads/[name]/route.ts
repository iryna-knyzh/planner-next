import { readFile } from "node:fs/promises";
import type { NextRequest } from "next/server";
import { UPLOAD_DIR, contentTypeFor, isValidName } from "../storage";

// Serve an uploaded image from the disk volume. A route handler is required
// because the standalone build bakes /public at build time and cannot serve
// files written at runtime.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;

  if (!isValidName(name)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(`${UPLOAD_DIR}/${name}`);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentTypeFor(name),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
