// Central content model for the whole site.
// Hardcoded for now; shaped so it can later be swapped for Supabase queries
// (each exported const can become an async fetch without changing component props).

export type NavLink = { label: string; href: string };

// Absolute ("/#id") rather than bare ("#id") anchors — these render in the
// Header/Footer on every page (journal articles, privacy, cookies), not
// just the homepage where the target sections actually live.
export const navLinks: NavLink[] = [
  { label: "Ближайшие игры", href: "/#games" },
  { label: "Турниры", href: "/#games" },
  { label: "Тренировки", href: "/#training" },
  { label: "О нас", href: "/#community" },
  { label: "Контакты", href: "/#footer" },
];

export type HeroCard = {
  tag: string;
  title: string;
  image: string;
  href: string;
  featured?: boolean;
  meta?: string;
};

export const heroCards: HeroCard[] = [
  { tag: "ТУРНИРЫ", title: "Турниры", image: "/images/hero/card-tournaments.png", href: "#games" },
  { tag: "ТРЕНИРОВКИ", title: "Тренировки", image: "/images/hero/card-training.png", href: "#training" },
  {
    tag: "БЛИЖАЙШАЯ ИГРА",
    title: "Mexicano El Salt",
    meta: "Среда · 19:30 – 21:30",
    image: "/images/hero/card-next-game.png",
    href: "#games",
    featured: true,
  },
  { tag: "НАЙТИ ПАРТНЁРА", title: "Найти партнёра", image: "/images/hero/card-find-partner.png", href: "#community" },
  { tag: "НОВОСТИ", title: "Новости", image: "/images/hero/card-news.png", href: "#journal" },
  { tag: "ГАЛЕРЕЯ", title: "Галерея", image: "/images/hero/card-gallery.png", href: "#gallery" },
];

export type GameCardMeta = { icon: "players" | "courts" | "clock" | "location"; text: string };

export type GameCard = {
  featured?: boolean;
  badge: string;
  title: string;
  meta: GameCardMeta[];
  extra?: string;
  price?: string;
  image?: string;
};

export const gameCards: GameCard[] = [
  {
    featured: true,
    badge: "19 сентября · Суббота",
    title: "Mexicano El Salt",
    meta: [
      { icon: "players", text: "20 игроков" },
      { icon: "courts", text: "4 корта" },
      { icon: "clock", text: "19:30–21:30" },
      { icon: "location", text: "El Salt" },
    ],
    price: "15 €",
    image: "/images/games/featured.png",
  },
  {
    badge: "22 сентября · Вторник",
    title: "Americano Teams-",
    meta: [
      { icon: "players", text: "6 пар" },
      { icon: "courts", text: "3 корта" },
      { icon: "clock", text: "19:00–22:00" },
      { icon: "location", text: "El Salt" },
    ],
  },
  {
    badge: "25 сентября · Пятница",
    title: "Americano 1100+",
    meta: [
      { icon: "players", text: "6 пар" },
      { icon: "courts", text: "3 корта" },
      { icon: "clock", text: "19:00–22:00" },
      { icon: "location", text: "El Salt" },
    ],
    price: "18 €",
  },
  {
    badge: "30 сентября · Среда",
    title: "Микст Ж+М",
    meta: [
      { icon: "players", text: "8 пар" },
      { icon: "courts", text: "4 корта" },
      { icon: "clock", text: "20:00–22:00" },
      { icon: "location", text: "Essence Padel Club" },
    ],
    price: "15 €",
  },
];

export type PricingRow = { label: string; oldPrice: string; newPrice: string };

export type PricingPlan = {
  dark?: boolean;
  number: string;
  title: string;
  description: string;
  price: string;
  rows: PricingRow[];
  icon: "solo" | "group";
};

