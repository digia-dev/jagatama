import melonImg from "@/assets/product-melon.jpg";
import tropicalImg from "@/assets/product-tropical.jpg";
import hortiImg from "@/assets/product-horticulture.jpg";
import livestockImg from "@/assets/product-livestock.jpg";

interface Product {
  title: string;
  description: string;
  image: string;
  items?: string[];
}

const products: Product[] = [
  {
    title: "Melon Premium",
    description: "Dibudidayakan dalam greenhouse berteknologi tinggi dengan kualitas premium.",
    image: melonImg,
    items: ["Fujisawa (Jepang)", "Inthanon (Belanda)", "Sweet Net (Thailand)", "Chamoe (Korea)", "Rangipo"],
  },
  {
    title: "Buah Tropis",
    description: "Komoditas buah tropis bernilai tinggi dari perkebunan terpadu.",
    image: tropicalImg,
    items: ["Alpukat", "Durian", "Jambu Air", "Jeruk Lemon", "Mangga", "Markisa", "Pepaya"],
  },
  {
    title: "Hortikultura",
    description: "Sayuran dan komoditas hortikultura dengan nilai ekonomi tinggi.",
    image: hortiImg,
    items: ["Cabai", "Kembang Kol", "Kentang", "Lettuce", "Tomat", "Terong", "Timun"],
  },
  {
    title: "Usaha Ternak & RPH",
    description: "Peternakan kambing dan rumah pemotongan hewan berstandar nasional dengan cold storage terintegrasi.",
    image: livestockImg,
  },
];

const ProductsSection = () => {
  return (
    <section id="produk" className="section-padding bg-earth-gradient">
      <div className="max-w-7xl mx-auto">
        <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Produk Kami</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-earth-foreground leading-tight mb-16 max-w-3xl">
          Dari Lahan ke Pasar, <br className="hidden md:block"/>
          Kualitas Tanpa Kompromi
        </h2>

        {/* Product grid — bento style */}
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product, i) => (
            <div
              key={i}
              className={`group relative overflow-hidden rounded-sm ${
                i === 0 ? "md:row-span-2" : ""
              }`}
            >
              <img
                src={product.image}
                alt={product.title}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? "h-full min-h-[400px]" : "h-[320px]"
                }`}
                loading="lazy"
                width={800}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soil/90 via-soil/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-2">{product.title}</h3>
                <p className="font-body text-primary-foreground/70 text-sm mb-3 leading-relaxed">{product.description}</p>
                {product.items && (
                  <div className="flex flex-wrap gap-2">
                    {product.items.slice(0, 5).map((item, j) => (
                      <span
                        key={j}
                        className="bg-primary-foreground/10 text-primary-foreground/80 text-xs font-body px-3 py-1 rounded-full border border-primary-foreground/20"
                      >
                        {item}
                      </span>
                    ))}
                    {product.items.length > 5 && (
                      <span className="text-primary-foreground/50 text-xs font-body px-2 py-1">
                        +{product.items.length - 5} lainnya
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Additional products teaser */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Perikanan Terpadu", "Pupuk Organik", "Ubi Premium", "Produk Kerajinan"].map((item, i) => (
            <div key={i} className="bg-earth/50 border border-primary-foreground/10 rounded-sm p-5 text-center hover:border-harvest/30 transition-all">
              <p className="font-heading text-sm font-semibold text-primary-foreground">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
