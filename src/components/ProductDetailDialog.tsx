import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CatalogProduct } from "@/data/productsCatalog";
import { formatIdr } from "@/data/productsCatalog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Check, Info } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "@/components/ui/sonner";

type ProductDetailDialogProps = {
  product: CatalogProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ProductDetailDialog = ({ product, open, onOpenChange }: ProductDetailDialogProps) => {
  const { addProduct, getQty, increment, decrement } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  // Default to first variant if none selected and variants exist
  const activeVariant = useMemo(() => {
    if (!product || !product.variants || product.variants.length === 0) return null;
    if (!selectedVariantId) return product.variants[0];
    return product.variants.find(v => String(v.id) === selectedVariantId) || product.variants[0];
  }, [product, selectedVariantId]);

  const currentPrice = activeVariant ? (activeVariant.price || product?.price || 0) : (product?.price || 0);
  const variantId = activeVariant ? String(activeVariant.id) : undefined;
  const variantLabel = activeVariant?.label;
  
  const qty = product ? getQty(product.id, variantId) : 0;

  const handleAddToCart = () => {
    if (!product) return;
    addProduct({
      id: product.id,
      title: product.title,
      unitPrice: currentPrice,
      variantId,
      variantLabel,
    });
    toast.success(`${product.title}${variantLabel ? ` (${variantLabel})` : ""} ditambahkan ke keranjang`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[95vh] max-w-xl gap-0 overflow-hidden overflow-y-auto bg-background p-0 shadow-2xl sm:rounded-2xl border-none"
      >
        {product ? (
          <div className="flex flex-col">
            {/* Image Section - Shopee Style 1:1 */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-muted">
              <img
                key={activeVariant?.image || product.image}
                src={activeVariant?.image || product.image}
                alt={activeVariant ? `${product.title} – ${activeVariant.label}` : product.title}
                className="h-full w-full object-cover transition-all duration-500 hover:scale-105"
              />
              {product.category && (
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest">
                  {product.category}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="px-6 py-6 sm:px-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <DialogTitle className="font-heading text-2xl font-black text-foreground tracking-tight sm:text-3xl">
                    {product.title}
                  </DialogTitle>
                  <p className="font-body text-xs leading-relaxed text-muted-foreground/80 line-clamp-3">
                    {product.description}
                  </p>
                </div>
                
                {/* Price Display - Prominent like Shopee */}
                <div className="flex items-center gap-2 py-2 px-4 bg-muted/30 rounded-xl border border-border/50">
                  <p className="font-heading text-3xl font-black text-harvest">
                    {formatIdr(currentPrice)}
                  </p>
                  {product.priceNote && (
                    <span className="font-body text-sm font-medium text-muted-foreground pt-2">/ {product.priceNote}</span>
                  )}
                </div>
              </div>

              {/* Variants Selector - Chip with Thumbnails */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-body text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Pilih Variasi</p>
                    {activeVariant && (
                      <span className="text-[10px] font-bold text-harvest bg-harvest/10 px-2 py-0.5 rounded-full">{activeVariant.label}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {product.variants.map((v) => {
                      const isSelected = activeVariant && String(v.id) === String(activeVariant.id);
                      return (
                        <button
                          key={String(v.id)}
                          onClick={() => setSelectedVariantId(String(v.id))}
                          className={`group relative flex items-center gap-3 rounded-xl border p-2 text-left transition-all hover:shadow-md ${
                            isSelected
                              ? "border-harvest bg-harvest/5 ring-1 ring-harvest"
                              : "border-border bg-card hover:border-harvest/50"
                          }`}
                        >
                          <div className="h-10 w-10 shrink-0 rounded-lg overflow-hidden bg-muted border border-border/50">
                            <img src={v.image || product.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-[11px] font-bold truncate ${isSelected ? "text-harvest" : "text-foreground"}`}>
                              {v.label}
                            </p>
                            <p className="text-[9px] text-muted-foreground tabular-nums font-medium">
                              {formatIdr(v.price || product.price)}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="absolute -right-1.5 -top-1.5 rounded-full bg-harvest p-1 text-white shadow-lg">
                              <Check size={8} strokeWidth={4} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Komoditas Badges if any */}
              {(!product.variants || product.variants.length === 0) && (product as any).items && (product as any).items.length > 0 && (
                <div className="mt-8">
                  <p className="mb-3 font-body text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Komoditas</p>
                  <div className="flex flex-wrap gap-2">
                    {(product as any).items.map((item: string) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-muted/50 px-3 py-1 text-[11px] font-bold text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Disclaimer */}
              <div className="mt-8 border-t border-border/50 pt-4">
                <p className="text-[11px] text-muted-foreground italic text-center">
                  * Harga bisa sewaktu-waktu berubah
                </p>
              </div>

              {/* Add to Cart Section - Prominent Footer */}
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sticky bottom-0 bg-background/80 backdrop-blur-xl py-4 border-t border-border/50 -mx-6 px-6 sm:-mx-8 sm:px-8">
                <div className="flex h-12 flex-1 items-center gap-4 rounded-2xl border border-border bg-muted/20 p-1.5 min-w-[140px] sm:flex-none">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-background shadow-sm"
                    onClick={() => decrement(product.id, variantId)}
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="flex-1 text-center font-heading text-xl font-black tabular-nums text-foreground">
                    {qty}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl hover:bg-background shadow-sm"
                    onClick={() => increment(product.id, variantId)}
                  >
                    <Plus size={14} />
                  </Button>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="h-12 flex-[2] gap-3 rounded-2xl bg-harvest text-base font-black text-white shadow-xl shadow-harvest/20 hover:bg-harvest/90 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart size={20} strokeWidth={3} />
                  {qty > 0 ? "TAMBAH LAGI" : "TAMBAH KE KERANJANG"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
