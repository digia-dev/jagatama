import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { getArticleBySlug, articles as allArticles } from "@/data/articles";
import { ChevronLeft } from "lucide-react";
import { useArticleBySlugCms, useArticlesMerged } from "@/hooks/useCmsQueries";

const SPLIT_AFTER_PARAGRAPH = 2;

const ArticleDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles: allArticlesMerged } = useArticlesMerged();
  const q = useArticleBySlugCms(slug);
  const fallback = slug ? getArticleBySlug(slug) : undefined;
  const article = q.isFetched ? (q.data ?? fallback) : undefined;

  if (q.isError && !fallback) {
    return (
      <>
        <Navbar />
        <main className="bg-cream-gradient pb-24 pt-28 md:pt-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 xl:px-32 text-center">
            <h1 className="mb-4 font-heading text-2xl font-bold text-foreground">Terjadi kesalahan</h1>
            <p className="mb-8 font-body text-muted-foreground">Gagal memuat detail artikel. Silakan coba lagi nanti.</p>
            <Link to="/artikel" className="inline-flex rounded-sm bg-harvest px-6 py-3 font-body font-semibold text-harvest-foreground transition-all hover:brightness-110">
              Kembali ke Berita
            </Link>
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </>
    );
  }

  if (!article && q.isFetched) {
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

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="bg-cream-gradient pb-24 pt-28 md:pt-32">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 xl:px-32 space-y-6">
            <div className="h-8 w-32 animate-pulse rounded-md bg-muted/40" />
            <div className="h-16 w-full animate-pulse rounded-md bg-muted/40" />
            <div className="aspect-video w-full animate-pulse rounded-md bg-muted/40" />
          </div>
        </main>
        <Footer />
        <WhatsAppFloat />
      </>
    );
  }

  const extras = article.extraImages?.length ? article.content.slice(0, SPLIT_AFTER_PARAGRAPH) : null;
  const afterExtras = article.extraImages?.length ? article.content.slice(SPLIT_AFTER_PARAGRAPH) : article.content;

  return (
    <>
      <Navbar />
      <article className="bg-cream-gradient pb-20 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3">
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
            {extras ? (
              <>
                {extras.map((paragraph, i) => (
                  <p key={`a-${i}`} className="font-body text-[17px] leading-[1.75] text-foreground md:text-lg md:leading-[1.8]">
                    {paragraph}
                  </p>
                ))}
                <div className="my-10 grid gap-4 sm:grid-cols-2">
                  {(article.extraImages ?? []).map((item, i) => (
                    <figure key={i} className="overflow-hidden rounded-sm border border-border/60 bg-card/50 shadow-sm">
                      <img src={item.src} alt={item.caption ?? article.title} className="aspect-[4/3] w-full object-cover" width={800} height={600} />
                      {item.caption ? (
                        <figcaption className="border-t border-border/50 px-4 py-3 font-body text-sm leading-snug text-muted-foreground">{item.caption}</figcaption>
                      ) : null}
                    </figure>
                  ))}
                </div>
                {afterExtras.map((paragraph, i) => (
                  <p key={`b-${i}`} className="font-body text-[17px] leading-[1.75] text-foreground md:text-lg md:leading-[1.8]">
                    {paragraph}
                  </p>
                ))}
              </>
            ) : (
              article.content.map((paragraph, i) => (
                <p key={i} className="font-body text-[17px] leading-[1.75] text-foreground md:text-lg md:leading-[1.8]">
                  {paragraph}
                </p>
              ))
            )}
          </div>
        </div>

        <aside className="lg:w-1/3">
          <div className="sticky top-32 space-y-8">
            <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
              <h3 className="font-heading text-lg font-bold text-foreground mb-6">Artikel Terkait</h3>
              <div className="space-y-6">
                {allArticlesMerged
                  .filter((a) => a.category === article.category && a.slug !== article.slug)
                  .slice(0, 3)
                  .map((related) => (
                    <Link 
                      key={related.slug} 
                      to={`/artikel/${related.slug}`}
                      className="group block"
                    >
                      <div className="flex gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border">
                          <img 
                            src={related.image} 
                            alt={related.title} 
                            className="h-full w-full object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-heading text-sm font-bold leading-snug text-foreground group-hover:text-harvest transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="mt-1 font-body text-xs text-muted-foreground">{related.date}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <Link 
                to="/artikel" 
                className="mt-8 inline-flex items-center gap-2 font-body text-sm font-bold text-harvest hover:gap-3 transition-all"
              >
                Lihat Semua Artikel <ChevronLeft className="h-4 w-4 rotate-180" />
              </Link>
            </div>

            <div className="rounded-3xl bg-harvest p-8 text-white shadow-xl shadow-harvest/20">
              <h3 className="font-heading text-xl font-bold mb-3">Ikuti Kabar Jagasura</h3>
              <p className="font-body text-sm text-white/80 mb-6 leading-relaxed">
                Dapatkan update terbaru seputar inovasi pertanian terpadu dan peluang kemitraan.
              </p>
              <a 
                href="https://wa.me/6285743855637" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-white py-3 text-center font-body text-sm font-bold text-harvest hover:bg-white/90 transition-all"
              >
                Hubungi Admin
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </article>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default ArticleDetail;
