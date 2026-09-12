import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { Games } from "@/components/Games";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Training } from "@/components/Training";
import { getArticles } from "@/lib/data/articles";
import { getGalleryImages } from "@/lib/data/gallery";
import { getGameCards } from "@/lib/data/games";
import { getPricingPlans } from "@/lib/data/pricing";
import { getSiteTexts } from "@/lib/data/site-texts";

export default async function Home() {
  const [games, plans, images, articles, texts] = await Promise.all([
    getGameCards(),
    getPricingPlans(),
    getGalleryImages(),
    getArticles(),
    getSiteTexts(),
  ]);

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero texts={texts} />
        <Games games={games} />
        <Training plans={plans} texts={texts} />
        <Gallery images={images} />
        <Community texts={texts} />
        <Journal articles={articles} />
      </main>
      <Footer />
    </>
  );
}
