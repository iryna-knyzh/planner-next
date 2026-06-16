"use server";

import { prisma } from "@/lib/prisma";

/**
 * Upsert a month-page entry (note only — months have no theme).
 * key = "month:<year>-<monthIndex>" or "day:YYYY-MM-DD".
 */
export async function saveMonthEntry(key: string, note: string) {
  await prisma.monthEntry.upsert({
    where: { key },
    create: { key, note },
    update: { note },
  });
}
