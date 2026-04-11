import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { mainNavLinks } from "@/data/navLinks";

const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const solidNav = scrolled || !isHome;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        solidNav ? "bg-background/95 py-3 shadow-md backdrop-blur-md" : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <div
            className={`font-heading text-xl font-bold tracking-tight transition-colors duration-300 ${
              solidNav ? "text-foreground" : "text-primary-foreground"
            }`}
          >
            <span className="text-harvest">Jagasura</span> Agrotama
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {mainNavLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-harvest ${
                solidNav ? "text-foreground" : "text-primary-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`transition-colors lg:hidden ${solidNav ? "text-foreground" : "text-primary-foreground"}`}
          aria-expanded={open}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/98 backdrop-blur-lg lg:hidden">
          <div className="flex flex-col gap-4 px-6 py-6">
            {mainNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="border-b border-border/50 py-2 font-medium text-base text-foreground transition-colors hover:text-harvest"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
