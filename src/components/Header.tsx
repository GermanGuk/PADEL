"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks, siteLinks } from "@/lib/content";

type HeaderProps = { telegramUrl?: string };

export function Header({ telegramUrl = siteLinks.telegram }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setPastThreshold(window.scrollY > 200);
    };
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
    <>
      {/* Desktop header bar — unchanged from before, hidden below lg */}
      <header
        className={`sticky top-0 z-50 hidden transition-colors duration-300 lg:static lg:block ${
          scrolled ? "bg-cream/90 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-line)]" : "bg-cream"
        }`}
      >
        <div className="container-page flex h-[84px] items-center justify-between">
          <Link href="#top" className="flex items-center gap-2.5">
            <Image src="/images/icons/logo-mark.svg" alt="" width={36} height={36} className="h-9 w-9" />
            <span className="font-extrabold leading-[1.1] text-base text-ink">
              TOP PADEL
              <br />
              ALICANTE
            </span>
          </Link>

          <nav className="flex items-center gap-7 text-sm text-ink">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="transition-opacity hover:opacity-60">
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href={telegramUrl}
            className="inline-flex items-center gap-2 rounded-full bg-lime-bright px-[18px] py-2.5 text-sm font-medium text-ink transition-transform hover:scale-[1.03]"
          >
            <Image src="/images/icons/telegram-fill.svg" alt="" width={12} height={11} />
            Telegram
          </a>
        </div>
      </header>

      {/* Mobile: a single floating, fixed circular burger button — no bar, no logo, no full-screen panel.
          Hidden until the user scrolls 200px, so it doesn't compete with the hero. */}
      <div
        className={`fixed right-4 top-4 z-50 transition-opacity duration-300 lg:hidden ${
          pastThreshold || open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative flex size-12 flex-col items-center justify-center gap-[5px] rounded-full bg-cream/90 shadow-md backdrop-blur-sm"
        >
          <span
            className={`h-[2px] w-5 bg-ink transition-transform duration-300 ${open ? "translate-y-[6px] rotate-45" : ""}`}
          />
          <span className={`h-[2px] w-5 bg-ink transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
          <span
            className={`h-[2px] w-5 bg-ink transition-transform duration-300 ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
          />
        </button>

        {open && (
          <>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
              className="fixed inset-0 -z-10 cursor-default"
            />
            <nav className="absolute right-0 top-14 flex w-60 flex-col gap-4 rounded-2xl bg-cream p-5 text-base font-medium text-ink shadow-lg ring-1 ring-line">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} onClick={() => setOpen(false)}>
                  {link.label}
                </a>
              ))}
              <a
                href={telegramUrl}
                onClick={() => setOpen(false)}
                className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-lime-bright px-5 py-2.5 text-sm font-medium text-ink"
              >
                <Image src="/images/icons/telegram-fill.svg" alt="" width={12} height={11} />
                Telegram
              </a>
            </nav>
          </>
        )}
      </div>
    </>
  );
}
