import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ArticleCard from "@/components/ArticleCard";
import { articles } from "@/data/articles";
import { ChevronLeft } from "lucide-react";

const Artikel = () => {
  return (
    <>
      <Navbar />
      <main className="bg-cream-gradient pb-20 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20 xl:px-32">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-harvest"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Kembali ke beranda
          </Link>
          <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Artikel</p>
          <h1 className="mb-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">Cerita dari Ladang</h1>
          <p className="mb-14 max-w-2xl font-body text-lg text-muted-foreground">
            Update kegiatan, produk, pelatihan, dan kemitraan dari Jagasura Agrotama.
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default Artikel;
