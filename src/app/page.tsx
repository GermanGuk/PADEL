import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Games } from "@/components/Games";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Training } from "@/components/Training";
import { WaveDivider } from "@/components/ui/WaveDivider";
import { getArticles } from "@/lib/data/articles";
import { getCommunityContent } from "@/lib/data/community";
import { getGalleryImages } from "@/lib/data/gallery";
import { getGalleryCategories } from "@/lib/data/gallery-categories";
import { getGameCards } from "@/lib/data/games";
import { getHeroCards } from "@/lib/data/hero-cards";
import { getJournalCategories } from "@/lib/data/journal-categories";
import { getPricingPlans } from "@/lib/data/pricing";
import { getSettings } from "@/lib/data/settings";
import { getSiteTexts } from "@/lib/data/site-texts";

export default async function Home() {
  const [cards, games, plans, images, galleryCategories, articles, journalCategories, texts, settings, community] =
    await Promise.all([
      getHeroCards(),
      getGameCards(),
      getPricingPlans(),
      getGalleryImages(),
      getGalleryCategories(),
      getArticles(),
      getJournalCategories(),
      getSiteTexts(),
      getSettings(),
      getCommunityContent(),
    ]);

  return (
    <>
      <Header telegramUrl={settings.telegramUrl ?? undefined} />
      <main className="flex-1">
        <Hero cards={cards} texts={texts} />
        <WaveDivider />
        <Games games={games} />
        <Training plans={plans} texts={texts} />
        <Gallery images={images} categories={galleryCategories} instagramUrl={settings.instagramUrl ?? undefined} />
        <Community content={community} />
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
