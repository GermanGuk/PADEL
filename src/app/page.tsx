import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Games } from "@/components/Games";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Training } from "@/components/Training";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { heroCards } from "@/lib/content";
import { getArticles } from "@/lib/data/articles";
import { getGalleryImages } from "@/lib/data/gallery";
import { getGalleryCategories } from "@/lib/data/gallery-categories";
import { getGameCards } from "@/lib/data/games";
import { getJournalCategories } from "@/lib/data/journal-categories";
import { getPricingPlans } from "@/lib/data/pricing";
import { getSettings } from "@/lib/data/settings";
import { getSiteTexts } from "@/lib/data/site-texts";

export default async function Home() {
  const [games, plans, images, galleryCategories, articles, journalCategories, texts, settings] = await Promise.all([
    getGameCards(),
    getPricingPlans(),
    getGalleryImages(),
    getGalleryCategories(),
    getArticles(),
    getJournalCategories(),
    getSiteTexts(),
    getSettings(),
  ]);

  // The Hero's "featured game" tile mirrors whichever game is marked
  // `featured` in /admin/games, so the owner only edits it in one place.
  const featuredGame = games.find((g) => g.featured);
  const cards = featuredGame
    ? heroCards.map((card) =>
        card.featured
          ? {
              ...card,
              title: featuredGame.title,
              meta: featuredGame.meta.find((m) => m.icon === "clock")?.text ?? card.meta,
              image: featuredGame.image ?? card.image,
            }
          : card
      )
    : heroCards;

  return (
    <>
      <Header telegramUrl={settings.telegramUrl ?? undefined} />
      <main className="flex-1">
        <Hero cards={cards} texts={texts} />
        <WaveDivider />
        <Games games={games} />
        <Training plans={plans} texts={texts} />
        <Gallery images={images} categories={galleryCategories} />
        <Community texts={texts} />
        <Journal articles={articles} categories={journalCategories} />
      </main>
      <Footer
        telegramUrl={settings.telegramUrl ?? undefined}
        instagramUrl={settings.instagramUrl ?? undefined}
        whatsappUrl={settings.whatsappUrl ?? undefined}
      />
    </>
  );
}
