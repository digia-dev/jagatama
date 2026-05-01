import { whatsappContacts } from "@/data/whatsappContacts";
import { MessageSquare, Users, Sprout } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const programs = [
  {
    icon: Sprout,
    title: "Magang & Praktek Langsung",
    description:
      "Tempat magang dan praktek kerja langsung di lahan budidaya Jagasura. Dapatkan pengalaman nyata di greenhouse, kebun buah tropis, dan kawasan peternakan.",
    waText:
      "Halo Admin Jagasura 👋\n\nSaya tertarik mendaftar program *Magang & Praktek Kerja* di Jagasura Agrotama.\n\nBoleh info syarat dan jadwal pendaftaran?\n\nTerima kasih 🌾",
    badge: "Gratis",
    badgeColor: "bg-canopy/15 text-canopy",
  },
  {
    icon: Users,
    title: "Beasiswa Petani Muda",
    description:
      "Beasiswa pertanian untuk calon petani muda yang maju, mandiri, dan modern. Didukung Koperasi Satria Tani Hanggawana dan mitra strategis.",
    waText:
      "Halo Admin Jagasura 👋\n\nSaya tertarik mendaftar *Beasiswa Petani Muda* Jagasura Agrotama.\n\nBoleh info persyaratan dan cara pendaftarannya?\n\nTerima kasih 🌾",
    badge: "Beasiswa",
    badgeColor: "bg-harvest/15 text-harvest",
  },
  {
    icon: MessageSquare,
    title: "Kemitraan Usaha Pertanian",
    description:
      "Program penempatan dan kemitraan usaha pertanian. Bergabung sebagai mitra petani, distributor, atau investor dalam ekosistem Farm · Food · Mart.",
    waText:
      "Halo Admin Jagasura 👋\n\nSaya tertarik menjalin *Kemitraan Usaha Pertanian* dengan Jagasura Agrotama.\n\nBoleh info lebih lanjut mengenai skema kemitraan?\n\nTerima kasih 🌾",
    badge: "Terbuka",
    badgeColor: "bg-blue-500/15 text-blue-600",
  },
];

const ProgramSection = () => {
  const waId = whatsappContacts[0].waId;

  return (
    <section id="program" className="section-padding bg-canopy-gradient">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">
            Program Kepeloporan
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold leading-tight text-primary-foreground md:text-5xl">
            Cetak Generasi Petani Masa Depan
          </h2>
          <p className="mx-auto max-w-2xl font-body text-base text-primary-foreground/70">
            Regenerasi petani muda yang efektif dan berkelanjutan — melalui pelatihan, beasiswa, dan kemitraan bersama Koperasi Satria Tani Hanggawana.
          </p>
        </div>

        {/* Program Cards */}
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {programs.map((prog, i) => (
              <CarouselItem key={i} className="pl-4 md:pl-6 basis-[85%] sm:basis-1/2 md:basis-1/3">
                <div
                  className="group flex flex-col h-full rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.06] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-harvest/30 hover:bg-primary-foreground/[0.1]"
                >
                  {/* Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-harvest/20">
                      <prog.icon className="h-6 w-6 text-harvest" aria-hidden />
                    </div>
                    <span className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${prog.badgeColor}`}>
                      {prog.badge}
                    </span>
                  </div>

                  <h3 className="mb-3 font-heading text-lg font-bold text-primary-foreground">
                    {prog.title}
                  </h3>
                  <p className="mb-6 flex-1 font-body text-sm leading-relaxed text-primary-foreground/70">
                    {prog.description}
                  </p>

                  <a
                    href={`https://wa.me/${waId}?text=${encodeURIComponent(prog.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full mt-auto items-center justify-center gap-2 rounded-lg bg-harvest px-4 py-3 font-body font-semibold text-white shadow-sm transition-all hover:bg-harvest/90 hover:shadow-md"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden />
                    Daftar via WhatsApp
                  </a>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-8 text-center">
          <p className="mb-2 font-heading text-xl font-bold text-primary-foreground">
            Ingin Kunjungi Lahan Kami? 🌾
          </p>
          <p className="mb-6 font-body text-sm text-primary-foreground/70">
            Tersedia program Agrowisata di lahan AgroEdu Dukuhwaru, Tegal — petik melon, edukasi pertanian terpadu, dan farm tour.
          </p>
          <a
            href={`https://wa.me/${waId}?text=${encodeURIComponent("Halo Admin Jagasura 👋\n\nSaya tertarik mengunjungi lahan Agrowisata Jagasura di Dukuhwaru, Tegal.\n\nBoleh info jadwal dan harga tiket kunjungan?\n\nTerima kasih 🌾")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-harvest bg-harvest/10 px-6 py-3 font-body font-semibold text-harvest transition-all hover:bg-harvest hover:text-white"
          >
            Pesan Kunjungan Agrowisata
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProgramSection;
