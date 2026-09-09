"use client";

import { useI18n } from "@/lib/i18n/LanguageProvider";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
      {/*
        No image yet. When ready, drop one in behind the text, e.g.:
          <img src="/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      */}
      <div className="relative w-full px-6 py-14 md:px-14 md:py-24">
        <h2 className="text-3xl font-bold leading-[1.1] tracking-tight md:text-3xl">
          {t.heroTitle}
        </h2>
        <p className="mt-4 text-base font-light leading-relaxed text-[#525252] md:text-lg">
          {t.heroSubtitle}
        </p>
      </div>
    </section>
  );
}
