// Interface translations for the language switcher (EN / RU / UK).
// Weekday arrays are indexed by JS `Date.getDay()` — 0 = Sunday … 6 = Saturday.

export type Lang = "en" | "ru" | "uk";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uk", label: "UK" },
];

export const DEFAULT_LANG: Lang = "en";

export interface Dict {
  nav: { day: string; week: string; month: string; year: string };
  prev: string;
  next: string;
  theme: string;
  dayThemePlaceholder: string;
  weekThemePlaceholder: string;
  dayNotePlaceholder: string;
  weeklyNotes: string;
  weeklyNotesPlaceholder: string;
  monthNotes: string;
  monthNotesPlaceholder: string;
  addHabit: string;
  habitName: string;
  motto: string;
  /** Labels for the selection formatting toolbar (FormatBubbleMenu). */
  format: {
    bold: string;
    italic: string;
    underline: string;
    strike: string;
    highlight: string;
    clear: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  months: string[]; // 12, January → December
  weekdaysShort: string[]; // 7, getDay order (Sun → Sat)
  weekdaysMin: string[]; // 7, getDay order (Sun → Sat)
}

export const translations: Record<Lang, Dict> = {
  en: {
    nav: { day: "Day", week: "Week", month: "Month", year: "Year" },
    prev: "Prev",
    next: "Next",
    theme: "Theme:",
    dayThemePlaceholder: "Focus, intention, or goal for this day...",
    weekThemePlaceholder: "Focus, intention, or goal for this week...",
    dayNotePlaceholder: "Write anything... (paste or drop an image)",
    weeklyNotes: "Weekly Notes",
    weeklyNotesPlaceholder: "Type your thoughts, insights...",
    monthNotes: "Month Notes",
    monthNotesPlaceholder: "Notes...",
    addHabit: "Add habit",
    habitName: "habit",
    motto: "Simplicity is the ultimate sophistication.",
    format: {
      bold: "Bold",
      italic: "Italic",
      underline: "Underline",
      strike: "Strikethrough",
      highlight: "Highlight",
      clear: "Clear formatting",
    },
    heroTitle:
      "Plan your life. Build habits. Own your time.",
    heroSubtitle:
      "A minimalist calendar for planning your day, week, month, and year — without the extra noise.",
    months: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ],
    weekdaysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    weekdaysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  },
  ru: {
    nav: { day: "День", week: "Неделя", month: "Месяц", year: "Год" },
    prev: "Назад",
    next: "Вперёд",
    theme: "Тема:",
    dayThemePlaceholder: "Фокус, намерение или цель на этот день...",
    weekThemePlaceholder: "Фокус, намерение или цель на эту неделю...",
    dayNotePlaceholder: "Пишите что угодно... (вставьте или перетащите изображение)",
    weeklyNotes: "Заметки недели",
    weeklyNotesPlaceholder: "Запишите свои мысли, идеи...",
    monthNotes: "Заметки месяца",
    monthNotesPlaceholder: "Заметки...",
    addHabit: "Добавить привычку",
    habitName: "привычка",
    motto: "Простота — высшая форма изысканности.",
    format: {
      bold: "Жирный",
      italic: "Курсив",
      underline: "Подчёркнутый",
      strike: "Зачёркнутый",
      highlight: "Выделение",
      clear: "Убрать форматирование",
    },
    heroTitle:
      "Планируй жизнь. Формируй привычки. Управляй своим временем.",
    heroSubtitle:
      "Минималистичный календарь для планирования дня, недели, месяца и года — без лишнего шума.",
    months: [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
    ],
    weekdaysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    weekdaysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
  uk: {
    nav: { day: "День", week: "Тиждень", month: "Місяць", year: "Рік" },
    prev: "Назад",
    next: "Вперед",
    theme: "Тема:",
    dayThemePlaceholder: "Фокус, намір або ціль на цей день...",
    weekThemePlaceholder: "Фокус, намір або ціль на цей тиждень...",
    dayNotePlaceholder: "Пишіть будь-що... (вставте або перетягніть зображення)",
    weeklyNotes: "Нотатки тижня",
    weeklyNotesPlaceholder: "Запишіть свої думки, ідеї...",
    monthNotes: "Нотатки місяця",
    monthNotesPlaceholder: "Нотатки...",
    addHabit: "Додати звичку",
    habitName: "звичка",
    motto: "Простота — це найвища витонченість.",
    format: {
      bold: "Жирний",
      italic: "Курсив",
      underline: "Підкреслений",
      strike: "Закреслений",
      highlight: "Виділення",
      clear: "Прибрати форматування",
    },
    heroTitle:
      "Плануй життя. Будуй звички. Керуй своїм часом.",
    heroSubtitle:
      "Мінімалістичний календар для планування дня, тижня, місяця та року — без зайвого шуму.",
    months: [
      "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
      "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень",
    ],
    weekdaysShort: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    weekdaysMin: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
  },
};

// Localized "<month> <day>" heading for the day view. English reads
// "January 15"; Russian/Ukrainian read "15 января" / "15 січня".
export function formatDayTitle(lang: Lang, date: Date): string {
  const month = translations[lang].months[date.getMonth()];
  const day = date.getDate();
  return lang === "en" ? `${month} ${day}` : `${day} ${month.toLowerCase()}`;
}
