import Image from "next/image";
import Link from "next/link";
import { getGalleryImagesForAdmin } from "@/lib/data/gallery";
import { getGalleryCategories } from "@/lib/data/gallery-categories";
import { deleteImage, updateImage, uploadImage } from "./actions";

export default async function GalleryAdminPage() {
  const [images, categories] = await Promise.all([getGalleryImagesForAdmin(), getGalleryCategories()]);
  const categoryName = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-ink">Галерея</h1>
        <Link href="/admin/gallery/categories" className="text-sm font-medium text-ink underline">
          Категории →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image src={img.url} alt="" fill className="object-cover" unoptimized />
            </div>
            <form action={updateImage} className="flex flex-col gap-2">
              <input type="hidden" name="id" value={img.id} />
              <select name="category_id" defaultValue={img.categoryId ?? ""} className="rounded-lg border border-line px-2 py-1 text-xs">
                <option value="">Без категории</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={img.sortOrder}
                  className="w-16 rounded-lg border border-line px-2 py-1 text-xs"
                />
                <button type="submit" className="rounded-full bg-lime-bright px-3 py-1 text-xs font-medium text-ink">
                  Сохранить
                </button>
              </div>
            </form>
            {img.categoryId && !categoryName[img.categoryId] && (
              <p className="text-[11px] text-grey-1">Категория удалена</p>
            )}
            <form action={deleteImage}>
              <input type="hidden" name="id" value={img.id} />
              <button type="submit" className="text-xs font-medium text-red-600">
                Удалить
              </button>
            </form>
          </div>
        ))}
      </div>

      <form action={uploadImage} className="flex flex-wrap items-end gap-3 rounded-2xl border border-dashed border-line p-5">
        <label className="flex flex-col gap-1 text-xs text-grey-1">
          Новое фото
          <input type="file" name="file" accept="image/*" required />
        </label>
        <label className="flex flex-col gap-1 text-xs text-grey-1">
          Категория
          <select name="category_id" className="rounded-lg border border-line px-2 py-1.5 text-sm">
            <option value="">Без категории</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-grey-1">
          Порядок
          <input name="sort_order" type="number" defaultValue={images.length} className="w-20 rounded-lg border border-line px-2 py-1.5 text-sm" />
        </label>
        <button type="submit" className="rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
          Загрузить
        </button>
      </form>
    </div>
  );
}
