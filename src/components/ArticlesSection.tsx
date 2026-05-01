import { Link } from "react-router-dom";
import ArticleCard from "@/components/ArticleCard";
import { ArrowRight } from "lucide-react";
import { useArticlesMerged } from "@/hooks/useCmsQueries";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const ArticlesSection = () => {
  const { articles } = useArticlesMerged();
  const previewArticles = articles.slice(0, 3);

  return (
    <section id="artikel" className="section-padding bg-cream-gradient">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Artikel</p>
        <h2 className="mb-16 font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">Cerita dari Ladang</h2>

        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {previewArticles.map((article) => (
              <CarouselItem key={article.slug} className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 lg:basis-1/3">
                <ArticleCard article={article} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="mt-12 flex justify-center md:mt-14">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-8 py-4 font-body text-base font-semibold text-foreground transition-all hover:border-harvest/40 hover:bg-secondary/60"
          >
            Lihat semua artikel
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
