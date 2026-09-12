import { getSiteTexts } from "@/lib/data/site-texts";
import { saveTexts } from "./actions";

const LABELS: Record<string, string> = {
  "hero.title.line1": "Главный экран — заголовок, строка 1",
  "hero.title.line2": "Главный экран — заголовок, строка 2",
  "hero.title.line3": "Главный экран — заголовок, строка 3 (выделена цветом)",
  "hero.subtitle.left": "Главный экран — подпись слева",
  "hero.subtitle.right": "Главный экран — подпись справа",
  "training.heading.line1": "Тренировки — заголовок, строка 1",
  "training.heading.line2": "Тренировки — заголовок, строка 2",
  "training.heading.line2Highlight": "Тренировки — заголовок, выделенное слово",
  "training.description": "Тренировки — описание",
  "community.heading": "Сообщество — заголовок",
  "community.headingHighlight": "Сообщество — выделенное слово в заголовке",
  "community.description": "Сообщество — описание",
};

export default async function TextsAdminPage() {
  const texts = await getSiteTexts();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-ink">Тексты на сайте</h1>
      <form action={saveTexts} className="flex flex-col gap-4">
        {Object.entries(texts).map(([key, value]) => (
          <label key={key} className="flex flex-col gap-1 text-xs text-grey-1">
            {LABELS[key] ?? key}
            <textarea
              name={key}
              defaultValue={value}
              rows={value.includes("\n") ? 3 : 2}
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm text-ink"
            />
          </label>
        ))}
        <button type="submit" className="w-fit rounded-full bg-lime-bright px-5 py-2.5 text-sm font-medium text-ink">
          Сохранить
        </button>
      </form>
    </div>
  );
}
