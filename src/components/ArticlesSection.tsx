import galleryImg from "@/assets/gallery-greenhouse.jpg";

const articles = [
  {
    title: "Regenerasi Petani Muda: Tantangan dan Peluang di Era Modern",
    excerpt: "Indonesia membutuhkan generasi baru petani yang tidak hanya memahami cara bercocok tanam, tetapi juga menguasai teknologi dan bisnis.",
    category: "Agro-Education",
    date: "15 Mar 2026",
  },
  {
    title: "Melon Premium Jagasura Farm Tembus Pasar Nasional",
    excerpt: "Dengan budidaya greenhouse berteknologi tinggi, melon varietas Fujisawa dan Inthanon berhasil memasuki pasar premium.",
    category: "Product Update",
    date: "8 Mar 2026",
  },
  {
    title: "Pelatihan Pertanian Terpadu Batch ke-12 Dibuka",
    excerpt: "Program magang dan pelatihan pertanian terpadu untuk generasi muda kembali dibuka dengan kuota terbatas.",
    category: "Training",
    date: "1 Mar 2026",
  },
];

const ArticlesSection = () => {
  return (
    <section id="artikel" className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Artikel</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-16">
          Cerita dari Ladang
        </h2>

        <div className="grid lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <article
              key={i}
              className="group bg-card border border-border rounded-sm overflow-hidden hover:border-harvest/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={galleryImg}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={1280}
                  height={720}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-harvest text-harvest-foreground text-xs font-body font-semibold px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="font-body text-xs text-muted-foreground mb-3">{article.date}</p>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2 leading-snug group-hover:text-harvest transition-colors">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
