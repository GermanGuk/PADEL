"use client";

import Image from "next/image";
import { useState } from "react";
import { galleryImages, galleryTabIndices, galleryTabs } from "@/lib/content";
import { Reveal, RevealItem, RevealStagger } from "./ui/Reveal";
import { SectionLabel } from "./ui/SectionLabel";

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

export function Gallery({ images = galleryImages }: { images?: string[] }) {
  const [activeTab, setActiveTab] = useState(galleryTabs[0]);

  const visible =
    activeTab === "Все"
      ? images
      : (galleryTabIndices[activeTab] ?? []).map((i) => images[i]).filter(Boolean);

  const rows = chunk(visible, 4);

  return (
    <section id="gallery" className="container-page section-pad">
      <Reveal className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-start">
        <div className="flex flex-col gap-3.5">
          <SectionLabel>Галерея</SectionLabel>
          <h2 className="h2-fluid font-extrabold text-ink">
            Здесь всё происходит
            <br />
            <span className="text-grey-2">по-настоящему</span>
          </h2>
        </div>
        <p className="text-sm text-grey-1 md:text-right md:max-w-[274px]">
          Тренировки, турниры, победы, ошибки, новые знакомства и просто хорошие вечера на корте.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mt-6 flex flex-wrap items-center gap-2.5">
        {galleryTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-[13px] whitespace-nowrap transition-colors ${
              activeTab === tab ? "bg-lime-bright font-medium text-ink" : "text-grey-1 hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </Reveal>

      <RevealStagger
        key={activeTab}
        className="scroll-row -mx-[clamp(20px,4vw,65px)] mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(20px,4vw,65px)] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:flex lg:flex-col"
      >
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="contents lg:flex lg:gap-4">
            {row.map((src) => (
              <RevealItem
                key={src}
                className="aspect-[4/3] w-[240px] shrink-0 snap-start sm:w-auto sm:shrink lg:aspect-auto lg:h-72 lg:shrink lg:grow lg:basis-0 lg:transition-[flex-grow] lg:duration-1000 lg:ease-in-out lg:hover:grow-[2.5]"
              >
                <div className="relative h-full w-full overflow-hidden rounded-[14px]">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 240px"
                    className="object-cover"
                  />
                </div>
              </RevealItem>
            ))}
          </div>
        ))}
      </RevealStagger>

      <Reveal delay={0.1}>
        <a
          href={"https://instagram.com"}
          className="mt-8 inline-flex items-center gap-2 rounded-full border border-lime px-[18px] py-2.5 text-[13px]"
        >
          <span className="font-medium text-ink">Подписывайся в Instagram</span>
          <span className="text-lime">↗</span>
        </a>
      </Reveal>
    </section>
  );
}
