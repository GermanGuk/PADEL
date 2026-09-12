import Image from "next/image";
import { getArticlesForAdmin } from "@/lib/data/articles";
import { createArticle, deleteArticle, updateArticle } from "./actions";

export default async function JournalAdminPage() {
  const articles = await getArticlesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold text-ink">Журнал</h1>

      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <form
            key={article.id}
            action={updateArticle}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-start"
          >
            <input type="hidden" name="id" value={article.id} />
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg sm:w-40">
              <Image src={article.image} alt="" fill className="object-cover" unoptimized={article.image.startsWith("http")} />
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                <input name="number" defaultValue={article.number} placeholder="№" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                <input name="tag" defaultValue={article.tag} placeholder="Тег" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                <input
                  name="title"
                  defaultValue={article.title}
                  placeholder="Заголовок"
                  className="rounded-lg border border-line px-2.5 py-1.5 text-sm sm:col-span-2"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <input name="sort_order" type="number" defaultValue={article.sort_order} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
                <label className="text-xs text-grey-1">
                  Новое фото: <input type="file" name="file" accept="image/*" />
                </label>
              </div>
              <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
                Сохранить
              </button>
            </div>
          </form>
        ))}
      </div>

      {articles.map((article) => (
        <form key={`del-${article.id}`} action={deleteArticle} className="-mt-4 flex justify-end">
          <input type="hidden" name="id" value={article.id} />
          <button type="submit" className="text-xs font-medium text-red-600">
            Удалить «{article.title}»
          </button>
        </form>
      ))}

      <details className="rounded-2xl border border-dashed border-line p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">+ Добавить статью</summary>
        <form action={createArticle} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input name="number" placeholder="№" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            <input name="tag" placeholder="Тег" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            <input name="title" placeholder="Заголовок" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm sm:col-span-2" />
          </div>
          <input name="sort_order" type="number" defaultValue={articles.length} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
          <label className="text-xs text-grey-1">
            Фото: <input type="file" name="file" accept="image/*" required />
          </label>
          <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
            Добавить
          </button>
        </form>
      </details>
    </div>
  );
}
