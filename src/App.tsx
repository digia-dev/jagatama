import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Team from "./pages/Team.tsx";
import Services from "./pages/Services.tsx";
import Artikel from "./pages/Artikel.tsx";
import ArticleDetail from "./pages/ArticleDetail.tsx";
import ScrollToTop from "@/components/ScrollToTop.tsx";
import { CartProvider } from "@/context/CartContext";
import CartSheet from "@/components/CartSheet";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <CartSheet />
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tim" element={<Team />} />
          <Route path="/layanan" element={<Services />} />
          <Route path="/artikel" element={<Artikel />} />
          <Route path="/artikel/:slug" element={<ArticleDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
