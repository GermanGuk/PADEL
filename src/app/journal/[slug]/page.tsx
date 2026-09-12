import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug } from "@/lib/data/articles";
import { getJournalCategories } from "@/lib/data/journal-categories";
import { getSettings } from "@/lib/data/settings";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [categories, settings] = await Promise.all([getJournalCategories(), getSettings()]);
  const categoryName = categories.find((c) => c.id === article.categoryId)?.name;

  return (
    <>
      <Header telegramUrl={settings.telegramUrl ?? undefined} />
      <main className="flex-1">
        <article className="container-page section-pad flex flex-col gap-8">
          <Link href="/#journal" className="w-fit text-[13px] font-medium text-ink">
            ← Все статьи
          </Link>

          <div className="flex flex-col gap-4">
            {categoryName && <p className="text-sm font-bold tracking-[0.5px] text-lime">{categoryName}</p>}
            <h1 className="h2-fluid font-extrabold text-ink">{article.title}</h1>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={article.cover}
              alt=""
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
              unoptimized={article.cover.startsWith("http")}
            />
          </div>

          <div className="max-w-[700px] whitespace-pre-line text-base leading-[1.7] text-grey-1">
            {article.body}
          </div>
        </article>
      </main>
      <Footer
        telegramUrl={settings.telegramUrl ?? undefined}
        instagramUrl={settings.instagramUrl ?? undefined}
        whatsappUrl={settings.whatsappUrl ?? undefined}
      />
    </>
  );
}
