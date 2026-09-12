import { getPricingPlansForAdmin } from "@/lib/data/pricing";
import type { PricingRow } from "@/lib/db-types";
import { createPlan, deletePlan, updatePlan } from "./actions";

const MAX_ROWS = 5;

function RowInputs({ rows }: { rows: PricingRow[] }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: MAX_ROWS }, (_, i) => {
        const row = rows[i];
        return (
          <div key={i} className="grid grid-cols-3 gap-2">
            <input
              name={`row_label_${i}`}
              placeholder="Напр. 4 тренировки"
              defaultValue={row?.label ?? ""}
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm"
            />
            <input
              name={`row_old_${i}`}
              placeholder="Старая цена"
              defaultValue={row?.oldPrice ?? ""}
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm"
            />
            <input
              name={`row_new_${i}`}
              placeholder="Новая цена"
              defaultValue={row?.newPrice ?? ""}
              className="rounded-lg border border-line px-2.5 py-1.5 text-sm"
            />
          </div>
        );
      })}
    </div>
  );
}

export default async function TrainingAdminPage() {
  const plans = await getPricingPlansForAdmin();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-bold text-ink">Тренировки и тарифы</h1>

      <div className="flex flex-col gap-4">
        {plans.map((plan) => (
          <form key={plan.id} action={updatePlan} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-5">
            <input type="hidden" name="id" value={plan.id} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Номер
                <input name="number" defaultValue={plan.number} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-grey-1 sm:col-span-2">
                Название
                <input name="title" defaultValue={plan.title} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
            </div>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Описание
              <input name="description" defaultValue={plan.description} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Цена / тренировка
                <input name="price" defaultValue={plan.price} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Иконка
                <select name="icon" defaultValue={plan.icon} className="rounded-lg border border-line px-2.5 py-1.5 text-sm">
                  <option value="solo">Один человек</option>
                  <option value="group">Группа</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-grey-1">
                Порядок
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={plan.sortOrder}
                  className="rounded-lg border border-line px-2.5 py-1.5 text-sm"
                />
              </label>
            </div>

            <p className="text-xs font-medium text-grey-1">Пакеты тренировок (пустые строки игнорируются)</p>
            <RowInputs rows={plan.rows} />

            <label className="flex w-fit items-center gap-2 text-xs text-grey-1">
              <input type="checkbox" name="dark" defaultChecked={plan.dark} />
              Тёмная карточка
            </label>

            <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
              Сохранить
            </button>
          </form>
        ))}
      </div>

      {plans.map((plan) => (
        <form key={`del-${plan.id}`} action={deletePlan} className="-mt-4 flex justify-end">
          <input type="hidden" name="id" value={plan.id} />
          <button type="submit" className="text-xs font-medium text-red-600">
            Удалить «{plan.title}»
          </button>
        </form>
      ))}

      <details className="rounded-2xl border border-dashed border-line p-5">
        <summary className="cursor-pointer text-sm font-medium text-ink">+ Добавить тариф</summary>
        <form action={createPlan} className="mt-4 flex flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Номер
              <input name="number" placeholder="03." required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1 sm:col-span-2">
              Название
              <input name="title" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-grey-1">
            Описание
            <input name="description" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Цена / тренировка
              <input name="price" required className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Иконка
              <select name="icon" className="rounded-lg border border-line px-2.5 py-1.5 text-sm">
                <option value="solo">Один человек</option>
                <option value="group">Группа</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-grey-1">
              Порядок
              <input name="sort_order" type="number" defaultValue={plans.length} className="rounded-lg border border-line px-2.5 py-1.5 text-sm" />
            </label>
          </div>
          <p className="text-xs font-medium text-grey-1">Пакеты тренировок (пустые строки игнорируются)</p>
          <RowInputs rows={[]} />
          <label className="flex w-fit items-center gap-2 text-xs text-grey-1">
            <input type="checkbox" name="dark" />
            Тёмная карточка
          </label>
          <button type="submit" className="w-fit rounded-full bg-lime-bright px-4 py-2 text-xs font-medium text-ink">
            Добавить
          </button>
        </form>
      </details>
    </div>
  );
}
