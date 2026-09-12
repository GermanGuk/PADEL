import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Top Padel Alicante",
  description: "Политика конфиденциальности сайта Top Padel Alicante.",
};

export default async function PrivacyPage() {
  const settings = await getSettings();

  return (
    <>
      <Header telegramUrl={settings.telegramUrl ?? undefined} />
      <main className="flex-1">
        <article className="container-page section-pad flex flex-col gap-6">
          <h1 className="h2-fluid font-extrabold text-ink">Политика конфиденциальности</h1>
          <p className="text-sm text-grey-1">Дата последнего обновления: 12 сентября 2026 г.</p>

          <div className="flex max-w-[720px] flex-col gap-5 text-base leading-[1.7] text-grey-1">
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">1. Общие положения</h2>
              <p>
                Настоящая политика конфиденциальности определяет порядок обработки и защиты
                персональных данных пользователей сайта Top Padel Alicante (далее — «сайт»).
                Используя сайт, вы соглашаетесь с условиями настоящей политики. Обработка
                персональных данных осуществляется в соответствии с законодательством Украины.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">2. Какие данные мы собираем</h2>
              <p>
                Мы можем собирать данные, которые вы предоставляете добровольно при обращении к
                нам через Telegram, WhatsApp, Instagram или иные каналы связи, указанные на сайте:
                имя, контактные данные, содержание сообщения. Также сайт может автоматически
                собирать технические данные — тип устройства и браузера, IP-адрес, данные о
                посещённых страницах.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">3. Цели обработки данных</h2>
              <p>
                Полученные данные используются для того, чтобы связаться с вами, организовать
                участие в играх и тренировках, ответить на вопросы и улучшать работу сайта. Мы не
                используем ваши данные для целей, не связанных с работой сайта и сообщества Top
                Padel Alicante.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">4. Передача данных третьим лицам</h2>
              <p>
                Мы не продаём и не передаём ваши персональные данные третьим лицам, за исключением
                случаев, предусмотренных законодательством, либо для обеспечения технической
                работы сайта (например, поставщики хостинга и инфраструктуры).
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">5. Хранение и защита данных</h2>
              <p>
                Мы принимаем разумные технические и организационные меры для защиты ваших данных
                от несанкционированного доступа, изменения, раскрытия или уничтожения. Данные
                хранятся не дольше, чем это необходимо для целей, указанных в настоящей политике.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">6. Ваши права</h2>
              <p>
                Вы вправе запросить информацию о том, какие данные о вас хранятся, потребовать их
                исправления или удаления. Для этого свяжитесь с нами через любой из контактов,
                указанных в подвале сайта.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-bold text-ink">7. Изменения политики</h2>
              <p>
                Мы можем время от времени обновлять настоящую политику. Актуальная версия всегда
                доступна на этой странице.
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
