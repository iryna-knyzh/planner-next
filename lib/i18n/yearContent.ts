// Year planning sheet: language-independent structure + per-language labels.
//
// The STRUCTURE (tabs → groups → fields) is defined once. Every user-visible
// string is a translation KEY resolved through `yearLabels[lang]`, while each
// field's storage `key` is language-independent so switching language keeps the
// entered data. Store keys become "year:<year>:<field.key>".

import type { Lang } from "./translations";

export type Cols = 1 | 2 | 3;

export interface YField {
  key: string; // storage key suffix (language-independent)
  label?: string; // translation key for the field label (optional)
  kind: "line" | "area";
  rows?: number; // textarea rows when kind === "area"
  placeholder?: string; // translation key for the input placeholder (optional)
}

export interface YGroup {
  title?: string; // translation key
  hint?: string; // translation key
  cols: Cols;
  fields: YField[];
  numbered?: boolean; // prefix each field with its position in the group
}

export interface YTab {
  id: string;
  label: string; // translation key for the tab button (and heading)
  eyebrow?: string; // literal English kicker (same across languages)
  subtitle?: string; // translation key
  // How the tab body renders: form groups (default), one rich-text note like
  // the Day page, or the 12-month table with a note under every month.
  kind?: "groups" | "note" | "months";
  groups: YGroup[];
}

const line = (key: string, label?: string, placeholder?: string): YField => ({
  key,
  label,
  kind: "line",
  placeholder,
});
const area = (key: string, label?: string, rows = 2): YField => ({
  key,
  label,
  kind: "area",
  rows,
});
// A numbered list of unlabeled storage keys sharing a base.
const numbered = (base: string, count: number): YField[] =>
  Array.from({ length: count }, (_, i) => line(`${base}.${i}`));

export const yearTabs: YTab[] = [
  {
    id: "description",
    label: "tab.description",
    subtitle: "tab.description.sub",
    kind: "note",
    groups: [],
  },
  {
    id: "months",
    label: "tab.months",
    subtitle: "tab.months.sub",
    kind: "months",
    groups: [],
  },
  {
    id: "wishes",
    label: "tab.wishes",
    subtitle: "tab.wishes.sub",
    groups: [{ cols: 2, numbered: true, fields: numbered("wish", 50) }],
  },
  {
    id: "vision",
    label: "tab.vision",
    subtitle: "tab.vision.sub",
    groups: [
      {
        title: "g.ideal.title",
        cols: 1,
        fields: [area("v.ideal", "v.ideal", 4)],
      },
      {
        title: "g.10.title",
        cols: 2,
        fields: [
          area("v.10.live", "v.10.live"),
          area("v.10.do", "v.10.do"),
          area("v.10.earn", "v.10.earn"),
          area("v.10.freedom", "v.10.freedom"),
        ],
      },
      {
        title: "g.5.title",
        cols: 2,
        fields: [
          area("v.5.person", "v.5.person", 3),
          area("v.5.created", "v.5.created", 3),
        ],
      },
      { title: "g.1.title", cols: 1, fields: [area("v.1.change", "v.1.change", 3)] },
    ],
  },
];

// Season of each month (0 = January) → emoji + palette for the months table.
export type Season = "winter" | "spring" | "summer" | "autumn";

export const MONTH_SEASONS: Season[] = [
  "winter", "winter",
  "spring", "spring", "spring",
  "summer", "summer", "summer",
  "autumn", "autumn", "autumn",
  "winter",
];

export const SEASON_EMOJI: Record<Season, string> = {
  winter: "❄️",
  spring: "🌱",
  summer: "☀️",
  autumn: "🍁",
};

// Month names shown side by side in every row, in the order of the reference
// sheet (ru · en · uk) regardless of the UI language.
export const MONTH_NAMES: Record<Lang, string[]> = {
  ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
};

export const yearLabels: Record<Lang, Record<string, string>> = {
  ru: {
    "tab.description": "Описание года",
    "tab.description.sub": "Каким будет этот год? Опиши его своими словами.",
    "desc.placeholder": "Начни писать...",
    "tab.months": "Описание по месяцам",
    "tab.months.sub": "Что я хочу прожить и сделать в каждом месяце?",
    "month.placeholder": "Планы, события, настроение месяца...",
    "tab.wishes": "Желания",
    "tab.wishes.sub": "50 желаний на этот год — большие и маленькие.",
    "tab.vision": "Глобальное видение",
    "tab.vision.sub": "Куда я хочу прийти? Какую жизнь я хочу создать?",

    "g.ideal.title": "Моя идеальная жизнь",
    "v.ideal": "Как выглядит моя жизнь, если всё складывается наилучшим образом?",
    "g.10.title": "Моё видение через 10 лет",
    "v.10.live": "Я живу...",
    "v.10.do": "Я занимаюсь...",
    "v.10.earn": "Мой способ заработка...",
    "v.10.freedom": "Моя свобода выглядит так...",
    "g.5.title": "Через 5 лет я...",
    "v.5.person": "Какой я человек?",
    "v.5.created": "Что я создала?",
    "g.1.title": "Через 1 год я хочу...",
    "v.1.change": "Что должно измениться?",
  },

  en: {
    "tab.description": "Year Description",
    "tab.description.sub": "What will this year be like? Describe it in your own words.",
    "desc.placeholder": "Start writing...",
    "tab.months": "Months",
    "tab.months.sub": "What do I want to live and do each month?",
    "month.placeholder": "Plans, events, the mood of the month...",
    "tab.wishes": "Wishes",
    "tab.wishes.sub": "50 wishes for this year — big and small.",
    "tab.vision": "Global Vision",
    "tab.vision.sub": "Where do I want to arrive? What life do I want to create?",

    "g.ideal.title": "My ideal life",
    "v.ideal": "What does my life look like if everything works out for the best?",
    "g.10.title": "My vision in 10 years",
    "v.10.live": "I live...",
    "v.10.do": "I do...",
    "v.10.earn": "My way of earning...",
    "v.10.freedom": "My freedom looks like...",
    "g.5.title": "In 5 years I...",
    "v.5.person": "What kind of person am I?",
    "v.5.created": "What have I created?",
    "g.1.title": "In 1 year I want...",
    "v.1.change": "What needs to change?",
  },

  uk: {
    "tab.description": "Опис року",
    "tab.description.sub": "Яким буде цей рік? Опиши його своїми словами.",
    "desc.placeholder": "Почни писати...",
    "tab.months": "Опис по місяцях",
    "tab.months.sub": "Що я хочу прожити й зробити кожного місяця?",
    "month.placeholder": "Плани, події, настрій місяця...",
    "tab.wishes": "Бажання",
    "tab.wishes.sub": "50 бажань на цей рік — великих і маленьких.",
    "tab.vision": "Глобальне бачення",
    "tab.vision.sub": "Куди я хочу прийти? Яке життя я хочу створити?",

    "g.ideal.title": "Моє ідеальне життя",
    "v.ideal": "Як виглядає моє життя, якщо все складається найкращим чином?",
    "g.10.title": "Моє бачення через 10 років",
    "v.10.live": "Я живу...",
    "v.10.do": "Я займаюсь...",
    "v.10.earn": "Мій спосіб заробітку...",
    "v.10.freedom": "Моя свобода виглядає так...",
    "g.5.title": "Через 5 років я...",
    "v.5.person": "Яка я людина?",
    "v.5.created": "Що я створила?",
    "g.1.title": "Через 1 рік я хочу...",
    "v.1.change": "Що має змінитися?",
  },
};
