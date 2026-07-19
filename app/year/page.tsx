import { prisma } from "@/lib/prisma";
import type { Entry } from "@/hooks/usePlannerStore";
import { YearView } from "./_components/YearView";

// Always read the latest notes from the database on each request.
export const dynamic = "force-dynamic";

export default async function Page() {
  const rows = await prisma.yearEntry.findMany();
  const initialEntries: Record<string, Entry> = {};
  for (const row of rows) {
    initialEntries[row.key] = { note: row.note, theme: "" };
  }

  return <YearView initialEntries={initialEntries} />;
}
