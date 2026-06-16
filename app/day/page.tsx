import { prisma } from "@/lib/prisma";
import type { Entry } from "@/hooks/usePlannerStore";
import { DayView } from "./_components/DayView";

// Always read the latest notes from the database on each request.
export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await prisma.dayEntry.findMany();
  const initialEntries: Record<string, Entry> = {};
  for (const row of rows) {
    initialEntries[row.key] = { note: row.note, theme: row.theme };
  }

  return <DayView initialEntries={initialEntries} />;
}
