import Image from "next/image";
import { heroCards, siteTexts as fallbackTexts, type HeroCard, type SiteTexts } from "@/lib/content";
import { ArrowButton } from "./ui/ArrowButton";
import { Parallax } from "./ui/Parallax";
import { Reveal } from "./ui/Reveal";

type HeroProps = { cards?: HeroCard[]; texts?: SiteTexts };

export function Hero({ cards = heroCards, texts = fallbackTexts }: HeroProps) {
  return (
    <section
      id="top"
      className="container-page flex min-h-[100svh] flex-col justify-center gap-10 py-8 md:gap-14 lg:min-h-[calc(100svh-84px)]"
    >
      <Reveal className="flex flex-col items-center gap-6 text-center md:gap-8" y={28}>
        <h1 className="hero-h1 max-w-[1200px] font-extrabold text-ink">
          {texts["hero.title.line1"]}
          <br />
          {texts["hero.title.line2"]}
          <br />
          <span className="text-grey-2">{texts["hero.title.line3"]}</span>
        </h1>

        <div className="flex w-full max-w-[1470px] flex-col gap-4 text-sm text-grey-1 sm:flex-row sm:justify-between sm:text-left">
          <p className="whitespace-pre-line">{texts["hero.subtitle.left"]}</p>
          <p className="whitespace-pre-line sm:text-right">{texts["hero.subtitle.right"]}</p>
        </div>
      </Reveal>

      <div className="scroll-row -mx-[clamp(20px,4vw,65px)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,4vw,65px)] scroll-pl-[clamp(20px,4vw,65px)] xl:mx-0 xl:snap-none xl:gap-4 xl:overflow-visible xl:px-0 xl:scroll-pl-0">
        {cards.map((card, i) => (
          <a
            key={card.title}
            href={card.href}
            className={`group relative flex h-[300px] w-[220px] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[14px] p-2.5 sm:h-[340px] sm:w-[240px] md:h-[385px] xl:h-[385px] xl:w-auto xl:shrink xl:basis-0 xl:transition-[flex-grow] xl:duration-1000 xl:ease-in-out ${
              card.featured ? "xl:flex-[1.9] xl:w-auto xl:hover:flex-[2.5]" : "xl:flex-1 xl:hover:flex-[1.9]"
            }`}
          >
            <Parallax strength={18} className="absolute inset-0 rounded-[14px]">
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(min-width: 1280px) 25vw, 240px"
                className="scale-110 object-cover transition-transform duration-500 group-hover:scale-[1.18]"
              />
            </Parallax>
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/20"
            />

            <div className="relative flex items-center justify-between">
              <span className="rounded-full bg-lime-bright px-2.5 py-[5px] text-[8px] font-bold tracking-[0.3px] text-ink saturate-[0.7] sm:text-[9px]">
                {card.tag}
              </span>
              <ArrowButton variant="outline-light" size={40} direction="up-right" />
            </div>

            <div className="relative mb-2.5 flex flex-col gap-1 text-white">
              <p className="text-base font-extrabold sm:text-[17px]">{card.title}</p>
              {card.meta && <p className="text-xs font-medium text-[#d9d9d9] sm:text-[13px]">{card.meta}</p>}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
