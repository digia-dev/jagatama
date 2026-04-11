import { Link } from "react-router-dom";
import { mainNavLinks } from "@/data/navLinks";

const Footer = () => {
  return (
    <footer className="section-padding bg-soil pb-8 text-primary-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-3 font-heading text-xl font-bold">
              <span className="text-harvest">Jagasura</span> Agrotama
            </h3>
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
              <a
                href="https://wa.me/6285743855637"
                className="block font-body text-sm text-primary-foreground/60 transition-colors hover:text-harvest"
              >
                +62 857-4385-5637 (Mudi)
              </a>
              <a
                href="https://wa.me/6285946259796"
                className="block font-body text-sm text-primary-foreground/60 transition-colors hover:text-harvest"
              >
                +62 859-4625-9796 (Muji)
              </a>
              <a
                href="https://wa.me/6285659990002"
                className="block font-body text-sm text-primary-foreground/60 transition-colors hover:text-harvest"
              >
                +62 856-5999-0002 (Kamal)
              </a>
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
