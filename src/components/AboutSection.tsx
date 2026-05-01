import { useState, useEffect, useMemo } from "react";
import { useGalleryCms } from "@/hooks/useCmsQueries";
import { motion, AnimatePresence } from "framer-motion";

const stats = [
  { value: "9+", label: "Lini Usaha Terintegrasi" },
  { value: "900", label: "Ekor Kambing/Hari (Kebutuhan Pasar)" },
  { value: "5", label: "Misi Strategis" },
  { value: "100+", label: "Binaan & Mitra Aktif" },
];

const misi = [
  "Menyajikan restorasi pertanian kekinian berbasis industri dan kearifan lokal",
  "Fasilitasi sasana magang bagi petani dan generasi muda",
  "Agropreneurship Farm Class yang rekreatif, inovatif, dan inspiratif",
  "Penerapan agro teknologi tepat guna ramah lingkungan",
  "Pengkayaan wawasan budidaya pertanian terintegrasi",
];

const businessCore = [
  "Jasa Penataan & Olah Lahan",
  "Budidaya Melon & Hortikultura",
  "Klaster Perkebunan Buah Tropis",
  "Kawasan Usaha Ternak",
  "Klaster Pupuk Organik",
  "Perikanan Terpadu (Zero Waste)",
  "Agrowisata",
  "Pelatihan & Diklat",
  "Produk Olahan & Kerajinan",
  "Pemasaran & Kemitraan",
];

const AboutSection = () => {
  const { data } = useGalleryCms();
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = useMemo(() => {
    if (data && data.length > 0) {
      return data.map((g) => g.image_url);
    }
    return ["/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bu%20Ina.png"];
  }, [data]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="tentang" className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Tentang Kami</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight max-w-3xl">
            Membangun Ekosistem Industri Pertanian Terintegrasi
          </h2>
        </div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <div className="relative">
            <div className="w-full h-[500px] overflow-hidden rounded-sm relative bg-soil/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentIndex}
                  src={images[currentIndex]}
                  alt="Kegiatan lapangan Jagasura Agrotama bersama petani muda"
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  loading="lazy"
                />
              </AnimatePresence>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-canopy text-primary-foreground p-6 rounded-sm hidden md:block z-10 shadow-lg">
              <p className="font-heading text-2xl font-bold">PT Jagasura</p>
              <p className="font-body text-sm text-primary-foreground/70">Agro Utama</p>
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
              <p className="font-heading text-sm font-semibold text-harvest uppercase tracking-widest mb-2">Platform & Motto</p>
              <p className="font-body text-foreground leading-relaxed italic mb-2">
                "Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan."
              </p>
              <p className="font-heading text-harvest font-bold">
                "Bertani itu Keren dan Berdaya Saing"
              </p>
            </div>
          </div>
        </div>

        {/* Business Core */}
        <div className="mt-12 sm:mt-20">
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8 text-center">Ekosistem Bisnis Kami — Farm · Food · Mart</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
            {businessCore.map((item, i) => (
              <div key={i} className="flex items-center justify-center text-center p-2.5 sm:p-4 bg-card rounded-sm border border-border hover:border-harvest transition-colors">
                <p className="font-body text-xs sm:text-sm text-muted-foreground leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-8 sm:mt-12">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col justify-center text-center p-4 sm:p-6 bg-card rounded-sm border border-border">
              <p className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-harvest">{s.value}</p>
              <p className="font-body text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
