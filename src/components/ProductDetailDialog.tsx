import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CatalogProduct, ProductVariant } from "@/data/productsCatalog";
import { formatIdr } from "@/data/productsCatalog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
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
        className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden overflow-y-auto border border-harvest/25 bg-earth-gradient p-0 text-primary-foreground shadow-2xl shadow-black/40 sm:rounded-sm [&>button]:text-primary-foreground/85 [&>button]:ring-offset-soil [&>button]:hover:bg-primary-foreground/10 [&>button]:hover:text-primary-foreground"
      >
        {product ? (
          <>
            <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-52">
              <img
                key={activeVariant?.image || product.image}
                src={activeVariant?.image || product.image}
                alt={activeVariant ? `${product.title} – ${activeVariant.label}` : product.title}
                className="h-full w-full object-cover transition-opacity duration-300"
                width={960}
                height={400}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/35 to-transparent" />
            </div>
            <div className="border-t border-primary-foreground/10 px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
              <DialogHeader className="space-y-2 text-left sm:space-y-3">
                {product.category ? (
                  <p className="font-body text-xs font-semibold uppercase tracking-wider text-harvest">{product.category}</p>
                ) : null}
                <DialogTitle className="font-heading text-xl font-bold text-primary-foreground sm:text-2xl md:text-3xl">
                  {product.title}
                </DialogTitle>
                <p className="font-body text-sm leading-relaxed text-primary-foreground/75 sm:text-base">{product.description}</p>
                
                <div className="flex items-baseline gap-2">
                  <p className="font-heading text-2xl font-bold text-harvest sm:text-3xl">
                    {formatIdr(currentPrice)}
                  </p>
                  {product.priceNote && (
                    <span className="font-body text-sm font-normal text-primary-foreground/70">{product.priceNote}</span>
                  )}
                </div>
              </DialogHeader>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-6 border-t border-primary-foreground/10 pt-6">
                  <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-harvest">Pilih Variasi</p>
                  <div className="flex flex-wrap gap-3">
                    {product.variants.map((v) => {
                      const isSelected = activeVariant && String(v.id) === String(activeVariant.id);
                      return (
                        <button
                          key={String(v.id)}
                          onClick={() => setSelectedVariantId(String(v.id))}
                          className={`group relative flex flex-col items-start rounded-xl border p-3 transition-all ${
                            isSelected
                              ? "border-harvest bg-harvest/10 shadow-lg shadow-harvest/5"
                              : "border-primary-foreground/10 bg-primary-foreground/5 hover:border-primary-foreground/30"
                          }`}
                        >
                          <span className={`text-sm font-semibold ${isSelected ? "text-harvest" : "text-primary-foreground"}`}>
                            {v.label}
                          </span>
                          <span className="text-[10px] text-primary-foreground/60">
                            {formatIdr(v.price || product.price)}
                          </span>
                          {isSelected && (
                            <div className="absolute -right-1 -top-1 rounded-full bg-harvest p-0.5 text-white shadow-sm">
                              <Check size={10} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Legacy items list if no structured variants */}
              {(!product.variants || product.variants.length === 0) && product.items && product.items.length > 0 && (
                <div className="mt-5 border-t border-primary-foreground/10 pt-5 sm:mt-6 sm:pt-6">
                  <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-harvest sm:mb-3">Komoditas</p>
                  <ul className="flex flex-wrap gap-2">
                    {product.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-2.5 py-1 font-body text-xs text-primary-foreground/90 sm:px-3 sm:py-1.5 sm:text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                {qty > 0 ? (
                  <div className="flex h-12 items-center gap-2 rounded-xl border border-primary-foreground/20 bg-primary-foreground/5 p-1 sm:w-32">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => decrement(product.id, variantId)}
                    >
                      <Minus size={16} />
                    </Button>
                    <span className="flex-1 text-center font-heading text-lg font-bold tabular-nums">
                      {qty}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-primary-foreground hover:bg-primary-foreground/10"
                      onClick={() => increment(product.id, variantId)}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                ) : null}

                <Button
                  onClick={handleAddToCart}
                  className="h-12 flex-1 gap-2 rounded-xl bg-harvest text-base font-bold text-white shadow-lg shadow-harvest/20 hover:bg-harvest/90"
                >
                  <ShoppingCart size={20} />
                  {qty > 0 ? "Tambah Lagi" : "Tambah ke Keranjang"}
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
