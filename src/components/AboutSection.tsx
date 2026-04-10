import aboutImg from "@/assets/about-farming.jpg";

const stats = [
  { value: "9", label: "Greenhouse" },
  { value: "3,366", label: "m² Lahan Budidaya" },
  { value: "5+", label: "Lini Usaha" },
  { value: "100+", label: "Petani Terbina" },
];

const misi = [
  "Menyajikan restorasi pertanian kekinian berbasis industri dan kearifan lokal",
  "Fasilitasi sasana magang bagi petani dan generasi muda",
  "Agropreneurship Farm Class yang rekreatif, inovatif, dan inspiratif",
  "Penerapan agro teknologi tepat guna ramah lingkungan",
  "Pengkayaan wawasan budidaya pertanian terintegrasi",
];

const AboutSection = () => {
  return (
    <section id="tentang" className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Tentang Kami</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-3xl">
            Membangun Masa Depan Pertanian Indonesia
          </h2>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className="relative">
            <img
              src={aboutImg}
              alt="Tangan petani menanam bibit di tanah yang subur"
              className="w-full h-[500px] object-cover rounded-sm"
              loading="lazy"
              width={1280}
              height={854}
            />
            <div className="absolute -bottom-6 -right-6 bg-canopy text-primary-foreground p-6 rounded-sm hidden md:block">
              <p className="font-heading text-2xl font-bold">PT. Jagasura</p>
              <p className="font-body text-sm text-primary-foreground/70">Agrotama Indonesia</p>
            </div>
          </div>

          {/* Text */}
          <div className="space-y-8">
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">Visi</h3>
              <p className="font-body text-muted-foreground leading-relaxed text-lg">
                Terwujudnya Industri Pertanian ramah lingkungan, berkelanjutan, dan mandiri.
              </p>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-4">Misi</h3>
              <ul className="space-y-3">
                {misi.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className="w-2 h-2 rounded-full bg-harvest mt-2 shrink-0" />
                    <span className="font-body text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card p-6 rounded-sm border border-border">
              <p className="font-body text-sm text-muted-foreground leading-relaxed italic">
                "Regenerasi petani muda menjadi kunci ketahanan pangan Indonesia. Meski pertanian adalah pilar ekonomi nasional, partisipasi generasi milenial masih sangat rendah."
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {stats.map((s, i) => (
            <div key={i} className="text-center p-6 bg-card rounded-sm border border-border">
              <p className="font-heading text-3xl md:text-4xl font-bold text-harvest">{s.value}</p>
              <p className="font-body text-sm text-muted-foreground mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
