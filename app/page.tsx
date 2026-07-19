// The index route shows the hero banner above the week view. "/week" renders
// the same week view without the banner.
import { Hero } from "@/components/Hero";
import WeekPage from "./week/page";

export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <>
      <Hero />
    </>
  );
}
