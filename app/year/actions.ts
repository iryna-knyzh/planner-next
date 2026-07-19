"use server";

import { prisma } from "@/lib/prisma";

/**
 * Upsert a year-page entry (note only).
 * key = "year:<year>:<field>" (e.g. "year:2026:vision", "year:2026:goal:0").
 */
export async function saveYearEntry(key: string, note: string) {
  await prisma.yearEntry.upsert({
    where: { key },
    create: { key, note },
    update: { note },
  });
}
