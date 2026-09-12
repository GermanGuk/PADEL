"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { ArticleCard } from "@/lib/data/articles";
import { Reveal, RevealItem, RevealStagger } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

type JournalCategory = { id: string; name: string };

type JournalProps = { articles: ArticleCard[]; categories: JournalCategory[] };

const ALL = "all";

export function Journal({ articles, categories }: JournalProps) {
  const [activeTab, setActiveTab] = useState(ALL);

  const visible = activeTab === ALL ? articles : articles.filter((a) => a.categoryId === activeTab);
  const categoryName = Object.fromEntries(categories.map((c) => [c.id, c.name]));

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
        </div>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2.5">
        <button
          type="button"
          onClick={() => setActiveTab(ALL)}
          className={`rounded-full px-4 py-2 text-[13px] whitespace-nowrap ${
            activeTab === ALL ? "bg-lime-bright font-medium text-ink" : "text-grey-2 hover:text-ink"
          }`}
        >
          Все
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveTab(category.id)}
            className={`rounded-full px-4 py-2 text-[13px] whitespace-nowrap ${
              activeTab === category.id ? "bg-lime-bright font-medium text-ink" : "text-grey-2 hover:text-ink"
            }`}
          >
            {category.name}
          </button>
        ))}
      </Reveal>

      <RevealStagger key={activeTab} className="mt-6 flex flex-col gap-4 sm:grid sm:grid-cols-2">
        {visible.map((article, i) => (
          <RevealItem key={article.id} className="group w-full sm:w-auto">
            <Link
              href={`/journal/${article.slug}`}
              className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-[14px] p-5 sm:aspect-[16/11]"
            >
              <Image
                src={article.cover}
                alt=""
                fill
                sizes="(min-width: 640px) 50vw, 85vw"
                className="scale-100 object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                unoptimized={article.cover.startsWith("http")}
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/80" />

              <p className="relative text-3xl font-extrabold text-white sm:text-[40px]">
                {String(i + 1).padStart(2, "0")}
              </p>

              <div className="relative flex flex-col gap-2 pb-2">
                {article.categoryId && categoryName[article.categoryId] && (
                  <p className="text-sm font-bold tracking-[0.5px] text-lime sm:text-base">
                    {categoryName[article.categoryId]}
                  </p>
                )}
                <p className="text-[11px] font-normal text-white sm:text-[15px]">{article.title}</p>
                <span className="text-sm font-medium text-white sm:text-base">
                  Читать статью <span className="text-lime">↗</span>
                </span>
              </div>
            </Link>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
