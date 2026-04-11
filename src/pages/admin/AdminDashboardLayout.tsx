import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { ExternalLink, LayoutDashboard, LogOut, Menu, ImageIcon, Newspaper, Package, Sparkles } from "lucide-react";
import { setAdminToken } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import AdminGuard from "@/components/admin/AdminGuard";

const nav = [
  { to: "hero", label: "Hero", icon: Sparkles },
  { to: "products", label: "Produk", icon: Package },
  { to: "articles", label: "Artikel", icon: Newspaper },
  { to: "gallery", label: "Galeri", icon: ImageIcon },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive ? "bg-harvest/15 text-harvest" : "text-foreground hover:bg-muted"
  }`;

type AdminNavLinksProps = {
  onNavigate?: () => void;
};

const AdminNavLinks = ({ onNavigate }: AdminNavLinksProps) => (
  <nav className="flex flex-col gap-1">
    {nav.map((item) => {
      const Icon = item.icon;
      return (
        <NavLink key={item.to} to={item.to} end={item.to === "hero"} className={navLinkClass} onClick={onNavigate}>
          <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          {item.label}
        </NavLink>
      );
    })}
  </nav>
);

const AdminDashboardLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logout = () => {
    setAdminToken(null);
    navigate("/admin/login", { replace: true });
  };

  const closeMobile = () => setMobileOpen(false);

  const sidebarFooter = (compact?: boolean) => (
    <div className={`space-y-2 border-t border-border ${compact ? "p-3" : "p-4"}`}>
      <Link
        to="/"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        onClick={closeMobile}
      >
        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden />
        Lihat situs
      </Link>
      <Button type="button" variant="outline" className="w-full justify-start gap-2" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4" />
        Keluar
      </Button>
    </div>
  );

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-muted/30">
        <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-border bg-card md:flex lg:w-60">
          <div className="flex items-center gap-2 border-b border-border px-4 py-4">
            <LayoutDashboard className="h-5 w-5 text-harvest" aria-hidden />
            <div>
              <p className="font-heading text-sm font-semibold leading-tight text-foreground">Jagatama</p>
              <p className="text-xs text-muted-foreground">CMS</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col overflow-y-auto p-3">
            <AdminNavLinks />
          </div>
          {sidebarFooter()}
        </aside>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="flex w-56 flex-col p-0 lg:w-60">
            <SheetHeader className="border-b border-border px-4 py-4 text-left">
              <SheetTitle className="flex items-center gap-2 font-heading text-base">
                <LayoutDashboard className="h-5 w-5 text-harvest" aria-hidden />
                Jagatama CMS
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-3">
              <AdminNavLinks onNavigate={closeMobile} />
            </div>
            {sidebarFooter(true)}
          </SheetContent>
        </Sheet>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Buka menu"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <p className="truncate font-heading text-sm font-semibold text-foreground">Jagatama CMS</p>
            <span className="w-10 shrink-0" aria-hidden />
          </header>

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboardLayout;
