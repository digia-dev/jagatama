import { useState, useMemo } from "react";
import galleryImg from "@/assets/gallery-greenhouse.jpg";
import heroImg from "@/assets/hero-greenhouse.jpg";
import aboutImg from "@/assets/about-farming.jpg";
import servicesImg from "@/assets/services-training.jpg";
import melonImg from "@/assets/product-melon.jpg";
import livestockImg from "@/assets/product-livestock.jpg";
import { X } from "lucide-react";
import { useGalleryCms } from "@/hooks/useCmsQueries";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

type GalleryImg = { src: string; alt: string; key: string | number };

const GallerySection = () => {
  const { data, isPending } = useGalleryCms();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const images: GalleryImg[] = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((g) => ({
        src: g.image_url,
        alt: g.alt_text || "Gallery",
        key: g.id,
      }));
    }
    return [];
  }, [data]);

  return (
    <section id="gallery" className="section-padding bg-canopy-gradient">
      <div className="mx-auto max-w-7xl relative px-4 md:px-12">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Gallery</p>
        <h2 className="mb-12 md:mb-16 font-heading text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
          Jejak Langkah Kami
        </h2>

        <Carousel
          opts={{ align: "start", loop: true }}
          className={`w-full ${isPending ? "opacity-90" : ""}`}
        >
          <CarouselContent className="-ml-3 md:-ml-4">
            {images.map((img, i) => (
              <CarouselItem key={img.key} className="pl-3 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3">
                <div
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
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-black/20 border-primary-foreground/20 text-primary-foreground hover:bg-black/40 hover:text-white" />
          <CarouselNext className="hidden md:flex -right-12 bg-black/20 border-primary-foreground/20 text-primary-foreground hover:bg-black/40 hover:text-white" />
        </Carousel>
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
