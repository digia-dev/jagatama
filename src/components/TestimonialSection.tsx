import { useQuery } from "@tanstack/react-query";
import { cmsFetch } from "@/lib/cmsApi";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar_url: string;
  rating: number;
  is_active: number;
  sort_order: number;
};

// Static fallback data
const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "H. Umi Azizah",
    role: "Bupati Kabupaten Tegal",
    content: "Program Jagasura Agrotama sangat mendukung ketahanan pangan dan kemandirian ekonomi petani muda di Tegal. Ekosistem pertanian terintegrasi seperti ini perlu terus dikembangkan.",
    avatar_url: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bupati%20Tegal.png",
    rating: 5,
    is_active: 1,
    sort_order: 1,
  },
  {
    id: 2,
    name: "Rektor UMT",
    role: "Universitas Muhammadiyah Tegal",
    content: "Kolaborasi antara perguruan tinggi dan lembaga pertanian seperti Jagasura adalah kunci mencetak petani muda yang berpendidikan, inovatif, dan mandiri.",
    avatar_url: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Rektor%20UMT.jpg",
    rating: 5,
    is_active: 1,
    sort_order: 2,
  },
  {
    id: 3,
    name: "Pimpinan Baznaz",
    role: "Baznaz Cirebon",
    content: "Melalui program zakat produktif, kemitraan dengan Jagasura Agrotama menjadi model pemberdayaan ekonomi umat yang nyata dan berkelanjutan.",
    avatar_url: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Baznaz%20Cirebon.png",
    rating: 5,
    is_active: 1,
    sort_order: 3,
  },
];

const TestimonialSection = () => {
  const { data } = useQuery<Testimonial[]>({
    queryKey: ["cms", "testimonials", "public"],
    queryFn: async () => {
      try {
        const d = await cmsFetch("testimonials.php?active=1");
        if (!Array.isArray(d) || d.length === 0) return fallbackTestimonials;
        return d as Testimonial[];
      } catch {
        return fallbackTestimonials;
      }
    },
    staleTime: 60_000,
  });

  const testimonials = data ?? fallbackTestimonials;

  return (
    <section id="testimoni" className="section-padding bg-cream-gradient">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14">
          <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">
            Testimoni
          </p>
          <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Dipercaya Mitra &amp; Pemangku Kepentingan
          </h2>
        </div>

        {/* Testimonial Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="pl-4 md:pl-6 md:basis-1/2 lg:basis-1/3">
                <div className="group relative flex flex-col h-full rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-harvest/30 hover:shadow-md">
                  {/* Quote mark */}
                  <span
                    className="pointer-events-none absolute right-6 top-4 font-heading text-5xl font-bold text-harvest/10 select-none"
                    aria-hidden
                  >
                    "
                  </span>

                  {/* Stars */}
                  <div className="mb-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-harvest text-harvest" : "text-border"}`} />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="mb-6 flex-1 font-body text-sm leading-relaxed text-muted-foreground italic">
                    "{t.content}"
                  </blockquote>

                  {/* Person */}
                  <div className="flex items-center gap-4 mt-auto">
                    {t.avatar_url ? (
                      <img
                        src={t.avatar_url}
                        alt={t.name}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-harvest/20"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-harvest/10 text-lg font-bold text-harvest ring-2 ring-harvest/20">
                        {t.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-heading text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="font-body text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-12 bg-card text-foreground hover:bg-harvest hover:text-primary-foreground border-border" />
            <CarouselNext className="-right-12 bg-card text-foreground hover:bg-harvest hover:text-primary-foreground border-border" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;
