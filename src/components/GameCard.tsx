"use client";

import Image from "next/image";
import { useState } from "react";
import type { GameCard as GameCardType, GameCardMeta } from "@/lib/content";
import { ArrowButton } from "./ui/ArrowButton";

const ICONS: Record<GameCardMeta["icon"], { light: string; dark: string }> = {
  players: { light: "/images/icons/players-light.svg", dark: "/images/icons/players-dark.svg" },
  courts: { light: "/images/icons/courts-light.svg", dark: "/images/icons/courts-dark.svg" },
  clock: { light: "/images/icons/clock-light.svg", dark: "/images/icons/clock-dark.svg" },
  location: { light: "/images/icons/location-light.svg", dark: "/images/icons/location-dark.svg" },
};

function MetaRow({ item, revealed }: { item: GameCardMeta; revealed: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative inline-block h-4 w-4 shrink-0">
        <Image
          src={ICONS[item.icon].dark}
          alt=""
          width={16}
          height={16}
          className={`absolute inset-0 h-4 w-4 transition-opacity duration-700 ease-in-out lg:group-hover:opacity-0 ${
            revealed ? "opacity-0" : ""
          }`}
        />
        <Image
          src={ICONS[item.icon].light}
          alt=""
          width={16}
          height={16}
          className={`absolute inset-0 h-4 w-4 opacity-0 transition-opacity duration-700 ease-in-out lg:group-hover:opacity-100 ${
            revealed ? "opacity-100" : ""
          }`}
        />
      </span>
      <span
        className={`text-[13px] leading-[1.5] transition-colors duration-700 ease-in-out lg:group-hover:text-[#ccc] ${
          revealed ? "text-[#ccc]" : "text-[#343434]"
        }`}
      >
        {item.text}
      </span>
    </div>
  );
}

export function GameCard({ card, image }: { card: GameCardType; image: string }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className="group relative flex h-full min-h-[340px] flex-col justify-between overflow-hidden rounded-2xl bg-surface p-[18px]"
      onClick={() => {
        // Desktop already reveals the photo on hover — tapping is a mobile-only affordance.
        if (window.matchMedia("(min-width: 1024px)").matches) return;
        setRevealed((v) => !v);
      }}
    >
      <div
        className={`absolute inset-0 opacity-0 transition-opacity duration-700 ease-in-out lg:group-hover:opacity-100 ${
          revealed ? "opacity-100" : ""
        }`}
      >
        <Image src={image} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      </div>

      <span className="relative w-fit rounded-full bg-white px-3 py-1.5 text-[11px] font-medium text-ink">
        {card.badge}
      </span>

      <div className="relative flex flex-col gap-2">
        <p
          className={`text-xl font-bold transition-colors duration-700 ease-in-out lg:group-hover:text-white sm:text-2xl ${
            revealed ? "text-white" : "text-ink"
          }`}
        >
          {card.title}
        </p>
        {card.meta.map((m) => (
          <MetaRow key={m.icon} item={m} revealed={revealed} />
        ))}
        {card.extra && (
          <p
            className={`text-xs transition-colors duration-700 ease-in-out lg:group-hover:text-[#ccc] ${
              revealed ? "text-[#ccc]" : "text-[#343434]"
            }`}
          >
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
        <ArrowButton
          variant="dark"
          href="#"
          groupHover
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
