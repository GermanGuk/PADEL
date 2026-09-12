import Image from "next/image";
import { gameCards, galleryImages, type GameCard, type GameCardMeta } from "@/lib/content";
import { ArrowButton } from "./ui/ArrowButton";
import { Parallax } from "./ui/Parallax";
import { Reveal, RevealItem, RevealStagger } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

const ICONS: Record<GameCardMeta["icon"], { light: string; dark: string }> = {
  players: { light: "/images/icons/players-light.svg", dark: "/images/icons/players-dark.svg" },
  courts: { light: "/images/icons/courts-light.svg", dark: "/images/icons/courts-dark.svg" },
  clock: { light: "/images/icons/clock-light.svg", dark: "/images/icons/clock-dark.svg" },
  location: { light: "/images/icons/location-light.svg", dark: "/images/icons/location-dark.svg" },
};

function MetaRow({ item, light, hoverLight }: { item: GameCardMeta; light: boolean; hoverLight?: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative inline-block h-4 w-4 shrink-0">
        <Image
          src={ICONS[item.icon][light ? "light" : "dark"]}
          alt=""
          width={16}
          height={16}
          className={`absolute inset-0 h-4 w-4 ${hoverLight ? "transition-opacity duration-700 ease-in-out group-hover:opacity-0" : ""}`}
        />
        {hoverLight && (
          <Image
            src={ICONS[item.icon].light}
            alt=""
            width={16}
            height={16}
            className="absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
          />
        )}
      </span>
      <span
        className={`text-[13px] leading-[1.5] ${light ? "text-[#ccc]" : "text-[#343434]"} ${
          hoverLight ? "transition-colors duration-700 ease-in-out group-hover:text-[#ccc]" : ""
        }`}
      >
        {item.text}
      </span>
    </div>
  );
}

export function Games({ games = gameCards }: { games?: GameCard[] }) {
  const [featured, ...rest] = games;

  return (
    <section id="games" className="container-page section-pad">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="flex flex-col gap-3.5">
          <SectionLabel>Ближайшие игры</SectionLabel>
          <h2 className="h2-fluid font-extrabold text-ink">
            На этой неделе
            <br />
            встречаемся <span className="text-grey-2">на корте</span>
          </h2>
        </div>
        <p className="text-sm text-grey-1 md:text-right">
          Выбирай игру под свой уровень
          <br />
          и присоединяйся.
        </p>
      </Reveal>

      <RevealStagger className="mt-10 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-4 lg:flex lg:flex-row">
        <RevealItem className="sm:col-span-2 lg:basis-0 lg:shrink lg:grow-[1.7] lg:transition-[flex-grow] lg:duration-1000 lg:ease-in-out lg:hover:grow-[2.6]">
          <div className="relative flex h-[340px] flex-col justify-between overflow-hidden rounded-2xl p-[18px]">
            <Parallax strength={22} className="absolute inset-0">
              <Image src={featured.image!} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="scale-110 object-cover" />
            </Parallax>
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/40" />

            <span className="relative w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink">
              {featured.badge}
            </span>

            <div className="relative flex flex-col gap-2">
              <p className="text-xl font-bold text-white sm:text-2xl">{featured.title}</p>
              {featured.meta.map((m) => (
                <MetaRow key={m.icon} item={m} light />
              ))}
            </div>

            <div className="relative flex h-[51px] items-center justify-between">
              <span className="text-2xl font-bold text-lime sm:text-[30px]">{featured.price}</span>
              <ArrowButton variant="light" />
            </div>
          </div>
        </RevealItem>

        {rest.map((card, i) => (
          <RevealItem
            key={card.title}
            className="lg:basis-0 lg:shrink lg:grow lg:transition-[flex-grow] lg:duration-1000 lg:ease-in-out lg:hover:grow-[1.8]"
          >
            <div className="group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl bg-surface p-[18px]">
              <div className="absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100">
                <Image
                  src={galleryImages[i % galleryImages.length]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, 100vw"
                  className="object-cover"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
              </div>

              <span className="relative w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink">
                {card.badge}
              </span>

              <div className="relative flex flex-col gap-2">
                <p className="text-xl font-bold text-ink transition-colors duration-700 ease-in-out group-hover:text-white sm:text-2xl">
                  {card.title}
                </p>
                {card.meta.map((m) => (
                  <MetaRow key={m.icon} item={m} light={false} hoverLight />
                ))}
                {card.extra && (
                  <p className="text-xs text-[#343434] transition-colors duration-700 ease-in-out group-hover:text-[#ccc]">
                    {card.extra}
                  </p>
                )}
              </div>

              <div className="relative flex h-[51px] items-center justify-between">
                {card.price ? (
                  <span className="text-2xl font-bold text-lime sm:text-[30px]">{card.price}</span>
                ) : (
                  <span />
                )}
                <ArrowButton variant="dark" href="#" groupHover />
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      <Reveal delay={0.1}>
        <a href="#" className="mt-8 inline-block text-[13px] font-medium text-ink">
          Все игры и мероприятия →
        </a>
      </Reveal>
    </section>
  );
}
