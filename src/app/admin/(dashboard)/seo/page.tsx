import Image from "next/image";
import { getSettings } from "@/lib/data/settings";
import { saveSettings } from "./actions";

export default async function SeoAdminPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-ink">SEO и favicon сайта</h1>
      <p className="max-w-lg text-sm text-grey-1">
        Title и Description используются на главной странице сайта. У каждой статьи журнала свои
        Title и Description — их можно задать в разделе «Журнал».
      </p>

      <form action={saveSettings} className="flex max-w-lg flex-col gap-4">
        <label className="flex flex-col gap-1 text-xs text-grey-1">
          SEO Title (главная страница)
          <input name="seo_title" defaultValue={settings.seoTitle} required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
        </label>

        <label className="flex flex-col gap-1 text-xs text-grey-1">
          SEO Description (главная страница)
          <textarea name="seo_description" defaultValue={settings.seoDescription} rows={3} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
        </label>

        <div className="flex items-center gap-4">
          {settings.faviconUrl && (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-line bg-white">
              <Image src={settings.faviconUrl} alt="" fill className="object-contain" unoptimized />
            </div>
          )}
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Favicon (файл, квадратное изображение)
            <input type="file" name="favicon" accept="image/*" />
          </label>
        </div>

        <button type="submit" className="w-fit rounded-full bg-lime-bright px-5 py-2.5 text-sm font-medium text-ink">
          Сохранить
        </button>
      </form>
    </div>
  );
}
