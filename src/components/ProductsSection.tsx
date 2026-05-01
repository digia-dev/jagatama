import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { CatalogProduct } from "@/data/productsCatalog";
import { useProductsCatalogMerged } from "@/hooks/useCmsQueries";
import ProductCatalogCard from "@/components/ProductCatalogCard";
import ProductDetailDialog from "@/components/ProductDetailDialog";

const PREVIEW_COUNT = 6;

const ProductsSection = () => {
  const [active, setActive] = useState<CatalogProduct | null>(null);
  const { addProduct, getQty, increment, decrement, removeProduct, setCartOpen } = useCart();
  const { products: allProducts } = useProductsCatalogMerged();
  const previewProducts = allProducts.slice(0, PREVIEW_COUNT);
  const hasMore = allProducts.length > PREVIEW_COUNT;

  return (
    <section id="produk" className="section-padding bg-white">
      <div className="mx-auto max-w-7xl">
        <p className="mb-2 font-body text-xs uppercase tracking-[0.25em] text-harvest sm:text-sm">Produk Kami</p>
        <h2 className="mb-8 max-w-3xl font-heading text-2xl font-bold leading-tight text-foreground sm:mb-10 sm:text-3xl md:text-4xl lg:text-5xl">
          Dari Lahan ke Pasar, <br className="hidden sm:block" />
          Kualitas Tanpa Kompromi
        </h2>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {previewProducts.map((product) => {
            const qty = getQty(product.id);
            return (
              <div key={product.id} className="h-full min-h-0 w-full">
                <ProductCatalogCard
                  product={product}
                  compact
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

        {hasMore ? (
          <div className="mt-8 flex justify-center sm:mt-10">
            <Button type="button" variant="outline" size="lg" className="gap-2 border-border bg-background text-foreground shadow-sm hover:bg-muted/60" asChild>
              <Link to="/produk">
                Lihat semua produk
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>

      <ProductDetailDialog product={active} open={active !== null} onOpenChange={(open) => !open && setActive(null)} />
    </section>
  );
};

export default ProductsSection;
