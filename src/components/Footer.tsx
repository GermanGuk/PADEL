import Image from "next/image";
import { footerContacts, footerNav, siteLinks } from "@/lib/content";
import { AnimatedWatermark } from "./ui/AnimatedWatermark";
import { Reveal } from "./ui/Reveal";

const CONTACT_ICONS: Record<string, string> = {
  location: "/images/icons/location-footer.svg",
  instagram: "/images/icons/instagram.svg",
  telegram: "/images/icons/telegram-footer.svg",
  whatsapp: "/images/icons/whatsapp.svg",
};

type FooterProps = {
  telegramUrl?: string;
  instagramUrl?: string;
  whatsappUrl?: string;
};

export function Footer({
  telegramUrl = siteLinks.telegram,
  instagramUrl = siteLinks.instagram,
  whatsappUrl = siteLinks.whatsapp,
}: FooterProps) {
  const socials = [
    { key: "instagram", href: instagramUrl },
    { key: "telegram", href: telegramUrl },
    { key: "whatsapp", href: whatsappUrl },
  ];

  return (
    <footer id="footer" className="container-page flex flex-col gap-7 overflow-hidden pt-12">
      <div className="h-px w-full bg-line" />

      <Reveal className="flex flex-col gap-10 md:grid md:grid-cols-3 md:items-start">
        <div className="flex items-center gap-2.5">
          <Image src="/images/icons/logo-mark-footer.svg" alt="" width={40} height={38} />
          <span className="text-xl font-extrabold leading-[1.1] text-ink">
            TOP PADEL
            <br />
            ALICANTE
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8 md:mx-auto md:flex md:gap-28">
          <div className="flex flex-col gap-3.5">
            <p className="text-[11px] font-bold tracking-[0.5px] text-lime">НАВИГАЦИЯ</p>
            <div className="flex flex-col gap-2.5 text-sm font-semibold text-ink">
              {footerNav.map((item) => (
                <a key={item.label} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            <p className="text-[11px] font-bold tracking-[0.5px] text-lime">КОНТАКТЫ</p>
            <div className="flex flex-col gap-2.5">
              {footerContacts.map((c) => (
                <div key={c.label} className="flex items-center gap-2.5">
                  <Image src={CONTACT_ICONS[c.icon]} alt="" width={14} height={16} className="h-4 w-3.5 object-contain" />
                  <span className="text-sm font-semibold text-ink">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 md:ml-auto md:w-[300px] md:items-end">
          <p className="text-balance text-xs leading-[1.5] text-grey-2 md:text-right">
            Сообщество игроков и любителей падела в Аликанте. Играем. Тренируемся. Растём{" "}вместе.
          </p>
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                className="flex size-[68px] items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
              >
                <Image src={CONTACT_ICONS[s.key]} alt="" width={12} height={20} className="h-8 w-6 object-contain brightness-0" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="h-px w-full bg-line" />

      <div className="flex flex-col gap-3 py-1.5 text-xs text-grey-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold">© 2026 Top Padel Alicante</p>
        <div className="flex items-center gap-2">
          <span>Политика конфиденциальности</span>
          <span className="size-[3px] rounded-full bg-lime" />
          <span>Cookies</span>
        </div>
      </div>

      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[55%] w-[85%] max-w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-bright/50 blur-[100px]"
        />
        <AnimatedWatermark
          text="TOP PADEL ALICANTE"
          className="footer-watermark-fluid select-none whitespace-nowrap text-center font-black leading-none text-[#e2e2d8]"
        />
      </div>
    </footer>
  );
}
