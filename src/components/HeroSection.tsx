import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-greenhouse.jpg";
import { useHeroCms } from "@/hooks/useCmsQueries";

const CAROUSEL_MS = 7000;

const FB = {
  eyebrow: "PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi",
  headline_part1: "Operasi agro terpadu: ",
  headline_highlight: "budidaya",
  headline_part2: ", edukasi, dan nilai tambah berkelanjutan",
  description_text:
    "Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.",
  primary_cta_label: "Lihat Produk Kami",
  primary_cta_hash: "produk",
  secondary_cta_label: "Hubungi Kami",
  secondary_cta_hash: "kontak",
  footer_left: "Jagasura Farm",
  footer_right: "MJ Farm",
};

const HeroSection = () => {
  const { data, isPending } = useHeroCms();
  const [active, setActive] = useState(0);

  const slides = useMemo(
    () =>
      (data?.slides ?? [])
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id),
    [data?.slides],
  );

  const backgrounds = useMemo(() => {
    if (slides.length === 0) return [heroImg];
    return slides.map((s) => {
      const u = s.image_url.trim();
      return u || heroImg;
    });
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
    <section id="beranda" className="relative flex min-h-screen items-center justify-center overflow-hidden">
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

      {backgrounds.length > 1 ? (
        <div
          className="absolute bottom-24 left-1/2 z-[5] flex -translate-x-1/2 gap-2 sm:bottom-28"
          role="tablist"
          aria-label="Hero slides"
        >
          {backgrounds.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-primary-foreground" : "w-2 bg-primary-foreground/35 hover:bg-primary-foreground/55"}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      ) : null}

      <div key={`hero-copy-${slide?.id ?? "x"}-${active}`} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p
          className={`mb-6 font-body text-sm uppercase tracking-[0.25em] text-harvest md:text-base md:tracking-[0.3em] ${isPending ? "opacity-90" : ""}`}
        >
          {t("eyebrow")}
        </p>
        <h1 className="mb-6 font-hero text-4xl font-bold leading-[1.12] text-primary-foreground md:text-5xl lg:text-6xl xl:text-7xl">
          {t("headline_part1")}
          <span className="text-harvest">{t("headline_highlight")}</span>
          {t("headline_part2")}
        </h1>
        <p className="mx-auto mb-10 max-w-xl font-body text-base leading-relaxed text-primary-foreground/85 md:text-lg">
          {t("description_text")}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to={{ pathname: "/", hash: t("primary_cta_hash") }}
            className="rounded-sm bg-harvest px-8 py-4 font-body text-base font-semibold tracking-wide text-harvest-foreground transition-all duration-300 hover:brightness-110"
          >
            {t("primary_cta_label")}
          </Link>
          <Link
            to={{ pathname: "/", hash: t("secondary_cta_hash") }}
            className="rounded-sm border-2 border-primary-foreground/40 px-8 py-4 font-body text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10"
          >
            {t("secondary_cta_label")}
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-6 text-sm font-body uppercase tracking-widest text-primary-foreground/60 sm:gap-8">
          <span>{t("footer_left")}</span>
          <span className="h-5 w-px bg-primary-foreground/30" />
          <span>{t("footer_right")}</span>
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
