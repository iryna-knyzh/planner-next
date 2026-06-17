import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import type { NextRequest } from "next/server";
import { UPLOAD_DIR } from "./storage";

// Image uploads write to a disk volume (UPLOAD_DIR); the note only stores the
// returned URL. Keep the whitelist of allowed types in sync with the GET
// handler that serves the files back.
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = EXT_BY_TYPE[file.type];
  if (!ext) {
    return Response.json({ error: "Unsupported image type" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File too large" }, { status: 413 });
  }

  const name = `${randomUUID()}.${ext}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(
    `${UPLOAD_DIR}/${name}`,
    Buffer.from(await file.arrayBuffer()),
  );

  return Response.json({ url: `/api/uploads/${name}` });
}
