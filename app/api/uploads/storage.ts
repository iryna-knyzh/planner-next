// Where uploaded images live on disk. In Docker this is a mounted volume
// (see docker-compose.yml); locally it falls back to ./uploads.
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./uploads";

// Filenames are server-generated (uuid.ext); reject anything else so a request
// can never escape UPLOAD_DIR via path traversal.
const NAME_PATTERN = /^[a-f0-9-]+\.(png|jpg|gif|webp)$/;

const CONTENT_TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

export function isValidName(name: string): boolean {
  return NAME_PATTERN.test(name);
}

export function contentTypeFor(name: string): string {
  const ext = name.split(".").pop() ?? "";
  return CONTENT_TYPE[ext] ?? "application/octet-stream";
}
