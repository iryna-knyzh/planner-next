"use server";

import { prisma } from "@/lib/prisma";

export type Entry = { note: string; theme: string };

/**
 * Upsert a week-page entry.
 * key = "week:<year>-<weekNumber>" (note + theme) or "day:YYYY-MM-DD" (note).
 */
export async function saveWeekEntry(key: string, entry: Entry) {
  await prisma.weekEntry.upsert({
    where: { key },
    create: { key, note: entry.note, theme: entry.theme },
    update: { note: entry.note, theme: entry.theme },
  });
}
