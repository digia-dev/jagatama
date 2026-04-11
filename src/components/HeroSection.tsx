import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-greenhouse.jpg";
import { useHeroCms } from "@/hooks/useCmsQueries";

const HeroSection = () => {
  const { data, isPending } = useHeroCms();

  const imageUrl = data?.image_url && data.image_url.length > 0 ? data.image_url : heroImg;
  const eyebrow =
    data?.eyebrow ||
    "PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi";
  const h1Before = data?.headline_part1 ?? "Operasi agro terpadu: ";
  const h1Highlight = data?.headline_highlight ?? "budidaya";
  const h1After = data?.headline_part2 ?? ", edukasi, dan nilai tambah berkelanjutan";
  const description =
    data?.description_text ||
    "Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.";
  const primaryLabel = data?.primary_cta_label ?? "Lihat Produk Kami";
  const primaryHash = data?.primary_cta_hash ?? "produk";
  const secondaryLabel = data?.secondary_cta_label ?? "Hubungi Kami";
  const secondaryHash = data?.secondary_cta_hash ?? "kontak";
  const footerLeft = data?.footer_left ?? "Jagasura Farm";
  const footerRight = data?.footer_right ?? "MJ Farm";

  return (
    <section id="beranda" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={typeof imageUrl === "string" ? imageUrl : heroImg}
          alt=""
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-canopy/70 via-canopy/50 to-soil/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p
          className={`animate-reveal animate-reveal-delay-1 mb-6 font-body text-sm uppercase tracking-[0.25em] text-harvest md:text-base md:tracking-[0.3em] ${isPending ? "opacity-90" : ""}`}
        >
          {eyebrow}
        </p>
        <h1 className="animate-reveal animate-reveal-delay-2 mb-6 font-hero text-4xl font-bold leading-[1.12] text-primary-foreground md:text-5xl lg:text-6xl xl:text-7xl">
          {h1Before}
          <span className="text-harvest">{h1Highlight}</span>
          {h1After}
        </h1>
        <p className="animate-reveal animate-reveal-delay-3 mx-auto mb-10 max-w-xl font-body text-base leading-relaxed text-primary-foreground/85 md:text-lg">
          {description}
        </p>
        <div className="animate-reveal animate-reveal-delay-4 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to={{ pathname: "/", hash: primaryHash }}
            className="rounded-sm bg-harvest px-8 py-4 font-body text-base font-semibold tracking-wide text-harvest-foreground transition-all duration-300 hover:brightness-110"
          >
            {primaryLabel}
          </Link>
          <Link
            to={{ pathname: "/", hash: secondaryHash }}
            className="rounded-sm border-2 border-primary-foreground/40 px-8 py-4 font-body text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10"
          >
            {secondaryLabel}
          </Link>
        </div>

        <div className="animate-reveal animate-reveal-delay-5 mt-16 flex items-center justify-center gap-6 text-sm font-body uppercase tracking-widest text-primary-foreground/60 sm:gap-8">
          <span>{footerLeft}</span>
          <span className="h-5 w-px bg-primary-foreground/30" />
          <span>{footerRight}</span>
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
