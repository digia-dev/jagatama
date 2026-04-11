import { Link } from "react-router-dom";
import { mainNavLinks } from "@/data/navLinks";
import { whatsappContacts } from "@/data/whatsappContacts";

const Footer = () => {
  return (
    <footer className="section-padding bg-soil pb-8 text-primary-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 md:grid-cols-3">
          <div>
            <Link to="/" className="mb-3 flex items-center gap-3 py-2">
              <img
                src="/logotp.png"
                alt="PT Jagasura Agrotama Indonesia"
                className="h-12 w-auto shrink-0 object-contain"
                width={48}
                height={48}
              />
              <h3 className="font-heading text-xl font-bold">
                <span className="text-harvest">Jagasura</span> Agrotama
              </h3>
            </Link>
            <p className="font-body text-sm leading-relaxed text-primary-foreground/60">
              Menebar gagasan, menumbuhkan wawasan, meningkatkan kapasitas dan kesejahteraan.
            </p>
            <p className="mt-4 font-body text-sm italic font-heading text-harvest">Bertani itu Keren dan Berdaya Saing</p>
          </div>

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground/40">Navigasi</h4>
            <div className="grid grid-cols-2 gap-2">
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

          <div>
            <h4 className="mb-4 font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground/40">Hubungi</h4>
            <div className="space-y-2">
              {whatsappContacts.map((c) => (
                <a
                  key={c.waId}
                  href={`https://wa.me/${c.waId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-body text-sm text-primary-foreground/60 transition-colors hover:text-harvest"
                >
                  {c.phone} ({c.name})
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 pt-6">
          <p className="text-center font-body text-xs text-primary-foreground/40">© 2026 PT. Jagasura Agrotama Indonesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
