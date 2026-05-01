import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ChevronRight, Award, Target, Users, Map } from "lucide-react";
import { Link } from "react-router-dom";

const TentangKami = () => {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <img 
              src="/produk/Gambar%20Latar/GH.jpg" 
              alt="Greenhouse Jagasura" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-canopy/70 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-b from-canopy/40 to-canopy" />
          </div>
          <div className="container relative z-10 px-6 text-center">
            <p className="font-body text-sm font-bold uppercase tracking-[0.3em] text-harvest mb-4">
              Mengenal Lebih Dekat
            </p>
            <h1 className="font-hero text-4xl md:text-6xl font-bold text-white mb-6">
              Membangun Masa Depan <br /> Pertanian Indonesia
            </h1>
          </div>
        </section>

        {/* Vision Mission */}
        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-sm font-bold uppercase tracking-[0.2em] text-harvest mb-4">Visi & Misi</p>
              <h2 className="font-hero text-3xl md:text-4xl font-bold text-foreground mb-8">
                Menjadi Pelopor Pertanian <br /> Terpadu Berbasis Teknologi
              </h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 rounded-2xl bg-harvest/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-harvest" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">Visi Kami</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Menjadikan sektor pertanian sebagai industri yang modern, efisien, dan memiliki daya saing tinggi guna meningkatkan kesejahteraan petani Indonesia.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 h-12 w-12 rounded-2xl bg-canopy/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-canopy" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-2">Misi Kami</h3>
                    <ul className="list-disc pl-5 font-body text-muted-foreground space-y-2">
                      <li>Mengembangkan ekosistem pertanian terpadu (Integrated Farming).</li>
                      <li>Mengimplementasikan teknologi greenhouse dan otomasi pertanian.</li>
                      <li>Memberdayakan generasi muda melalui program Agropreneurship.</li>
                      <li>Menjalin kemitraan strategis dari hulu hingga hilir.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bupati%20Tegal.png" 
                  alt="Sinergi Jagasura" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-harvest p-8 rounded-2xl shadow-xl hidden md:block">
                <p className="font-hero text-4xl font-bold text-white mb-1">5+</p>
                <p className="font-body text-white/80 text-sm font-medium">Tahun Inovasi</p>
              </div>
            </div>
          </div>
        </section>

        {/* Masterplan Section */}
        <section className="py-24 bg-soil text-white">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="lg:w-1/2 order-2 lg:order-1">
                <div className="grid grid-cols-2 gap-4">
                  <img src="/produk/Gambar%20Latar/Latar%202.jpg" alt="Lahan 1" className="rounded-2xl aspect-square object-cover" />
                  <img src="/produk/Gambar%20Latar/2.jpg" alt="Lahan 2" className="rounded-2xl aspect-square object-cover mt-8" />
                </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                <p className="font-body text-sm font-bold uppercase tracking-[0.2em] text-harvest mb-4">Masterplan</p>
                <h2 className="font-hero text-3xl md:text-4xl font-bold mb-6">
                  AgroEdu Park Dukuhwaru
                </h2>
                <p className="font-body text-lg text-white/70 leading-relaxed mb-8">
                  Kawasan terpadu seluas hektaran di Tegal yang mengintegrasikan pusat produksi, riset teknologi pertanian, dan pusat pelatihan bagi calon agropreneur.
                </p>
                <div className="space-y-4">
                  {[
                    "Greenhouse Smart Farming",
                    "Pusat Pemuliaan Bibit Unggul",
                    "Instalasi Pengolahan Pupuk Organik",
                    "Area Budidaya Perikanan Zero Waste",
                    "Gudang Pendingin (Cold Storage)"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-harvest" />
                      <span className="font-body text-base text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* CTA */}
        <section className="py-20 bg-cream-gradient border-y border-border">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-hero text-3xl font-bold text-foreground mb-6">
              Tertarik Berkolaborasi dengan Kami?
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/produk" className="bg-harvest text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-harvest/20 hover:bg-harvest/90 transition-all">
                Lihat Produk Kami
              </Link>
              <a href="https://wa.me/6285743855637" className="border-2 border-harvest text-harvest px-8 py-4 rounded-full font-bold hover:bg-harvest/5 transition-all">
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default TentangKami;
