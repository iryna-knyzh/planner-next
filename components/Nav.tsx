"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/LanguageProvider";

export function Nav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const links = [
    { href: "/day", label: t.nav.day },
    { href: "/week", label: t.nav.week },
    { href: "/month", label: t.nav.month },
    { href: "/year", label: t.nav.year },
  ];

  return (
    <nav className="inline-flex rounded-2xl border border-gray-200 bg-white p-1 shadow-sm">
      {links.map(({ href, label }) => {
        // The index route ("/") renders the week view.
        const isActive =
          pathname === href || (href === "/week" && pathname === "/");

        return (
          <Link
            key={href}
            href={href}
            className={`px-5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              isActive ? "text-black" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
