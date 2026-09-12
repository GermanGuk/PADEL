import Link from "next/link";
import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth";
import { logout } from "./actions";

const NAV = [
  { href: "/admin", label: "Дашборд" },
  { href: "/admin/hero", label: "Первый экран" },
  { href: "/admin/games", label: "Игры и турниры" },
  { href: "/admin/training", label: "Тренировки" },
  { href: "/admin/gallery", label: "Галерея" },
  { href: "/admin/journal", label: "Журнал" },
  { href: "/admin/seo", label: "SEO" },
];

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col justify-between border-r border-line bg-surface p-5">
        <div>
          <p className="mb-6 text-sm font-bold text-ink">Top Padel · Админка</p>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-ink hover:bg-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <form action={logout}>
          <button type="submit" className="w-full rounded-lg px-3 py-2 text-left text-sm text-grey-1 hover:bg-white">
            Выйти
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-auto p-8">{children}</main>
    </div>
  );
}
