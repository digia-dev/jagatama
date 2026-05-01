import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const AgrowisataSection = () => {
  return (
    <section id="agrowisata" className="relative py-24 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/produk/Gambar%20Latar/Latar%202.jpg"
          alt="Lahan Jagasura"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-canopy/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy via-transparent to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="font-body text-sm font-bold uppercase tracking-[0.3em] text-harvest mb-4">
            Pengalaman Edukatif
          </p>
          <h2 className="font-hero text-4xl md:text-5xl font-bold text-white mb-6">
            Kunjungi Lahan Kami — Agrowisata Dukuhwaru
          </h2>
          <p className="font-body text-lg text-white/80 leading-relaxed">
            Rasakan langsung pengalaman bertani modern di ekosistem Integrated Farming kami. 
            Mulai dari petik melon premium hingga edukasi budidaya ramah lingkungan.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full mb-16"
        >
          <CarouselContent className="-ml-4 md:-ml-8">
            {[
              {
                icon: <Calendar className="w-8 h-8 text-harvest" />,
                title: "Petik Melon Premium",
                desc: "Nikmati sensasi memetik buah melon segar langsung dari pohonnya di dalam greenhouse kami."
              },
              {
                icon: <Users className="w-8 h-8 text-harvest" />,
                title: "Edukasi Pertanian",
                desc: "Belajar konsep Integrated Farming, mulai dari pembibitan hingga pengelolaan limbah zero waste."
              },
              {
                icon: <MapPin className="w-8 h-8 text-harvest" />,
                title: "Lokasi Strategis",
                desc: "Terletak di Dukuhwaru, Tegal. Area yang asri dan cocok untuk wisata keluarga maupun instansi."
              }
            ].map((item, i) => (
              <CarouselItem key={i} className="pl-4 md:pl-8 basis-[85%] sm:basis-1/2 md:basis-1/3">
                <div 
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 h-full"
                >
                  <div className="mb-6">{item.icon}</div>
                  <h3 className="font-heading text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="font-body text-white/70 leading-relaxed">{item.desc}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-harvest hover:bg-harvest/90 text-white font-bold px-10 py-7 rounded-full text-lg shadow-xl shadow-harvest/20"
            asChild
          >
            <a 
              href={`https://wa.me/6285743855637?text=${encodeURIComponent("Halo Admin Jagasura 👋\n\nSaya tertarik untuk berkunjung ke Agrowisata Jagasura.\n\nBisa info jadwal kunjungan dan paket yang tersedia?\n\nTerima kasih 🌾")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pesan Kunjungan via WhatsApp
            </a>
          </Button>
          <p className="font-body text-white/60 text-sm">
            *Tersedia untuk kunjungan individu, keluarga, dan grup sekolah/instansi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AgrowisataSection;
