import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Games } from "@/components/Games";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Training } from "@/components/Training";
import { heroCards } from "@/lib/content";
import { getArticles } from "@/lib/data/articles";
import { getGalleryImages } from "@/lib/data/gallery";
import { getGalleryCategories } from "@/lib/data/gallery-categories";
import { getGameCards } from "@/lib/data/games";
import { getJournalCategories } from "@/lib/data/journal-categories";
import { getPricingPlans } from "@/lib/data/pricing";
import { getSiteTexts } from "@/lib/data/site-texts";

export default async function Home() {
  const [games, plans, images, galleryCategories, articles, journalCategories, texts] = await Promise.all([
    getGameCards(),
    getPricingPlans(),
    getGalleryImages(),
    getGalleryCategories(),
    getArticles(),
    getJournalCategories(),
    getSiteTexts(),
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
      <Header />
      <main className="flex-1">
        <Hero cards={cards} texts={texts} />
        <Games games={games} />
        <Training plans={plans} texts={texts} />
        <Gallery images={images} categories={galleryCategories} />
        <Community texts={texts} />
        <Journal articles={articles} categories={journalCategories} />
      </main>
      <Footer />
    </>
  );
}
