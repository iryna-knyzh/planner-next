// The index route renders the week view. Re-export its component, and declare
// the route segment config directly so "/" is server-rendered with fresh data.
export { default } from "./week/page";

export const dynamic = "force-dynamic";
