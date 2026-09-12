import Image from "next/image";
import { articles as fallbackArticles, journalTabs, type Article } from "@/lib/content";
import { Reveal, RevealItem, RevealStagger } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

export function Journal({ articles = fallbackArticles }: { articles?: Article[] }) {
  return (
    <section id="journal" className="container-page section-pad">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row">
        <div className="flex flex-col gap-3.5">
          <SectionLabel>Padel journal</SectionLabel>
          <h2 className="h2-fluid font-extrabold text-ink">
            Играть — хорошо.
            <br />
            <span className="text-grey-2">Понимать игру — еще лучше.</span>
          </h2>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <p className="text-sm text-grey-1 md:text-right">
            Советы, разборы, новости и всё,
            <br />
            что помогает играть увереннее.
          </p>
          <a href="#" className="text-[13px] font-medium text-ink">
            Все материалы <span className="text-lime-neon">↗</span>
          </a>
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2.5">
        {journalTabs.map((tab) => (
          <a
            key={tab.label}
            href={tab.href ?? "#journal"}
            className={`rounded-full px-4 py-2 text-[13px] whitespace-nowrap ${
              tab.active ? "bg-lime-bright font-medium text-ink" : "text-grey-2 hover:text-ink"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </Reveal>

      <RevealStagger className="scroll-row -mx-[clamp(20px,4vw,65px)] mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,4vw,65px)] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
        {articles.map((article) => (
          <RevealItem key={article.number} className="group w-[85vw] shrink-0 snap-start sm:w-auto sm:shrink">
            <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[14px] p-5 sm:aspect-[16/11]">
              <Image
                src={article.image}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 85vw"
                className="scale-100 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />

              <p className="relative text-3xl font-extrabold text-white sm:text-[40px]">{article.number}</p>

              <div className="relative flex flex-col gap-2 pb-2">
                <p className="text-sm font-bold tracking-[0.5px] text-lime sm:text-base">{article.tag}</p>
                <p className="text-[11px] font-normal text-white sm:text-[15px]">{article.title}</p>
                <a href="#" className="text-sm font-medium text-white sm:text-base">
                  Читать статью <span className="text-lime">↗</span>
                </a>
              </div>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      <Reveal delay={0.1}>
        <a href="#" className="mt-8 inline-block text-[13px] font-medium text-ink">
          Смотреть все материалы <span className="text-lime">↗</span>
        </a>
      </Reveal>
    </section>
  );
}
