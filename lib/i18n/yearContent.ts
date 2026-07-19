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
}

export interface YGroup {
  title?: string; // translation key
  hint?: string; // translation key
  cols: Cols;
  fields: YField[];
}

export interface YTab {
  id: string;
  label: string; // translation key for the tab button (and heading)
  eyebrow?: string; // literal English kicker (same across languages)
  subtitle?: string; // translation key
  groups: YGroup[];
}

const line = (key: string, label?: string): YField => ({ key, label, kind: "line" });
const area = (key: string, label?: string, rows = 2): YField => ({
  key,
  label,
  kind: "area",
  rows,
});
// Numbered list of unlabeled storage keys sharing a base.
const plain = (base: string, count: number, kind: "line" | "area" = "line"): YField[] =>
  Array.from({ length: count }, (_, i) => ({ key: `${base}.${i}`, kind }));

export const yearTabs: YTab[] = [
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
  {
    id: "lever",
    label: "tab.lever",
    subtitle: "tab.lever.sub",
    groups: [
      {
        cols: 1,
        fields: [area("lev.main", "lev.main", 3), area("lev.why", "lev.why", 2)],
      },
      {
        title: "g.impact.title",
        cols: 2,
        fields: [
          area("lev.finance", "lev.finance"),
          area("lev.freedom", "lev.freedom"),
          area("lev.family", "lev.family"),
          area("lev.security", "lev.security"),
          area("lev.future", "lev.future"),
        ],
      },
      { title: "g.example.title", hint: "lev.example", cols: 1, fields: [] },
    ],
  },
  {
    id: "system",
    label: "tab.system",
    subtitle: "tab.system.sub",
    groups: [
      {
        title: "g.future.title",
        hint: "sys.future.hint",
        cols: 2,
        fields: [
          area("sys.think", "sys.think"),
          area("sys.skills", "sys.skills", 3),
          area("sys.does", "sys.does", 3),
          area("sys.stops", "sys.stops"),
        ],
      },
      {
        title: "g.systems.title",
        cols: 2,
        fields: [
          line("sys.health.habit", "sys.health.habit"),
          line("sys.health.why", "sys.health.why"),
          line("sys.finance.habit", "sys.finance.habit"),
          line("sys.finance.why", "sys.finance.why"),
          line("sys.growth.habit", "sys.growth.habit"),
          line("sys.growth.why", "sys.growth.why"),
        ],
      },
      {
        title: "g.key5.title",
        hint: "sys.key5.hint",
        cols: 3,
        fields: plain("key5", 15, "line"),
      },
    ],
  },
  {
    id: "antifragile",
    label: "tab.antifragile",
    subtitle: "tab.antifragile.sub",
    groups: [
      {
        title: "g.control.title",
        cols: 2,
        fields: [
          area("af.notcontrol", "af.notcontrol", 3),
          area("af.control", "af.control", 3),
        ],
      },
      {
        title: "g.resilience.title",
        cols: 2,
        fields: [
          area("af.finance", "af.finance", 2),
          area("af.skills", "af.skills", 2),
          area("af.income", "af.income", 3),
        ],
      },
      {
        title: "g.wrong.title",
        cols: 2,
        fields: [area("af.wrong", "af.wrong", 2), area("af.adapt", "af.adapt", 3)],
      },
      {
        title: "g.principle.title",
        hint: "af.principle.hint",
        cols: 1,
        fields: [area("af.principle", undefined, 4)],
      },
    ],
  },
];

