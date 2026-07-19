"use client";

import { useI18n } from "@/lib/i18n/LanguageProvider";

export function Motto() {
  const { t } = useI18n();

  return (
    <p className="text-sm font-light text-[#737373] max-w-md">
      &quot;{t.motto}&quot;
    </p>
  );
}
