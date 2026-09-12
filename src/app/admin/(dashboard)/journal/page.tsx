import Image from "next/image";
import Link from "next/link";
import { getArticlesForAdmin } from "@/lib/data/articles";
import { getJournalCategories } from "@/lib/data/journal-categories";
import { createArticleAction, deleteArticleAction, updateArticleAction } from "./actions";

export default async function JournalAdminPage() {
  const [articles, categories] = await Promise.all([getArticlesForAdmin(), getJournalCategories()]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Padel Journal</h1>
        <Link href="/admin/journal/categories" className="text-sm font-medium text-ink underline">
          Категории →
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {articles.map((article) => (
          <form
            key={article.id}
            action={updateArticleAction}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5"
          >
            <input type="hidden" name="id" value={article.id} />
            <input type="hidden" name="existing_cover" value={article.cover} />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-lg bg-surface sm:w-40">
                {article.cover && (
                  <Image src={article.cover} alt="" fill className="object-cover" unoptimized={article.cover.startsWith("http")} />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs text-grey-1">
                    Заголовок
                    <input name="title" defaultValue={article.title} required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-grey-1">
                    Категория
                    <select name="category_id" defaultValue={article.categoryId ?? ""} className="rounded-lg border border-line px-2.5 py-1.5 text-sm">
                      <option value="">Без категории</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-xs text-grey-1">
                  Ссылка на статью (/journal/…)
                  <input name="slug" defaultValue={article.slug} placeholder="latinskie-slova-cherez-defis" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                </label>

                <label className="flex flex-col gap-1 text-xs text-grey-1">
                  Текст статьи
                  <textarea name="body" defaultValue={article.body} rows={5} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                </label>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs text-grey-1">
                    SEO Title
                    <input name="seo_title" defaultValue={article.seoTitle} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-grey-1">
                    SEO Description
                    <input name="seo_description" defaultValue={article.seoDescription} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
                  </label>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <input name="sort_order" type="number" defaultValue={article.sortOrder} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
                  <label className="text-xs text-grey-1">
                    Новое фото: <input type="file" name="file" accept="image/*" />
                  </label>
                  <label className="flex items-center gap-2 text-xs text-grey-1">
                    <input type="checkbox" name="published" defaultChecked={article.published} />
                    Опубликовано
                  </label>
                </div>

                <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
                  Сохранить
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>

      {articles.map((article) => (
        <form key={`del-${article.id}`} action={deleteArticleAction} className="-mt-4 flex justify-end">
          <input type="hidden" name="id" value={article.id} />
          <button type="submit" className="text-xs font-medium text-red-600">
            Удалить «{article.title}»
          </button>
        </form>
      ))}

      <details className="rounded-2xl border border-dashed border-line p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">+ Добавить статью</summary>
        <form action={createArticleAction} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Заголовок
              <input name="title" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Категория
              <select name="category_id" className="rounded-lg border border-line px-2.5 py-1.5 text-sm">
                <option value="">Без категории</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Ссылка на статью (необязательно — сгенерируется из заголовка)
            <input name="slug" placeholder="latinskie-slova-cherez-defis" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Текст статьи
            <textarea name="body" rows={5} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              SEO Title
              <input name="seo_title" placeholder="По умолчанию = заголовок" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              SEO Description
              <input name="seo_description" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
          </div>
          <input name="sort_order" type="number" defaultValue={articles.length} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
          <label className="text-xs text-grey-1">
            Фото: <input type="file" name="file" accept="image/*" required />
          </label>
          <label className="flex w-fit items-center gap-2 text-xs text-grey-1">
            <input type="checkbox" name="published" defaultChecked />
            Опубликовано
          </label>
          <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
            Добавить
          </button>
        </form>
      </details>
    </div>
  );
}
