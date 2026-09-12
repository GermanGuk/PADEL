import Image from "next/image";
import { getHeroCardsForAdmin } from "@/lib/data/hero-cards";
import { createHeroCardAction, deleteHeroCardAction, updateHeroCardAction } from "./actions";

export default async function HeroAdminPage() {
  const cards = await getHeroCardsForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-ink">Первый экран</h1>
        <p className="mt-1 max-w-lg text-sm text-grey-1">
          Карточки на самом верху сайта (Турниры, Тренировки, Ближайшая игра, Найти партнёра, Новости,
          Галерея). Здесь можно поменять фото и текст на них.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {cards.map((card) => (
          <form
            key={card.id}
            action={updateHeroCardAction}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-start"
          >
            <input type="hidden" name="id" value={card.id} />
            <input type="hidden" name="existing_image" value={card.image} />
            <input type="hidden" name="existing_href" value={card.href} />

            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-40">
              <Image src={card.image} alt="" fill className="object-cover" unoptimized={card.image.startsWith("http")} />
            </div>

            <div className="flex flex-1 flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex flex-col gap-1 text-xs text-grey-1">
                  Тег (маленькая подпись сверху)
                  <input name="tag" defaultValue={card.tag} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                </label>
                <label className="flex flex-col gap-1 text-xs text-grey-1">
                  Заголовок
                  <input name="title" defaultValue={card.title} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                </label>
              </div>

              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Доп. текст (например, время игры — необязательно)
                <input name="meta" defaultValue={card.meta ?? ""} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>

              <div className="flex flex-wrap items-center gap-4">
                <label className="text-xs text-grey-1">
                  Новое фото: <input type="file" name="file" accept="image/*" />
                </label>
                <label className="flex flex-col gap-1 text-xs text-grey-1">
                  Порядок
                  <input name="sort_order" type="number" defaultValue={card.sortOrder} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
                </label>
                <label className="flex items-center gap-2 text-xs text-grey-1">
                  <input type="checkbox" name="featured" defaultChecked={card.featured} />
                  Крупная карточка
                </label>
              </div>

              <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
                Сохранить
              </button>
            </div>
          </form>
        ))}
      </div>

      {cards.map((card) => (
        <form key={`del-${card.id}`} action={deleteHeroCardAction} className="-mt-4 flex justify-end">
          <input type="hidden" name="id" value={card.id} />
          <button type="submit" className="text-xs font-medium text-red-600">
            Удалить «{card.title}»
          </button>
        </form>
      ))}

      <details className="rounded-2xl border border-dashed border-line p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">+ Добавить карточку</summary>
        <form action={createHeroCardAction} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Тег (маленькая подпись сверху)
              <input name="tag" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Заголовок
              <input name="title" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Доп. текст (необязательно)
            <input name="meta" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Ссылка при клике (например #games, #training, #gallery)
            <input name="href" defaultValue="#top" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <input name="sort_order" type="number" defaultValue={cards.length} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
          <label className="text-xs text-grey-1">
            Фото: <input type="file" name="file" accept="image/*" required />
          </label>
          <label className="flex w-fit items-center gap-2 text-xs text-grey-1">
            <input type="checkbox" name="featured" />
            Крупная карточка
          </label>
          <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
            Добавить
          </button>
        </form>
      </details>
    </div>
  );
}
