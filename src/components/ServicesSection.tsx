import servicesImg from "@/assets/services-training.jpg";
import { Sprout, Leaf, Warehouse, GraduationCap, Recycle } from "lucide-react";

const coreActivities = [
  { icon: GraduationCap, label: "Diklat dan Permagangan" },
  { icon: Recycle, label: "Pengolahan Pupuk Organik" },
  { icon: Warehouse, label: "Bank Pakan Ternak" },
  { icon: Leaf, label: "Edukasi Kemandirian Ekonomi Hijau" },
  { icon: Sprout, label: "Aneka Jasa dan Produk Olahan Turunan" },
];

const ecosystem = [
  "Jasa Penataan dan Olah Lahan",
  "Budidaya Melon dan Hortikultura",
  "Klaster Perkebunan Buah Tropis",
  "Kawasan Usaha Ternak",
  "Klaster Pupuk Organik",
  "Perikanan Terpadu (Zero Waste)",
  "Agrowisata & Pelatihan",
  "Produk Kerajinan & Kemitraan",
];

const ServicesSection = () => {
  return (
    <section id="layanan" className="section-padding bg-cream-gradient">
      <div className="max-w-7xl mx-auto">
        <p className="text-harvest font-body text-sm tracking-[0.25em] uppercase mb-3">Layanan Kami</p>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4 max-w-3xl">
          Ekosistem Pertanian Terintegrasi
        </h2>
        <p className="font-body text-muted-foreground text-lg mb-16 max-w-2xl">
          Dikelola oleh Koperasi Satria Tani Hanggawana — tiga pilar utama: Farm, Food, dan Mart.
        </p>

        {/* Full-bleed image */}
        <div className="relative mb-16 rounded-sm overflow-hidden">
          <img
            src={servicesImg}
            alt="Petani muda berlatih di greenhouse modern"
            className="w-full h-[400px] object-cover"
            loading="lazy"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/60 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <p className="font-heading text-2xl font-bold text-primary-foreground">Farm · Food · Mart</p>
            <p className="font-body text-primary-foreground/70 text-sm mt-1">Tiga pilar ekosistem bisnis terpadu</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Core Activities */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-harvest" />
              Aktivitas Utama
            </h3>
            <div className="space-y-4">
              {coreActivities.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-card border border-border rounded-sm hover:border-harvest/30 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-canopy/10 flex items-center justify-center shrink-0 group-hover:bg-harvest/10 transition-colors">
                    <item.icon size={18} className="text-canopy group-hover:text-harvest transition-colors" />
                  </div>
                  <p className="font-body text-foreground font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-harvest" />
              Ekosistem Bisnis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ecosystem.map((item, i) => (
                <div key={i} className="p-4 bg-card border border-border rounded-sm hover:border-harvest/30 transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-harvest rounded-full shrink-0" />
                    <p className="font-body text-sm text-foreground">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
