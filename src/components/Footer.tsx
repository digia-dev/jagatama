import { Link } from "react-router-dom";
import { mainNavLinks } from "@/data/navLinks";
import { whatsappContacts } from "@/data/whatsappContacts";
import { Instagram, Youtube, MessageCircle } from "lucide-react";
import { useSettingsCms } from "@/hooks/useCmsQueries";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://instagram.com/jagasura_agrotama",
    icon: Instagram,
    color: "hover:text-pink-400",
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@jagasura",
    icon: Youtube,
    color: "hover:text-red-400",
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${whatsappContacts[0].waId}?text=${encodeURIComponent("Halo Admin Jagasura 👋\n\nSaya tertarik dengan produk Jagasura Agrotama.\n\nBoleh info ketersediaan stok dan harga terbaru?\n\nTerima kasih 🌾")}`,
    icon: MessageCircle,
    color: "hover:text-[#25D366]",
  },
];

const Footer = () => {
  const { data: settings } = useSettingsCms();
  return (
    <footer className="section-padding bg-soil pb-8 text-primary-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="mb-3 flex items-center gap-3 py-2">
              <img
                src={settings?.logo_url || "/logotp.png"}
                alt={settings?.brand_name || "PT Jagasura Agrotama Indonesia"}
                className="h-12 w-auto shrink-0 object-contain"
                width={48}
                height={48}
              />
              <div className="flex flex-col">
                <h3 className="font-heading text-xl font-bold">
                  {settings?.brand_name || (
                    <>
                      <span className="text-harvest">Jagasura</span> Agrotama
                    </>
                  )}
                </h3>
                <div className="text-xs font-medium tracking-wide text-primary-foreground/80">
                  {settings?.tagline || "Sustainable Agriculture"}
                </div>
              </div>
            </Link>
            <p className="mb-2 font-body text-sm leading-relaxed text-primary-foreground/60">
              Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan.
            </p>
            <p className="mb-1 font-body text-xs text-primary-foreground/40">
              Jl. Gili Turi, Dukuhwaru, Tegal, Jawa Tengah
            </p>
            <p className="font-heading text-sm italic text-harvest">
              "Bertani itu Keren dan Berdaya Saing"
            </p>

            {/* TASK-05: Social Media Links */}
            <div className="mt-5 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border border-primary-foreground/15 bg-primary-foreground/5 text-primary-foreground/50 transition-all duration-200 hover:scale-110 hover:border-primary-foreground/30 hover:bg-primary-foreground/10 ${s.color}`}
                >
                  <s.icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground/40">
              Navigasi
            </h4>
            <div className="flex flex-col gap-2">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="font-body text-sm text-primary-foreground/60 transition-colors hover:text-harvest"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div>
              <h4 className="mb-2 font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground/40">
                Legal
              </h4>
              <Link
                to="/kebijakan-privasi"
                className="block font-body text-sm text-primary-foreground/60 transition-colors hover:text-harvest"
              >
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6">
          <p className="text-center font-body text-xs text-primary-foreground/40">
            © 2026 {settings?.brand_name || "PT. Jagasura Agrotama Indonesia"} · Developed By <a href="https://instagram.com/digia.id" target="_blank" rel="noopener noreferrer" className="hover:text-harvest transition-colors underline decoration-primary-foreground/20 underline-offset-2">DIGIA</a> . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