export const yearLabels: Record<Lang, Record<string, string>> = {
  ru: {
    "tab.vision": "Видение года",
    "tab.vision.sub": "Куда я хочу прийти? Какую жизнь я хочу создать?",
    "tab.lever": "Рычаг перемен",
    "tab.lever.sub": "Какое одно изменение создаст наибольшее влияние?",
    "tab.system": "Система года",
    "tab.system.sub": "Каким человеком мне нужно стать, чтобы это стало реальностью?",
    "tab.antifragile": "Антихрупкость",
    "tab.antifragile.sub": "Как построить жизнь, которая выдерживает перемены?",

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

    "lev.main": "Мой главный рычаг перемен:",
    "lev.why": "Почему именно это?",
    "g.impact.title": "Как это изменит мою жизнь?",
    "lev.finance": "Финансы",
    "lev.freedom": "Свобода",
    "lev.family": "Семья",
    "lev.security": "Безопасность",
    "lev.future": "Будущие возможности",
    "g.example.title": "Пример:",
    "lev.example": "Мой рычаг перемен: научиться зарабатывать онлайн $2000+ и создать независимый источник дохода.",

    "g.future.title": "Моя будущая версия",
    "sys.future.hint": "Человек, у которого есть желаемый результат:",
    "sys.think": "Она думает:",
    "sys.skills": "Какими навыками она обладает?",
    "sys.does": "Она делает регулярно:",
    "sys.stops": "Она больше не делает:",
    "g.systems.title": "Мои системы и привычки",
    "sys.health.habit": "Здоровье · Привычка",
    "sys.health.why": "Здоровье · Зачем",
    "sys.finance.habit": "Финансы / Карьера · Привычка",
    "sys.finance.why": "Финансы / Карьера · Зачем",
    "sys.growth.habit": "Развитие · Привычка",
    "sys.growth.why": "Развитие · Зачем",
    "g.key5.title": "Мои 5 ключевых привычек года",
    "sys.key5.hint": "Привычка · Когда/как · Зачем",

    "g.control.title": "Моя зона контроля",
    "af.notcontrol": "Я не могу контролировать:",
    "af.control": "Я могу контролировать:",
    "g.resilience.title": "Мой запас прочности",
    "af.finance": "Финансы — Что даст мне больше свободы?",
    "af.skills": "Навыки — Что останется со мной в любой стране?",
    "af.income": "Доходы — Какие источники дохода я хочу создать?",
    "g.wrong.title": "Если всё пойдёт не по плану",
    "af.wrong": "Что может случиться?",
    "af.adapt": "Как я адаптируюсь?",
    "g.principle.title": "Мой принцип года",
    "af.principle.hint": "Какую мысль я хочу помнить весь год?",
  },

  en: {
    "tab.vision": "Year Vision",
    "tab.vision.sub": "Where do I want to arrive? What life do I want to create?",
    "tab.lever": "Lever of Change",
    "tab.lever.sub": "Which single change will create the biggest impact?",
    "tab.system": "Year System",
    "tab.system.sub": "Who do I need to become for this to become reality?",
    "tab.antifragile": "Antifragile Life",
    "tab.antifragile.sub": "How do I build a life that withstands change?",

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

    "lev.main": "My main lever of change:",
    "lev.why": "Why this one?",
    "g.impact.title": "How will it change my life?",
    "lev.finance": "Finances",
    "lev.freedom": "Freedom",
    "lev.family": "Family",
    "lev.security": "Security",
    "lev.future": "Future opportunities",
    "g.example.title": "Example:",
    "lev.example": "My lever of change: learn to earn $2000+ online and build an independent income source.",

    "g.future.title": "My future self",
    "sys.future.hint": "The person who already has the desired result:",
    "sys.think": "She thinks:",
    "sys.skills": "What skills does she have?",
    "sys.does": "She does regularly:",
    "sys.stops": "She no longer does:",
    "g.systems.title": "My systems and habits",
    "sys.health.habit": "Health · Habit",
    "sys.health.why": "Health · Why",
    "sys.finance.habit": "Finances / Career · Habit",
    "sys.finance.why": "Finances / Career · Why",
    "sys.growth.habit": "Growth · Habit",
    "sys.growth.why": "Growth · Why",
    "g.key5.title": "My 5 key habits of the year",
    "sys.key5.hint": "Habit · When/how · Why",

    "g.control.title": "My zone of control",
    "af.notcontrol": "I can't control:",
    "af.control": "I can control:",
    "g.resilience.title": "My margin of safety",
    "af.finance": "Finances — What will give me more freedom?",
    "af.skills": "Skills — What stays with me in any country?",
    "af.income": "Income — Which income sources do I want to create?",
    "g.wrong.title": "If things go off plan",
    "af.wrong": "What could happen?",
    "af.adapt": "How do I adapt?",
    "g.principle.title": "My principle of the year",
    "af.principle.hint": "What thought do I want to remember all year?",
  },

  uk: {
    "tab.vision": "Бачення року",
    "tab.vision.sub": "Куди я хочу прийти? Яке життя я хочу створити?",
    "tab.lever": "Важіль змін",
    "tab.lever.sub": "Яка одна зміна створить найбільший вплив?",
    "tab.system": "Система року",
    "tab.system.sub": "Якою людиною мені потрібно стати, щоб це стало реальністю?",
    "tab.antifragile": "Антикрихкість",
    "tab.antifragile.sub": "Як побудувати життя, яке витримує зміни?",

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

    "lev.main": "Мій головний важіль змін:",
    "lev.why": "Чому саме це?",
    "g.impact.title": "Як це змінить моє життя?",
    "lev.finance": "Фінанси",
    "lev.freedom": "Свобода",
    "lev.family": "Сім'я",
    "lev.security": "Безпека",
    "lev.future": "Майбутні можливості",
    "g.example.title": "Приклад:",
    "lev.example": "Мій важіль змін: навчитися заробляти онлайн $2000+ та створити незалежне джерело доходу.",

    "g.future.title": "Моя майбутня версія",
    "sys.future.hint": "Людина, яка має бажаний результат:",
    "sys.think": "Вона думає:",
    "sys.skills": "Вона має які навички?",
    "sys.does": "Вона робить регулярно:",
    "sys.stops": "Вона більше не робить:",
    "g.systems.title": "Мої системи та звички",
    "sys.health.habit": "Здоров'я · Звичка",
    "sys.health.why": "Здоров'я · Навіщо",
    "sys.finance.habit": "Фінанси / Кар'єра · Звичка",
    "sys.finance.why": "Фінанси / Кар'єра · Навіщо",
    "sys.growth.habit": "Розвиток · Звичка",
    "sys.growth.why": "Розвиток · Навіщо",
    "g.key5.title": "Мої 5 ключових звичок року",
    "sys.key5.hint": "Звичка · Коли/як · Навіщо",

    "g.control.title": "Моя зона контролю",
    "af.notcontrol": "Я не можу контролювати:",
    "af.control": "Я можу контролювати:",
    "g.resilience.title": "Мій запас міцності",
    "af.finance": "Фінанси — Що дасть мені більше свободи?",
    "af.skills": "Навички — Що залишиться зі мною у будь-якій країні?",
    "af.income": "Доходи — Які джерела доходу я хочу створити?",
    "g.wrong.title": "Якщо все піде не за планом",
    "af.wrong": "Що може статися?",
    "af.adapt": "Як я адаптуюся?",
    "g.principle.title": "Мій принцип року",
    "af.principle.hint": "Яку думку я хочу пам'ятати весь рік?",
  },
};
