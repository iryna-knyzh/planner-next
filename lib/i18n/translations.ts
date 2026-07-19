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
  motto: string;
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
    motto: "Simplicity is the ultimate sophistication.",
    heroTitle:
      "Build a life system that works even in times of change.",
    heroSubtitle:
      "A tool for those who want to consciously design their future, build strong habits, and create a freer, more adaptive life.",
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
    motto: "Простота — высшая форма изысканности.",
    heroTitle:
      "Создай систему жизни, которая работает даже во времена перемен.",
    heroSubtitle:
      "Инструмент для тех, кто хочет осознанно спроектировать своё будущее, создать сильные привычки и построить более свободную и адаптивную жизнь.",
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
    motto: "Простота — це найвища витонченість.",
    heroTitle:
      "Створи систему життя, яка працює навіть у часи змін.",
    heroSubtitle:
      "Інструмент для тих, хто хоче свідомо спроєктувати своє майбутнє, створити сильні звички та побудувати більш вільне й адаптивне життя.",
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
