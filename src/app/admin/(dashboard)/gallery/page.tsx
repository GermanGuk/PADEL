import Image from "next/image";
import { getGalleryImagesForAdmin } from "@/lib/data/gallery";
import { deleteImage, updateSortOrder, uploadImage } from "./actions";

export default async function GalleryAdminPage() {
  const images = await getGalleryImagesForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold text-ink">Галерея</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((img) => (
          <div key={img.id} className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-3">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <Image src={img.url} alt="" fill className="object-cover" unoptimized />
            </div>
            <form action={updateSortOrder} className="flex items-center gap-2">
              <input type="hidden" name="id" value={img.id} />
              <input
                name="sort_order"
                type="number"
                defaultValue={img.sort_order}
                className="w-16 rounded-lg border border-line px-2 py-1 text-xs"
              />
              <button type="submit" className="rounded-full bg-lime-bright px-3 py-1 text-xs font-medium text-ink">
                Порядок
              </button>
            </form>
            <form action={deleteImage}>
              <input type="hidden" name="id" value={img.id} />
              <input type="hidden" name="url" value={img.url} />
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
