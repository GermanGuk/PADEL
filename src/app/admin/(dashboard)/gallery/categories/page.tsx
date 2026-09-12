import Link from "next/link";
import { getGalleryCategories } from "@/lib/data/gallery-categories";
import { addCategory, removeCategory, renameCategory } from "./actions";

export default async function GalleryCategoriesPage() {
  const categories = await getGalleryCategories();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Категории галереи</h1>
        <Link href="/admin/gallery" className="text-sm font-medium text-ink underline">
          ← К галерее
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {categories.map((category) => (
          <form key={category.id} action={renameCategory} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-4">
            <input type="hidden" name="id" value={category.id} />
            <input name="name" defaultValue={category.name} className="flex-1 rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            <button type="submit" className="rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
              Сохранить
            </button>
          </form>
        ))}
      </div>

      {categories.map((category) => (
        <form key={`del-${category.id}`} action={removeCategory} className="-mt-4 flex justify-end">
          <input type="hidden" name="id" value={category.id} />
          <button type="submit" className="text-xs font-medium text-red-600">
            Удалить «{category.name}» (фото останутся без категории)
          </button>
        </form>
      ))}

      <form action={addCategory} className="flex items-end gap-3 rounded-2xl border border-dashed border-line p-5">
        <label className="flex flex-1 flex-col gap-1 text-xs text-grey-1">
          Новая категория
          <input name="name" required placeholder="Напр. Мексикано" className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
        </label>
        <button type="submit" className="rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
          Добавить
        </button>
      </form>
    </div>
  );
}
