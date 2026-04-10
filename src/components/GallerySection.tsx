import { useState } from "react";
import galleryImg from "@/assets/gallery-greenhouse.jpg";
import heroImg from "@/assets/hero-greenhouse.jpg";
import aboutImg from "@/assets/about-farming.jpg";
import servicesImg from "@/assets/services-training.jpg";
import melonImg from "@/assets/product-melon.jpg";
import livestockImg from "@/assets/product-livestock.jpg";
import { X } from "lucide-react";

const images = [
  { src: heroImg, alt: "Greenhouse aerial view" },
  { src: aboutImg, alt: "Hands planting seedlings" },
  { src: melonImg, alt: "Premium melon cultivation" },
  { src: servicesImg, alt: "Young farmers in training" },
  { src: galleryImg, alt: "Greenhouse interior" },
  { src: livestockImg, alt: "Livestock grazing" },
];

const GallerySection = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-padding bg-canopy-gradient">
      <div className="max-w-7xl mx-auto">
        <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Gallery</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground leading-tight mb-16">
          Jejak Langkah Kami
        </h2>

        {/* Masonry-ish grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-sm cursor-pointer group ${
                i === 0 || i === 4 ? "row-span-2" : ""
              }`}
              onClick={() => setLightbox(i)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 || i === 4 ? "h-full min-h-[300px]" : "h-[200px] md:h-[250px]"
                }`}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-soil/0 group-hover:bg-soil/30 transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-soil/95 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 text-primary-foreground/80 hover:text-primary-foreground"
            onClick={() => setLightbox(null)}
          >
            <X size={32} />
          </button>
          <img
            src={images[lightbox].src}
            alt={images[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-sm"
          />
        </div>
      )}
    </section>
  );
};

export default GallerySection;
