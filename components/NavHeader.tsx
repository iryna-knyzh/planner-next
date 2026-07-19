import { ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/LanguageProvider";

interface NavHeaderProps {
  title: string | number;
  onPrev: () => void;
  onNext: () => void;
}

const btnClass =
  "flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.2em] hover:opacity-50 transition-opacity duration-300";

export function NavHeader({ title, onPrev, onNext }: NavHeaderProps) {
  const { t } = useI18n();

  return (
    <div className="mb-5 flex flex-row justify-between">
      <h4 className="text-xl md:text-2xl font-light text-[#737373]">{title}</h4>
      <div className="flex items-center gap-3">
        <button onClick={onPrev} className={btnClass} aria-label={t.prev}>
          <ArrowLeft className="w-4 h-4 stroke-[1.5px]" />
          <span>{t.prev}</span>
        </button>
        <button onClick={onNext} className={btnClass} aria-label={t.next}>
          <span>{t.next}</span>
          <ArrowRight className="w-4 h-4 stroke-[1.5px]" />
        </button>
      </div>
    </div>
  );
}
