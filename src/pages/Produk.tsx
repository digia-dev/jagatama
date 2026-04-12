import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProductCatalogCard from "@/components/ProductCatalogCard";
import ProductDetailDialog from "@/components/ProductDetailDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/context/CartContext";
import type { CatalogProduct } from "@/data/productsCatalog";
import { useProductsCatalogMerged } from "@/hooks/useCmsQueries";
import { filterCatalogProducts, uniqueProductCategories } from "@/lib/filterCatalogProducts";
import { ChevronLeft, Search } from "lucide-react";

const ALL = "__all__";

const Produk = () => {
  const [active, setActive] = useState<CatalogProduct | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const { addProduct, getQty, increment, decrement, removeProduct, setCartOpen } = useCart();
  const { products } = useProductsCatalogMerged();

  const categories = useMemo(() => uniqueProductCategories(products), [products]);

  const filtered = useMemo(() => {
    const cat = category === ALL ? "" : category;
    return filterCatalogProducts(products, search, cat);
  }, [products, search, category]);

  return (
    <>
      <Navbar />
      <main className="bg-white pb-20 pt-24 md:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-harvest"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Kembali ke beranda
          </Link>

          <p className="mb-2 font-body text-xs uppercase tracking-[0.25em] text-harvest sm:text-sm">Katalog</p>
          <h1 className="mb-3 font-heading text-2xl font-bold text-foreground sm:text-3xl md:text-4xl">Semua Produk</h1>
          <p className="mb-8 max-w-2xl font-body text-sm text-muted-foreground sm:mb-10 sm:text-base">
            Cari nama produk atau saring berdasarkan kategori. Harga indikatif—konfirmasi ke admin sebelum transaksi.
          </p>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="produk-search" className="text-foreground">
                Cari
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  id="produk-search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nama atau deskripsi…"
                  className="border-border bg-card pl-9"
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="w-full space-y-2 sm:w-52 md:w-60">
              <Label htmlFor="produk-kategori" className="text-foreground">
                Kategori
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="produk-kategori" className="border-border bg-card">
                  <SelectValue placeholder="Semua" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>Semua kategori</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-md border border-border bg-card px-4 py-8 text-center font-body text-sm text-muted-foreground">
              Tidak ada produk yang cocok. Ubah kata kunci atau kategori.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
              {filtered.map((product) => {
                const qty = getQty(product.id);
                return (
                  <div key={product.id} className="h-full min-h-0 w-full">
                    <ProductCatalogCard
                      product={product}
                      qty={qty}
                      onOpenDetail={() => setActive(product)}
                      onAddToCart={() => addProduct({ id: product.id, title: product.title, unitPrice: product.price }, 1)}
                      onDecrement={() => decrement(product.id)}
                      onIncrement={() => increment(product.id)}
                      onRemoveLine={() => removeProduct(product.id)}
                      onOpenCart={() => setCartOpen(true)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
      <ProductDetailDialog product={active} open={active !== null} onOpenChange={(open) => !open && setActive(null)} />
    </>
  );
};

export default Produk;
