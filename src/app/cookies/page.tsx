import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Политика Cookies — Top Padel Alicante",
  description: "Как сайт Top Padel Alicante использует файлы cookie.",
};

export default async function CookiesPage() {
  const settings = await getSettings();

  return (
    <>
      <Header telegramUrl={settings.telegramUrl ?? undefined} />
      <main className="flex-1">
        <article className="container-page section-pad flex flex-col gap-6">
          <h1 className="h2-fluid font-extrabold text-ink">Политика использования Cookies</h1>
          <p className="text-sm text-grey-1">Дата последнего обновления: 12 сентября 2026 г.</p>

          <div className="flex max-w-[720px] flex-col gap-5 text-base leading-[1.7] text-grey-1">
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">1. Что такое cookies</h2>
              <p>
                Cookies — это небольшие текстовые файлы, которые сохраняются в вашем браузере при
                посещении сайта. Они помогают сайту корректно работать и запоминать некоторые
                настройки между визитами.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">2. Какие cookies использует сайт</h2>
              <p>
                Сайт Top Padel Alicante использует только технические (необходимые) cookies,
                которые обеспечивают базовую работу страниц. На данный момент сайт не использует
                рекламные cookies или cookies сторонних сервисов аналитики.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">3. Как отключить cookies</h2>
              <p>
                Вы можете ограничить или отключить сохранение cookies в настройках своего браузера.
                Обратите внимание, что отключение технических cookies может повлиять на
                корректность работы некоторых функций сайта.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">4. Согласие</h2>
              <p>
                Продолжая использовать сайт, вы соглашаетесь с использованием cookies в порядке,
                описанном в настоящей политике. Обработка данных осуществляется в соответствии с
                законодательством Украины.
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer
        telegramUrl={settings.telegramUrl ?? undefined}
        instagramUrl={settings.instagramUrl ?? undefined}
        whatsappUrl={settings.whatsappUrl ?? undefined}
      />
    </>
  );
}
