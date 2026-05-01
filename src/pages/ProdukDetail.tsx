import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { useCart } from "@/context/CartContext";
import { formatIdr } from "@/data/productsCatalog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart, Minus, Plus, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useProductsCatalogMerged } from "@/hooks/useCmsQueries";

const ProdukDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, pending } = useProductsCatalogMerged();
  const { addProduct, getQty, increment, decrement } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const product = useMemo(
    () => products.find((p) => p.id === productId),
    [products, productId],
  );

  useEffect(() => {
    if (!pending && !product && productId) {
      navigate("/produk", { replace: true });
    }
  }, [product, productId, navigate, pending]);

  const activeVariant = useMemo(() => {
    if (!product || !product.variants || product.variants.length === 0) return null;
    if (!selectedVariantId) return product.variants[0];
    return product.variants.find(v => String(v.id) === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const currentPrice = activeVariant ? (activeVariant.price || product?.price || 0) : (product?.price || 0);
  const variantId = activeVariant ? String(activeVariant.id) : undefined;
  const variantLabel = activeVariant?.label;

  if (pending) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
  if (!product) return null;

  const qty = getQty(product.id, variantId);

  return (
    <>
      <Navbar />
      <main className="bg-white pb-20 pt-24 md:pt-32">
        <div className="mx-auto max-w-7xl px-6">
          <Link
            to="/produk"
            className="mb-8 inline-flex items-center gap-2 font-body text-sm font-medium text-muted-foreground transition-colors hover:text-harvest"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Kembali ke Katalog
          </Link>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-3xl border border-border bg-muted/30 shadow-inner">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="rounded-2xl border border-border bg-muted/10 p-6">
                  <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                    Pilih Variasi:
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v) => {
                      const isSelected = activeVariant && String(v.id) === String(activeVariant.id);
                      return (
                        <button
                          key={String(v.id)}
                          onClick={() => setSelectedVariantId(String(v.id))}
                          className={`group relative flex flex-col items-start rounded-xl border p-4 transition-all ${
                            isSelected
                              ? "border-harvest bg-white shadow-md"
                              : "border-border bg-white/50 hover:border-harvest/50 hover:bg-white"
                          }`}
                        >
                          <span className={`text-sm font-bold ${isSelected ? "text-harvest" : "text-foreground"}`}>
                            {v.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatIdr(v.price || product.price)}
                          </span>
                          {isSelected && (
                            <div className="absolute -right-2 -top-2 rounded-full bg-harvest p-1 text-white shadow-sm">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legacy items list if no variants */}
              {(!product.variants || product.variants.length === 0) && product.items && product.items.length > 0 && (
                <div className="rounded-2xl border border-border bg-muted/10 p-6">
                  <h4 className="mb-4 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                    Komoditas Tersedia:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {product.items.map((item, i) => (
                      <span 
                        key={i} 
                        className="inline-flex items-center gap-1.5 rounded-full bg-white border border-border px-3 py-1 text-xs font-medium text-foreground"
                      >
                        <CheckCircle2 className="h-3 w-3 text-harvest" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="mb-6">
                <p className="mb-2 font-body text-xs font-bold uppercase tracking-[0.2em] text-harvest">
                  {product.category}
                </p>
                <h1 className="mb-4 font-hero text-3xl font-bold text-foreground md:text-5xl">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  {product.priceOnRequest ? (
                    <span className="rounded-full bg-harvest/10 px-4 py-1.5 font-heading text-lg font-bold text-harvest">
                      💬 Harga Sesuai Permintaan
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl font-bold text-harvest">
                        {formatIdr(currentPrice)}
                      </span>
                      {product.priceNote && (
                        <span className="font-body text-base text-muted-foreground">
                          {product.priceNote}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="mb-3 font-heading text-sm font-bold uppercase tracking-wider text-foreground">
                  Deskripsi Produk
                </h4>
                <p className="font-body text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-auto space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex flex-col gap-4">
                    {product.priceOnRequest ? (
                      <Button 
                        size="lg" 
                        className="w-full h-14 rounded-xl bg-harvest hover:bg-harvest/90 text-white font-bold gap-3"
                        asChild
                      >
                        <a 
                          href={`https://wa.me/6285743855637?text=${encodeURIComponent(`Halo Admin Jagasura 👋\n\nSaya tertarik dengan produk *${product.title}*.\n\nBoleh info harga dan ketersediaan stoknya?\n\nTerima kasih 🌾`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-5 w-5" />
                          Tanya via WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="font-body text-sm font-medium text-muted-foreground">Jumlah ({variantLabel || "Utama"})</span>
                          <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => decrement(product.id, variantId)}
                              disabled={qty === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="min-w-[3rem] text-center font-heading text-lg font-bold tabular-nums">
                              {qty}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10"
                              onClick={() => {
                                if (qty === 0) addProduct({ id: product.id, title: product.title, unitPrice: currentPrice, variantId, variantLabel });
                                else increment(product.id, variantId);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button 
                          size="lg" 
                          className="w-full h-14 rounded-xl bg-harvest hover:bg-harvest/90 text-white font-bold gap-3"
                          onClick={() => {
                            if (qty === 0) {
                              addProduct({ id: product.id, title: product.title, unitPrice: currentPrice, variantId, variantLabel });
                              toast.success(`${product.title}${variantLabel ? ` (${variantLabel})` : ""} ditambahkan ke keranjang`);
                            } else {
                              toast.success(`Jumlah ${product.title} diperbarui`);
                            }
                          }}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          {qty === 0 ? "Tambah ke Keranjang" : "Update di Keranjang"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 px-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-canopy/10">
                    <CheckCircle2 className="h-5 w-5 text-canopy" />
                  </div>
                  <p className="font-body text-xs text-muted-foreground leading-relaxed">
                    Produk dikirim langsung dari lahan pertanian terintegrasi kami di Tegal. 
                    Kualitas terjamin dan segar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
};

export default ProdukDetail;
