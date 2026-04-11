import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { setAdminToken } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import AdminGuard from "@/components/admin/AdminGuard";

const nav = [
  { to: "hero", label: "Hero" },
  { to: "products", label: "Produk" },
  { to: "articles", label: "Artikel" },
  { to: "gallery", label: "Galeri" },
];

const AdminDashboardLayout = () => {
  const navigate = useNavigate();

  const logout = () => {
    setAdminToken(null);
    navigate("/admin/login", { replace: true });
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30">
        <header className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-3">
            <p className="font-heading text-sm font-semibold text-foreground md:text-base">Jagatama CMS</p>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-harvest">
                Lihat situs
              </Link>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={logout}>
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
          <nav className="flex flex-wrap gap-1 border-t border-border/60 px-2 py-2 md:px-4">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? "bg-harvest/15 text-harvest" : "text-foreground hover:bg-muted"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="mx-auto max-w-7xl p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </AdminGuard>
  );
};

export default AdminDashboardLayout;
