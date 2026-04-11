import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getArticleBySlug } from "@/data/articles";
import { ChevronLeft } from "lucide-react";

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? getArticleBySlug(slug) : undefined;

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="bg-cream-gradient pb-24 pt-28 md:pt-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 xl:px-32">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-4 font-heading text-2xl font-bold text-foreground md:text-3xl">Artikel tidak ditemukan</h1>
              <p className="mb-8 font-body text-muted-foreground">Tautan mungkin sudah tidak berlaku atau alamat salah.</p>
              <Link to="/artikel" className="inline-flex rounded-sm bg-harvest px-6 py-3 font-body font-semibold text-harvest-foreground transition-all hover:brightness-110">
                Ke daftar artikel
              </Link>
            </div>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <article className="bg-cream-gradient pb-20 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 xl:px-32">
          <Link
            to="/artikel"
            className="mb-8 inline-flex items-center gap-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-harvest"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Semua artikel
          </Link>

          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-harvest/15 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-harvest">{article.category}</span>
              <time className="font-body text-sm text-muted-foreground" dateTime={article.date}>
                {article.date}
              </time>
            </div>
            <h1 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">{article.title}</h1>
            <p className="mt-6 border-l-4 border-harvest/60 pl-4 font-body text-lg leading-relaxed text-muted-foreground md:text-xl">{article.excerpt}</p>
          </header>

          <figure className="mb-10 overflow-hidden rounded-sm">
            <img src={article.image} alt={article.title} className="aspect-[21/9] w-full object-cover md:aspect-[2/1]" width={1200} height={600} />
          </figure>

          <div className="article-body space-y-6 border-t border-border pt-10">
            {article.content.map((paragraph, i) => (
              <p key={i} className="font-body text-[17px] leading-[1.75] text-foreground md:text-lg md:leading-[1.8]">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default ArticleDetail;
