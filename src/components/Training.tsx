import Image from "next/image";
import { pricingPlans as fallbackPlans, siteTexts as fallbackTexts, type PricingPlan, type SiteTexts } from "@/lib/content";
import { AnimatedNumber } from "./ui/AnimatedNumber";
import { ArrowButton } from "./ui/ArrowButton";
import { Reveal, RevealItem, RevealStagger } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

function digits(value: string): number {
  return Number(value.replace(/\D/g, "")) || 0;
}

type TrainingProps = { plans?: PricingPlan[]; texts?: SiteTexts };

export function Training({ plans = fallbackPlans, texts = fallbackTexts }: TrainingProps) {
  return (
    <section id="training" className="container-page section-pad">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-3.5">
          <SectionLabel>Тренировки</SectionLabel>
          <h2 className="h2-fluid font-extrabold text-ink">
            {texts["training.heading.line1"]}
            <br />
            {texts["training.heading.line2"]}{" "}
            <span className="text-grey-2">{texts["training.heading.line2Highlight"]}</span>
          </h2>
        </div>
        <div className="flex gap-3">
          <span className="h-9 w-px shrink-0 bg-line" />
          <p className="whitespace-pre-line text-sm text-grey-1">{texts["training.description"]}</p>
        </div>
      </Reveal>

      <RevealStagger className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-stretch">
        {plans.map((plan) => (
          <RevealItem key={plan.title} className="lg:flex-1">
            <div
              className={`group flex h-full flex-col gap-6 rounded-[18px] p-6 sm:p-[30px] ${
                plan.dark ? "bg-dark-surface" : "bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-2.5">
                  <span className="text-lg font-bold text-lime sm:text-xl">{plan.number}</span>
                  <p className={`h3-fluid font-bold ${plan.dark ? "text-[#f9f9f7]" : "text-ink"}`}>{plan.title}</p>
                  <span className={`h-px w-[46px] ${plan.dark ? "bg-[#3a3a3a]" : "bg-[#d1d1d1]"}`} />
                  <p className={`text-sm sm:text-lg ${plan.dark ? "text-[#a6a6a6]" : "text-grey-2"}`}>
                    {plan.description}
                  </p>
                </div>
                <div
                  className={`flex size-[58px] shrink-0 items-center justify-center rounded-full ${
                    plan.dark ? "border-2 border-[#91b525]" : ""
                  }`}
                >
                  <Image
                    src={plan.icon === "solo" ? "/images/icons/person-solo.svg" : "/images/icons/people-group.svg"}
                    alt=""
                    width={plan.icon === "solo" ? 58 : 28}
                    height={plan.icon === "solo" ? 58 : 28}
                  />
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col">
                  <p className={`price-fluid font-extrabold ${plan.dark ? "text-white" : "text-[#0c0c0c]"}`}>
                    <AnimatedNumber value={digits(plan.price)} /> <span className="text-lime">€</span>
                  </p>
                  <p className={`text-sm sm:text-base ${plan.dark ? "text-[#a6a6a6]" : "text-[#adadad]"}`}>
                    / тренировка
                  </p>
                </div>

                <div className="flex w-full flex-col overflow-hidden rounded-[16px] border sm:w-auto sm:min-w-[300px]" style={{ borderColor: plan.dark ? "#2c2c2c" : "#d9d9d9" }}>
                  {plan.rows.map((row, i) => (
                    <div
                      key={row.label}
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 sm:px-[23px] ${
                        plan.dark ? "bg-dark-surface-2" : "bg-white"
                      } ${i > 0 ? (plan.dark ? "border-t border-dark-border" : "border-t border-[#d9d9d9]") : ""}`}
                    >
                      <span className={`text-sm sm:text-lg ${plan.dark ? "text-white" : "text-[#515151]"}`}>
                        {row.label}
                      </span>
                      <span className="flex items-end gap-2.5">
                        <span className="text-sm text-[#a6a6a6] line-through sm:text-xl">{row.oldPrice}</span>
                        <span className={`text-xl font-bold sm:text-3xl ${plan.dark ? "text-white" : "text-[#0c0c0c]"}`}>
                          <AnimatedNumber value={digits(row.newPrice)} /> €
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto flex flex-col gap-3">
                <p className={`text-sm ${plan.dark ? "text-[#a6a6a6]" : "text-[#929292]"}`}>+ стоимость корта</p>
                <a href={plan.dark ? "#" : "#"} className="flex items-center gap-2.5">
                  <span
                    className={`flex size-[33px] items-center justify-center rounded-full border text-xs font-bold transition-all duration-300 group-hover:scale-110 ${
                      plan.dark
                        ? "border-transparent bg-lime text-black group-hover:border-white group-hover:bg-transparent group-hover:text-white"
                        : "border-[#8aab25] text-lime group-hover:border-lime-bright group-hover:bg-lime-bright group-hover:text-ink"
                    }`}
                  >
                    →
                  </span>
                  <span className={`text-xs font-bold ${plan.dark ? "text-white" : "text-[#303030]"}`}>
                    Записаться
                  </span>
                </a>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      <Reveal delay={0.15}>
        <div className="group relative mt-4 flex flex-col gap-6 overflow-hidden rounded-2xl border border-line bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-[28px]">
          <p
            aria-hidden
            className="watermark-fluid pointer-events-none absolute -bottom-3 -right-3 hidden font-black text-[#f0f0f0] sm:block"
          >
            PADEL
          </p>

          <div className="relative flex items-center gap-3.5">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-full border-[1.5px] border-lime-bright sm:size-16">
              <Image src="/images/icons/calendar.svg" alt="" width={26} height={26} />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-ink">Хочешь начать?</p>
              <p className="max-w-[307px] text-sm leading-[1.45] text-grey-1">
                Напиши нам, и мы подберём удобное время для первой тренировки.
              </p>
            </div>
          </div>

          <a href="#" className="relative flex shrink-0 items-center gap-2">
            <ArrowButton variant="lime" size={30} groupHover />
            <span className="text-[13px] font-medium text-ink">Связаться с нами</span>
          </a>
        </div>
      </Reveal>
    </section>
  );
}
