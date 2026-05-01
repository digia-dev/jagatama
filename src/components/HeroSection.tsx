import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-greenhouse.jpg";
import { useHeroCms } from "@/hooks/useCmsQueries";

const CAROUSEL_MS = 7000;

const FB = {
  eyebrow: " PT Jagasura Agrotama Indonesia",
  headline_part1: "Industri Pertanian ",
  headline_highlight: "Terintegrasi",
  headline_part2: " — Ramah Lingkungan, Berkelanjutan & Mandiri",
  description_text:
    "Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan. Farm · Food · Mart dalam satu ekosistem agro terpadu di Tegal, Jawa Tengah.",
  primary_cta_label: "Lihat Produk Kami",
  primary_cta_hash: "produk",
  secondary_cta_label: "Hubungi Kami",
  secondary_cta_hash: "kontak",
  footer_left: "\"Bertani itu Keren dan Berdaya Saing\"",
  footer_right: "Dukuhwaru, Tegal, Jawa Tengah",
};

const HeroSection = () => {
  const { data, isPending } = useHeroCms();
  const [active, setActive] = useState(0);

  const slides = useMemo(
    () => {
      const apiSlides = (data?.slides ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);
      
      // If we are still loading, show fallback slides
      if (isPending || apiSlides.length === 0) {
        return [
          {
            ...FB,
            id: -1,
            image_url: "/produk/Gambar%20Latar/Latar%202.jpg",
          },
          {
            ...FB,
            id: -2,
            image_url: "/produk/Gambar%20Latar/2.jpg",
          },
          {
            ...FB,
            id: -3,
            image_url: "/produk/Gambar%20Latar/5.jpg",
          }
        ];
      }
      return apiSlides;
    },
    [data?.slides, isPending],
  );

  const backgrounds = useMemo(() => {
    return slides.map((s) => s.image_url);
  }, [slides]);

  const slide = slides.length > 0 ? slides[Math.min(active, slides.length - 1)] : null;

  const slideIdsKey = useMemo(() => slides.map((s) => s.id).join(","), [slides]);

  useEffect(() => {
    setActive(0);
  }, [slideIdsKey]);

  useEffect(() => {
    if (active >= slides.length) setActive(0);
  }, [slides.length, active]);

  useEffect(() => {
    if (backgrounds.length <= 1) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const t = window.setInterval(() => {
      setActive((i) => (i + 1) % backgrounds.length);
    }, CAROUSEL_MS);
    return () => window.clearInterval(t);
  }, [backgrounds.length]);

  const t = (field: keyof typeof FB) => {
    if (!slide) return FB[field];
    const v = slide[field as keyof typeof slide];
    if (v == null) return FB[field];
    const s = String(v).trim();
    return s !== "" ? s : FB[field];
  };

  const n = backgrounds.length;
  const goPrev = () => setActive((i) => (i - 1 + n) % n);
  const goNext = () => setActive((i) => (i + 1) % n);

  return (
    <section id="beranda" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24 sm:pt-0">
      <div className="absolute inset-0">
        {backgrounds.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: i === active ? 1 : 0 }}
            width={1920}
            height={1080}
            aria-hidden
            fetchPriority={i === 0 ? "high" : "low"}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-canopy/70 via-canopy/50 to-soil/80" />
      </div>

      {n > 1 ? (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 z-[6] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-foreground/25 bg-black/35 text-primary-foreground shadow-lg backdrop-blur-md transition hover:border-primary-foreground/40 hover:bg-black/45 sm:left-5 sm:h-12 sm:w-12"
            aria-label="Slide sebelumnya"
          >
            <ChevronLeft className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 z-[6] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-primary-foreground/25 bg-black/35 text-primary-foreground shadow-lg backdrop-blur-md transition hover:border-primary-foreground/40 hover:bg-black/45 sm:right-5 sm:h-12 sm:w-12"
            aria-label="Slide berikutnya"
          >
            <ChevronRight className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden />
          </button>
        </>
      ) : null}



      <div key={`hero-copy-${slide?.id ?? "x"}-${active}`} className="relative z-10 mx-auto w-full max-w-5xl px-4 sm:px-6 text-center">
        <h1 className="mb-4 sm:mb-6 font-hero text-3xl sm:text-4xl font-bold !leading-[1.2] text-primary-foreground md:text-5xl lg:text-6xl xl:text-7xl [word-break:break-word] hyphens-auto">
          {t("headline_part1")}{" "}
          <span className="text-harvest">{t("headline_highlight")}</span>{" "}
          {t("headline_part2")}
        </h1>
        <p className="mx-auto mb-8 sm:mb-10 max-w-2xl font-body text-sm sm:text-base leading-relaxed text-primary-foreground/90 md:text-lg">
          {t("description_text")}
        </p>
        <div className="mx-auto flex w-full max-w-xs flex-col items-center justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <Link
            to={{ pathname: "/", hash: t("primary_cta_hash") }}
            className="w-full rounded-sm bg-harvest px-6 py-3 sm:py-4 font-body text-sm sm:text-base font-semibold tracking-wide text-harvest-foreground transition-all duration-300 hover:brightness-110 sm:w-auto sm:px-8 text-center"
          >
            {t("primary_cta_label")}
          </Link>
          <Link
            to={{ pathname: "/", hash: t("secondary_cta_hash") }}
            className="w-full rounded-sm border-2 border-primary-foreground/40 px-6 py-3 sm:py-4 font-body text-sm sm:text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10 sm:w-auto sm:px-8 text-center"
          >
            {t("secondary_cta_label")}
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex h-8 w-5 justify-center rounded-full border-2 border-primary-foreground/40 pt-1.5">
          <div className="h-2 w-1 rounded-full bg-primary-foreground/60" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
