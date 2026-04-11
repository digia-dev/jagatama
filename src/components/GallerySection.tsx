import { useState } from "react";
import galleryImg from "@/assets/gallery-greenhouse.jpg";
import heroImg from "@/assets/hero-greenhouse.jpg";
import aboutImg from "@/assets/about-farming.jpg";
import servicesImg from "@/assets/services-training.jpg";
import melonImg from "@/assets/product-melon.jpg";
import livestockImg from "@/assets/product-livestock.jpg";
import { X } from "lucide-react";
import { useGalleryCms } from "@/hooks/useCmsQueries";

const staticImages = [
  { src: heroImg, alt: "Greenhouse aerial view" },
  { src: aboutImg, alt: "Hands planting seedlings" },
  { src: melonImg, alt: "Premium melon cultivation" },
  { src: servicesImg, alt: "Young farmers in training" },
  { src: galleryImg, alt: "Greenhouse interior" },
  { src: livestockImg, alt: "Livestock grazing" },
];

type GalleryImg = { src: string; alt: string; key: string | number };

const GallerySection = () => {
  const { data, isPending } = useGalleryCms();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const images: GalleryImg[] =
    data && data.length > 0
      ? data.map((g) => ({
          src: g.image_url,
          alt: g.alt_text || "Gallery",
          key: g.id,
        }))
      : staticImages.map((g, i) => ({ ...g, key: `s-${i}` }));

  return (
    <section id="gallery" className="section-padding bg-canopy-gradient">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Gallery</p>
        <h2 className="mb-16 font-heading text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
          Jejak Langkah Kami
        </h2>

        <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 ${isPending ? "opacity-90" : ""}`}>
          {images.map((img, i) => (
            <div
              key={img.key}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-sm"
              onClick={() => setLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-soil/0 transition-all duration-300 group-hover:bg-soil/30" />
            </div>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-soil/95 p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-primary-foreground/80 hover:text-primary-foreground"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <img
            src={images[lightbox]?.src}
            alt={images[lightbox]?.alt ?? ""}
            className="max-h-[85vh] max-w-full rounded-sm object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
