"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, siteLinks } from "@/lib/content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 lg:static ${
        scrolled ? "bg-cream/90 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-line)]" : "bg-cream"
      }`}
    >
      <div className="container-page flex h-[64px] items-center justify-between md:h-[84px]">
        <Link href="#top" className="flex items-center gap-2.5">
          <Image src="/images/icons/logo-mark.svg" alt="" width={36} height={36} className="h-8 w-8 md:h-9 md:w-9" />
          <span className="font-extrabold leading-[1.1] text-[15px] text-ink md:text-base">
            TOP PADEL
            <br />
            ALICANTE
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-ink lg:flex">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="transition-opacity hover:opacity-60">
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href={siteLinks.telegram}
          className="hidden items-center gap-2 rounded-full bg-lime-bright px-[18px] py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03] lg:inline-flex"
        >
          <Image src="/images/icons/telegram-fill.svg" alt="" width={12} height={11} />
          Telegram
        </a>

        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[5px] lg:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span className={`h-[2px] w-6 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-[2px] w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      <div
        className={`fixed inset-0 top-[64px] z-40 bg-cream transition-all duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="container-page flex flex-col gap-6 pt-10 text-xl font-medium text-ink">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <a
            href={siteLinks.telegram}
            onClick={() => setOpen(false)}
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-lime-bright px-5 py-3 text-base font-medium text-ink"
          >
            <Image src="/images/icons/telegram-fill.svg" alt="" width={14} height={13} />
            Telegram
          </a>
        </nav>
      </div>
    </header>
  );
}
