import Image from "next/image";
import { communityBubbles, communityStats, siteLinks, siteTexts as fallbackTexts, type SiteTexts } from "@/lib/content";
import { Parallax } from "./ui/Parallax";
import { Reveal } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

const BUBBLE_POSITIONS = [
  { top: "9%", left: "46%" },
  { top: "40%", left: "4%" },
  { top: "68%", left: "40%" },
];

export function Community({ texts = fallbackTexts }: { texts?: SiteTexts }) {
  return (
    <section id="community" className="container-page section-pad">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <Reveal className="flex flex-col gap-8 lg:w-[38%] lg:shrink-0">
          <div className="flex flex-col gap-2">
            <SectionLabel>Сообщество</SectionLabel>
            <h2 className="h2-fluid font-extrabold text-ink">
              {texts["community.heading"]} <span className="text-grey-2">{texts["community.headingHighlight"]}</span>
            </h2>
          </div>
          <p className="max-w-[445px] text-sm text-grey-1">{texts["community.description"]}</p>
          <a
            href={siteLinks.telegram}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-lime-bright px-5 py-3 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            <Image src="/images/icons/telegram-fill-2.svg" alt="" width={12} height={11} />
            Найти напарника в Telegram
          </a>
        </Reveal>

        <Reveal delay={0.1} className="lg:flex-1">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] sm:aspect-[16/10]">
            <Parallax strength={26} className="absolute inset-0">
              <Image
                src="/images/community/photo.png"
                alt="Игроки в падел общаются на корте"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="scale-110 object-cover"
              />
            </Parallax>

            {/* chat bubbles overlay: decorative, hidden on the smallest screens to avoid crowding the photo */}
            <div className="pointer-events-none absolute inset-0 hidden xs:block">
              {communityBubbles.map((b, i) => (
                <div key={b.text} className="absolute flex max-w-[85%] items-center gap-2" style={BUBBLE_POSITIONS[i]}>
                  <span className="relative size-[22px] shrink-0 overflow-hidden rounded-full ring-2 ring-white sm:size-[26px]">
                    <Image src={b.avatar} alt="" fill className="object-cover" />
                  </span>
                  <span className="whitespace-nowrap rounded-full bg-white px-2.5 py-1.5 text-[10px] font-medium text-ink shadow-sm sm:px-3 sm:py-2 sm:text-[11px]">
                    {b.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[15px] font-semibold text-ink-soft">
        {communityStats.map((stat, i) => (
          <span key={stat} className="flex items-center gap-2.5">
            <span>{stat}</span>
            {i < communityStats.length - 1 && <span className="size-[3px] rounded-full bg-lime" />}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
