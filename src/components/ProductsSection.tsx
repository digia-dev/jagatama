import { useState } from "react";
import melonImg from "@/assets/product-melon.jpg";
import tropicalImg from "@/assets/product-tropical.jpg";
import hortiImg from "@/assets/product-horticulture.jpg";
import livestockImg from "@/assets/product-livestock.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight } from "lucide-react";

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
  const [active, setActive] = useState<Product | null>(null);

  return (
    <section id="produk" className="section-padding bg-earth-gradient">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Produk Kami</p>
        <h2 className="mb-16 max-w-3xl font-heading text-3xl font-bold leading-tight text-earth-foreground md:text-5xl">
          Dari Lahan ke Pasar, <br className="hidden md:block" />
          Kualitas Tanpa Kompromi
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {products.map((product) => (
            <button
              key={product.title}
              type="button"
              onClick={() => setActive(product)}
              className="group relative flex h-[380px] w-full cursor-pointer overflow-hidden rounded-sm text-left outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-harvest focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={800}
                height={800}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/40 to-transparent" />
              <div className="relative mt-auto flex w-full flex-col p-5 md:p-6">
                <h3 className="mb-2 font-heading text-xl font-bold text-primary-foreground md:text-2xl">{product.title}</h3>
                <p className="mb-4 line-clamp-2 font-body text-sm leading-relaxed text-primary-foreground/75">{product.description}</p>
                <span className="inline-flex items-center gap-1 font-body text-xs font-semibold uppercase tracking-wider text-harvest">
                  Detail
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </button>
          ))}
        </div>

        <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
          <DialogContent
            className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden overflow-y-auto border border-harvest/25 bg-earth-gradient p-0 text-primary-foreground shadow-2xl shadow-black/40 sm:rounded-sm [&>button]:text-primary-foreground/85 [&>button]:ring-offset-soil [&>button]:hover:bg-primary-foreground/10 [&>button]:hover:text-primary-foreground"
          >
            {active && (
              <>
                <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56">
                  <img src={active.image} alt={active.title} className="h-full w-full object-cover" width={960} height={400} />
                  <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/35 to-transparent" />
                </div>
                <div className="border-t border-primary-foreground/10 px-6 pb-7 pt-6 sm:px-8 sm:pb-8">
                  <DialogHeader className="space-y-3 text-left">
                    <DialogTitle className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">{active.title}</DialogTitle>
                    <p className="font-body text-base leading-relaxed text-primary-foreground/75">{active.description}</p>
                  </DialogHeader>
                  {active.items && active.items.length > 0 && (
                    <div className="mt-6 border-t border-primary-foreground/10 pt-6">
                      <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-harvest">Varian dan komoditas</p>
                      <ul className="flex flex-wrap gap-2">
                        {active.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1.5 font-body text-sm text-primary-foreground/90"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProductsSection;
