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
    <section id="layanan" className="bg-cream-gradient px-6 pb-20 pt-28 md:px-12 md:pb-28 md:pt-36 lg:px-20 xl:px-32">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Layanan Kami</p>
        <h1 className="mb-4 max-w-3xl font-heading text-3xl font-bold leading-tight text-foreground md:text-5xl">Ekosistem Pertanian Terintegrasi</h1>
        <p className="mb-12 max-w-2xl font-body text-lg text-muted-foreground md:mb-16">
          Dikelola oleh Koperasi Satria Tani Hanggawana — tiga pilar utama: Farm, Food, dan Mart.
        </p>

        <div className="relative mb-14 overflow-hidden rounded-2xl border border-border/60 shadow-xl shadow-soil/10 ring-1 ring-border/40 md:mb-20">
          <img
            src={servicesImg}
            alt="Petani muda berlatih di greenhouse modern"
            className="h-[280px] w-full object-cover sm:h-[360px] md:h-[420px]"
            loading="lazy"
            width={1280}
            height={720}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-soil/75 via-soil/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <p className="font-heading text-2xl font-bold text-primary-foreground md:text-3xl">Farm · Food · Mart</p>
            <p className="mt-2 max-w-md font-body text-sm text-primary-foreground/80 md:text-base">Tiga pilar ekosistem bisnis terpadu untuk ketahanan dan nilai tambah berkelanjutan.</p>
          </div>
        </div>

        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
              <span className="h-px w-12 bg-harvest" />
              <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">Aktivitas Utama</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              {coreActivities.map((item, i) => (
                <div
                  key={i}
                  className="group flex flex-col rounded-2xl border border-border/80 bg-gradient-to-br from-card to-secondary/30 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-harvest/40 hover:shadow-lg hover:shadow-harvest/5 md:p-6"
                >
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-canopy/15 to-harvest/15 ring-1 ring-canopy/10 transition-transform duration-300 group-hover:scale-105 group-hover:from-canopy/25 group-hover:to-harvest/20">
                    <item.icon size={22} className="text-canopy transition-colors group-hover:text-harvest" strokeWidth={1.75} />
                  </div>
                  <p className="font-heading text-base font-semibold leading-snug text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
              <span className="h-px w-12 bg-harvest" />
              <h2 className="font-heading text-xl font-semibold text-foreground md:text-2xl">Ekosistem Bisnis</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {ecosystem.map((item, i) => (
                <div
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-harvest/35 hover:shadow-md md:p-6"
                >
                  <span className="pointer-events-none absolute -right-1 -top-2 font-heading text-4xl font-bold tabular-nums text-harvest/[0.12] transition-colors group-hover:text-harvest/[0.18] md:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative flex items-start gap-3 pr-10">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-harvest to-canopy-light ring-2 ring-harvest/20" />
                    <p className="font-body text-sm font-medium leading-relaxed text-foreground md:text-[15px]">{item}</p>
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
