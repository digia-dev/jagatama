import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Team from "./pages/Team.tsx";
import Services from "./pages/Services.tsx";
import Artikel from "./pages/Artikel.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import Produk from "./pages/Produk.tsx";
import ProdukDetail from "./pages/ProdukDetail.tsx";
import TentangKami from "./pages/TentangKami.tsx";
import KebijakanPrivasi from "./pages/KebijakanPrivasi.tsx";
import ScrollToTop from "@/components/ScrollToTop.tsx";
import { CartProvider } from "@/context/CartContext";
import { HelmetProvider } from "react-helmet-async";
import CartSheet from "@/components/CartSheet";
import MobileCheckoutBar from "@/components/MobileCheckoutBar";
import AdminLoginPage from "@/pages/admin/AdminLoginPage.tsx";
import AdminDashboardLayout from "@/pages/admin/AdminDashboardLayout.tsx";
import AdminHeroPage from "@/pages/admin/AdminHeroPage.tsx";
import AdminProductsPage from "@/pages/admin/AdminProductsPage.tsx";
import AdminArticlesPage from "@/pages/admin/AdminArticlesPage.tsx";
import AdminGalleryPage from "@/pages/admin/AdminGalleryPage.tsx";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage.tsx";
import AdminTestimoniPage from "@/pages/admin/AdminTestimoniPage.tsx";
import AdminTeamPage from "@/pages/admin/AdminTeamPage.tsx";
import AdminWhatsAppPage from "@/pages/admin/AdminWhatsAppPage.tsx";
import AdminUsersPage from "@/pages/admin/AdminUsersPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <CartSheet />
            <MobileCheckoutBar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/tim" element={<Team />} />
              <Route path="/layanan" element={<Services />} />
              <Route path="/artikel" element={<Artikel />} />
              <Route path="/artikel/:slug" element={<ArticleDetail />} />
              <Route path="/produk" element={<Produk />} />
              <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>
                <Route index element={<Navigate to="hero" replace />} />
                <Route path="hero" element={<AdminHeroPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="articles" element={<AdminArticlesPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="testimoni" element={<AdminTestimoniPage />} />
                <Route path="team" element={<AdminTeamPage />} />
                <Route path="whatsapp" element={<AdminWhatsAppPage />} />
                <Route path="users" element={<AdminUsersPage />} />
              </Route>
              <Route path="/produk/:productId" element={<ProdukDetail />} />
              <Route path="/tentang" element={<TentangKami />} />
              <Route path="/kebijakan-privasi" element={<KebijakanPrivasi />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
