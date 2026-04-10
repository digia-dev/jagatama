import heroImg from "@/assets/hero-greenhouse.jpg";

const HeroSection = () => {
  return (
    <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Greenhouse rows at Jagasura Farm stretching into golden sunrise"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-canopy/70 via-canopy/50 to-soil/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <p className="animate-reveal animate-reveal-delay-1 text-harvest font-body text-sm md:text-base tracking-[0.3em] uppercase mb-6">
          Sustainable Agriculture · Integrated Farming
        </p>
        <h1 className="animate-reveal animate-reveal-delay-2 font-heading text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-foreground leading-[1.1] mb-6">
          Bertani itu{" "}
          <em className="text-harvest italic font-medium">Keren</em>
          <br />
          dan Berdaya Saing
        </h1>
        <p className="animate-reveal animate-reveal-delay-3 text-primary-foreground/80 font-body text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan melalui pertanian modern yang berkelanjutan.
        </p>
        <div className="animate-reveal animate-reveal-delay-4 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#produk"
            className="bg-harvest text-harvest-foreground font-body font-semibold px-8 py-4 rounded-sm text-base tracking-wide hover:brightness-110 transition-all duration-300"
          >
            Lihat Produk Kami
          </a>
          <a
            href="#kontak"
            className="border-2 border-primary-foreground/40 text-primary-foreground font-body font-medium px-8 py-4 rounded-sm text-base tracking-wide hover:bg-primary-foreground/10 transition-all duration-300"
          >
            Hubungi Kami
          </a>
        </div>

        {/* Dual brand */}
        <div className="animate-reveal animate-reveal-delay-5 mt-16 flex items-center justify-center gap-8 text-primary-foreground/60 text-sm font-body tracking-widest uppercase">
          <span>Jagasura Farm</span>
          <span className="w-px h-5 bg-primary-foreground/30" />
          <span>MJ Farm</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-8 border-2 border-primary-foreground/40 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary-foreground/60 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
