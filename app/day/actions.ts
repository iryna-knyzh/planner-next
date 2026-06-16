"use server";

import { prisma } from "@/lib/prisma";

export type Entry = { note: string; theme: string };

/** Upsert a single day's note + theme. key = "YYYY-MM-DD". */
export async function saveDayEntry(key: string, entry: Entry) {
  await prisma.dayEntry.upsert({
    where: { key },
    create: { key, note: entry.note, theme: entry.theme },
    update: { note: entry.note, theme: entry.theme },
  });
}
