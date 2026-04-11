import { Link } from "react-router-dom";
import heroImg from "@/assets/hero-greenhouse.jpg";

const HeroSection = () => {
  return (
    <section id="beranda" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Greenhouse rows at Jagasura Farm stretching into golden sunrise"
          className="h-full w-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-canopy/70 via-canopy/50 to-soil/80" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="animate-reveal animate-reveal-delay-1 mb-6 font-body text-sm uppercase tracking-[0.25em] text-harvest md:text-base md:tracking-[0.3em]">
          PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi
        </p>
        <h1 className="animate-reveal animate-reveal-delay-2 mb-6 font-hero text-4xl font-bold leading-[1.12] text-primary-foreground md:text-5xl lg:text-6xl xl:text-7xl">
          Operasi agro terpadu:{" "}
          <span className="text-harvest">budidaya</span>, edukasi, dan nilai tambah berkelanjutan
        </h1>
        <p className="animate-reveal animate-reveal-delay-3 mx-auto mb-10 max-w-xl font-body text-base leading-relaxed text-primary-foreground/85 md:text-lg">
          Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.
        </p>
        <div className="animate-reveal animate-reveal-delay-4 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to={{ pathname: "/", hash: "produk" }}
            className="rounded-sm bg-harvest px-8 py-4 font-body text-base font-semibold tracking-wide text-harvest-foreground transition-all duration-300 hover:brightness-110"
          >
            Lihat Produk Kami
          </Link>
          <Link
            to={{ pathname: "/", hash: "kontak" }}
            className="rounded-sm border-2 border-primary-foreground/40 px-8 py-4 font-body text-base font-medium text-primary-foreground transition-all duration-300 hover:bg-primary-foreground/10"
          >
            Hubungi Kami
          </Link>
        </div>

        <div className="animate-reveal animate-reveal-delay-5 mt-16 flex items-center justify-center gap-6 text-sm font-body uppercase tracking-widest text-primary-foreground/60 sm:gap-8">
          <span>Jagasura Farm</span>
          <span className="h-5 w-px bg-primary-foreground/30" />
          <span>MJ Farm</span>
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
