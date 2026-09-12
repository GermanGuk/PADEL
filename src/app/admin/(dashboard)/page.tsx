import Link from "next/link";

const CARDS = [
  { href: "/admin/hero", label: "Первый экран", desc: "Карточки на самом верху сайта" },
  { href: "/admin/games", label: "Игры и турниры", desc: "Расписание ближайших игр и турниров" },
  { href: "/admin/training", label: "Тренировки", desc: "Тарифы и пакеты тренировок" },
  { href: "/admin/gallery", label: "Галерея", desc: "Фото на сайте по категориям" },
  { href: "/admin/journal", label: "Журнал", desc: "Статьи блога и их категории" },
  { href: "/admin/seo", label: "SEO", desc: "Заголовок, описание и favicon сайта" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-ink">Дашборд</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-5 hover:border-lime"
          >
            <span className="font-bold text-ink">{card.label}</span>
            <span className="text-sm text-grey-1">{card.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
