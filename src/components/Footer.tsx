const navLinks = [
  { label: "Beranda", href: "#beranda" },
  { label: "Tentang Kami", href: "#tentang" },
  { label: "Tim Kami", href: "#tim" },
  { label: "Layanan", href: "#layanan" },
  { label: "Produk", href: "#produk" },
  { label: "Artikel", href: "#artikel" },
  { label: "Gallery", href: "#gallery" },
  { label: "Kontak", href: "#kontak" },
];

const Footer = () => {
  return (
    <footer className="bg-soil text-primary-foreground section-padding pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-bold mb-3">
              <span className="text-harvest">Jagasura</span> Agrotama
            </h3>
            <p className="font-body text-primary-foreground/60 text-sm leading-relaxed">
              Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan.
            </p>
            <p className="font-body text-harvest text-sm mt-4 italic font-heading">
              "Bertani itu Keren dan Berdaya Saing"
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground/40 mb-4">
              Navigasi
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-primary-foreground/60 hover:text-harvest transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground/40 mb-4">
              Hubungi
            </h4>
            <div className="space-y-2">
              <a href="https://wa.me/6285743855637" className="font-body text-sm text-primary-foreground/60 hover:text-harvest transition-colors block">
                +62 857-4385-5637 (Mudi)
              </a>
              <a href="https://wa.me/6285946259796" className="font-body text-sm text-primary-foreground/60 hover:text-harvest transition-colors block">
                +62 859-4625-9796 (Muji)
              </a>
              <a href="https://wa.me/6285659990002" className="font-body text-sm text-primary-foreground/60 hover:text-harvest transition-colors block">
                +62 856-5999-0002 (Kamal)
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6">
          <p className="font-body text-xs text-primary-foreground/40 text-center">
            © 2026 PT. Jagasura Agrotama Indonesia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
