import Image from "next/image";
import { getCommunityContentForAdmin } from "@/lib/data/community";
import { saveCommunity } from "./actions";

export default async function CommunityAdminPage() {
  const content = await getCommunityContentForAdmin();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Сообщество</h1>
        <p className="mt-1 max-w-lg text-sm text-grey-1">
          Блок «Ищешь напарника? Найдём.» на главной странице.
        </p>
      </div>

      <form action={saveCommunity} className="flex max-w-lg flex-col gap-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Заголовок
            <input name="heading" defaultValue={content.heading} required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Заголовок (выделенное слово)
            <input name="heading_highlight" defaultValue={content.headingHighlight} required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-xs text-grey-1">
          Описание
          <textarea name="description" defaultValue={content.description} rows={3} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-xs text-grey-1">
          Ссылка на кнопке «Найти напарника в Telegram»
          <input name="button_link" defaultValue={content.buttonLink} placeholder="https://t.me/..." className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
        </label>

        <div className="flex items-center gap-4">
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
            <Image src={content.image} alt="" fill className="object-cover" unoptimized={content.image.startsWith("http")} />
          </div>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Новое фото
            <input type="file" name="photo" accept="image/*" />
          </label>
        </div>

        <button type="submit" className="w-fit rounded-full bg-lime-bright px-5 py-2.5 text-sm font-medium text-ink">
          Сохранить
        </button>
      </form>
    </div>
  );
}
