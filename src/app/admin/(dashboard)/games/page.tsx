import { getGamesForAdmin } from "@/lib/data/games";
import { createGame, deleteGame, updateGame } from "./actions";

function MetaInputs({ meta }: { meta: { icon: string; text: string }[] }) {
  const byIcon = Object.fromEntries(meta.map((m) => [m.icon, m.text]));
  const fields: { key: string; label: string }[] = [
    { key: "players", label: "Игроки" },
    { key: "courts", label: "Корты" },
    { key: "clock", label: "Время" },
    { key: "location", label: "Место" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {fields.map((f) => (
        <label key={f.key} className="flex flex-col gap-1 text-xs text-grey-1">
          {f.label}
          <input name={f.key} defaultValue={byIcon[f.key] ?? ""} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
        </label>
      ))}
    </div>
  );
}

export default async function GamesAdminPage() {
  const games = await getGamesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold text-ink">Игры и мероприятия</h1>

      <div className="flex flex-col gap-4">
        {games.map((game) => (
          <form
            key={game.id}
            action={updateGame}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
          >
            <input type="hidden" name="id" value={game.id} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Бейдж (дата)
                <input name="badge" defaultValue={game.badge} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Название
                <input name="title" defaultValue={game.title} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
            </div>

            <MetaInputs meta={game.meta} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Доп. текст
                <input name="extra" defaultValue={game.extra ?? ""} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Цена
                <input name="price" defaultValue={game.price ?? ""} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Порядок
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={game.sort_order}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-sm"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Фото (URL, для featured-карточки)
              <input name="image" defaultValue={game.image ?? ""} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>

            <label className="flex w-fit items-center gap-2 text-xs text-grey-1">
              <input type="checkbox" name="featured" defaultChecked={game.featured} />
              Главная (featured) карточка
            </label>

            <div className="flex items-center gap-3">
              <button type="submit" className="rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
                Сохранить
              </button>
            </div>
          </form>
        ))}
      </div>

      {games.map((game) => (
        <form key={`del-${game.id}`} action={deleteGame} className="-mt-4 flex justify-end">
          <input type="hidden" name="id" value={game.id} />
          <button type="submit" className="text-xs font-medium text-red-600">
            Удалить «{game.title}»
          </button>
        </form>
      ))}

      <details className="rounded-2xl border border-dashed border-line p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">+ Добавить игру</summary>
        <form action={createGame} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Бейдж (дата)
              <input name="badge" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Название
              <input name="title" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
          </div>
          <MetaInputs meta={[]} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Доп. текст
              <input name="extra" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Цена
              <input name="price" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Порядок
              <input name="sort_order" type="number" defaultValue={games.length} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Фото (URL, для featured-карточки)
            <input name="image" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <label className="flex w-fit items-center gap-2 text-xs text-grey-1">
            <input type="checkbox" name="featured" />
            Главная (featured) карточка
          </label>
          <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
            Добавить
          </button>
        </form>
      </details>
    </div>
  );
}