export const pricingPlans: PricingPlan[] = [
  {
    number: "01.",
    title: "Индивидуальные тренировки",
    description: "Персональная работа с тренером только над твоей игрой.",
    price: "30 €",
    icon: "solo",
    rows: [
      { label: "4 тренировки", oldPrice: "120 €", newPrice: "100 €" },
      { label: "8 тренировок", oldPrice: "240 €", newPrice: "180 €" },
    ],
  },
  {
    dark: true,
    number: "02.",
    title: "Групповая тренировка",
    description: "Тренируйся в команде с игроками своего уровня.",
    price: "40 €",
    icon: "group",
    rows: [
      { label: "4 тренировки", oldPrice: "160 €", newPrice: "140 €" },
      { label: "8 тренировки", oldPrice: "320 €", newPrice: "260 €" },
    ],
  },
];

export const galleryImages: string[] = [
  "/images/gallery/1.png",
  "/images/gallery/2.png",
  "/images/gallery/3.png",
  "/images/gallery/4.png",
  "/images/gallery/5.png",
  "/images/gallery/6.png",
  "/images/gallery/7.png",
  "/images/gallery/8.png",
];

export type Tab = { label: string; active?: boolean; href?: string };

export const galleryTabs: string[] = ["Все", "Тренировки", "Турниры", "Top Padel Academy"];

// Which gallery photo indices belong to each filter tab (index into galleryImages).
// "Все" isn't listed here — it always shows every photo.
export const galleryTabIndices: Record<string, number[]> = {
  "Тренировки": [1, 3, 6],
  "Турниры": [0, 4, 7],
  "Top Padel Academy": [2, 5, 7],
};

export const journalTabs: Tab[] = [
  { label: "Все", active: true },
  { label: "Советы" },
  { label: "Тренировки", href: "#training" },
  { label: "Турниры", href: "#games" },
];

export type Article = {
  number: string;
  tag: string;
  title: string;
  image: string;
};

export const articles: Article[] = [
  { number: "01", tag: "СОВЕТЫ", title: "Как подобрать правильную ракетку для падела", image: "/images/journal/article-1.png" },
  { number: "02", tag: "СОВЕТЫ", title: "Где поиграть в падел в Аликанте: площадки и клубы", image: "/images/journal/article-2.png" },
];

export const communityStats: string[] = [
  "100+ игроков",
  "Анонсы турниров",
  "Поиск напарников",
  "Общение",
  "Аликанте",
];

export const communityBubbles = [
  { text: "Ищу +1 сегодня на 19:00", avatar: "/images/community/avatar-1.png" },
  { text: "Кто сыграет завтра утром?", avatar: "/images/community/avatar-2.png" },
  { text: "Нужна пара на Americano", avatar: "/images/community/avatar-3.png" },
];

export const footerNav = [
  { label: "Турниры", href: "/#games" },
  { label: "Тренировки", href: "/#training" },
  { label: "Найти партнёра", href: "/#community" },
  { label: "Новости", href: "/#journal" },
  { label: "Галерея", href: "/#gallery" },
];

export const footerContacts = [
  { icon: "location", label: "Аликанте, Испания" },
  { icon: "instagram", label: "Instagram" },
  { icon: "telegram", label: "Telegram" },
  { icon: "whatsapp", label: "WhatsApp" },
];

export const siteLinks = {
  telegram: "#",
  instagram: "#",
  whatsapp: "#",
};

// Editable copy blocks. Falls back to these values until Supabase is wired
// in (see src/lib/data/site-texts.ts) or if a key hasn't been set yet.
export const siteTexts = {
  "hero.title.line1": "Падел объединяет людей",
  "hero.title.line2": "и превращает обычную игру",
  "hero.title.line3": "в часть твоей жизни",
  "hero.subtitle.left": "Тренировки для любого уровня.\nУчись, играй и становись сильнее.",
  "hero.subtitle.right": "Турниры и игровые встречи\nкаждую неделю в Аликанте.",
  "training.heading.line1": "Играй лучше.",
  "training.heading.line2": "Получай больше",
  "training.heading.line2Highlight": "удовольствие",
  "training.description": "Подбираем тренировки под твой уровень\nи цели. Индивидуально или в группе.",
  "community.heading": "Ищешь напарника?",
  "community.headingHighlight": "Найдём.",
  "community.description":
    "В Telegram каждый день ищут игроков, собирают пары, договариваются об играх и турнирах.",
} as const;

export type SiteTextKey = keyof typeof siteTexts;
export type SiteTexts = Record<SiteTextKey, string>;
