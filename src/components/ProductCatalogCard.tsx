import { Button } from "@/components/ui/button";
import { ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import type { CatalogProduct } from "@/data/productsCatalog";
import { formatIdr } from "@/data/productsCatalog";

type ProductCatalogCardProps = {
  product: CatalogProduct;
  compact?: boolean;
  qty: number;
  onOpenDetail: () => void;
  onAddToCart: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemoveLine: () => void;
  onOpenCart: () => void;
};

const ProductCatalogCard = ({
  product,
  compact,
  qty,
  onOpenDetail,
  onAddToCart,
  onDecrement,
  onIncrement,
  onRemoveLine,
  onOpenCart,
}: ProductCatalogCardProps) => {
  const imgH = "aspect-square";
  const padMain = compact ? "px-2 pt-2 sm:px-3 sm:pt-3" : "px-3 pt-3 md:px-5 md:pt-4";
  const padBar = compact ? "px-2 py-2 sm:px-3" : "px-3 py-2.5 md:px-5 md:py-3.5";
  const titleCls = compact ? "font-hero text-sm font-semibold leading-snug sm:text-base" : "font-hero text-sm font-semibold leading-snug sm:text-lg md:text-xl";

  const cardShadow =
    "shadow-[0_12px_40px_-8px_rgba(15,35,25,0.12),0_24px_64px_-16px_rgba(15,35,25,0.14),0_4px_12px_-2px_rgba(15,35,25,0.06)]";
  const cardShadowHover =
    "hover:shadow-[0_20px_50px_-10px_rgba(15,35,25,0.16),0_32px_80px_-20px_rgba(15,35,25,0.18),0_8px_20px_-4px_rgba(15,35,25,0.08)]";

  return (
    <article
      className={`group flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-white ${cardShadow} transition-all duration-300 hover:-translate-y-1.5 hover:border-border/80 ${cardShadowHover}`}
    >
      <div className={`relative w-full shrink-0 overflow-hidden bg-muted/50 ${imgH}`}>
        <button
          type="button"
          onClick={onOpenDetail}
          className="relative block h-full w-full cursor-pointer overflow-hidden text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-harvest"
          aria-label={`Buka detail ${product.title}`}
        >
          <img
            src={product.image}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            width={640}
            height={520}
            aria-hidden
          />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col border-t border-border/60 bg-white">
        <div className={`flex min-h-0 flex-1 flex-col ${padMain} pb-3`}>
          {product.category ? (
            <p className="mb-2 shrink-0 font-body text-[10px] font-bold uppercase tracking-[0.2em] text-harvest sm:text-[11px] sm:tracking-[0.22em]">
              {product.category}
            </p>
          ) : null}
          <h3 className={`mb-0 line-clamp-2 shrink-0 text-foreground ${titleCls}`}>{product.title}</h3>
          <div className="mt-auto flex shrink-0 flex-col gap-2 pt-4">
            {product.priceOnRequest ? (
              <p className="font-heading text-sm font-bold text-harvest sm:text-base">
                💬 Hubungi untuk Harga
              </p>
            ) : (
              <p className="font-heading text-base font-bold tabular-nums text-harvest sm:text-lg">
                {formatIdr(product.price)}
                {product.priceNote ? (
                  <span className="ml-1.5 font-body text-xs font-normal text-muted-foreground sm:text-sm">
                    {product.priceNote}
                  </span>
                ) : null}
              </p>
            )}
            <button
              type="button"
              onClick={onOpenDetail}
              className="inline-flex w-fit items-center gap-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-canopy transition-colors hover:text-harvest sm:text-xs sm:tracking-[0.18em]"
            >
              Lihat detail
              <ChevronRight
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 sm:h-4 sm:w-4"
                aria-hidden
              />
            </button>
          </div>
        </div>

        <div
          className={`mt-auto shrink-0 border-t border-border/70 bg-muted/35 ${padBar}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col gap-2.5">
            {product.priceOnRequest ? (
              <Button
                type="button"
                size="sm"
                className="w-full gap-1.5 rounded-md bg-harvest px-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-harvest/90 sm:gap-2 sm:rounded-lg sm:px-3 sm:text-xs md:text-sm [&_svg]:text-white"
                asChild
              >
                <a
                  href={`https://wa.me/6285743855637?text=${encodeURIComponent(
                    `Halo Admin Jagasura 👋\n\nSaya tertarik dengan produk *${product.title}*.\n\nBoleh info harga dan ketersediaan stoknya?\n\nTerima kasih 🌾`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  <span>Tanya via WhatsApp</span>
                </a>
              </Button>
            ) : qty === 0 ? (
              <Button
                type="button"
                size="sm"
                className="w-full gap-1.5 rounded-md bg-harvest px-2 text-[10px] font-semibold text-white shadow-sm transition hover:bg-harvest/90 sm:gap-2 sm:rounded-lg sm:px-3 sm:text-xs md:text-sm [&_svg]:text-white"
                onClick={onAddToCart}
              >
                <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                <span>Tambah</span>
              </Button>
            ) : (
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                <div className="flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5 sm:rounded-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-foreground hover:bg-muted sm:h-8 sm:w-8"
                    onClick={onDecrement}
                    aria-label="Kurangi jumlah"
                  >
                    <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                  <span className="min-w-[1.25rem] text-center font-body text-[10px] font-semibold tabular-nums text-foreground sm:min-w-[2rem] sm:text-sm">
                    {qty}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-foreground hover:bg-muted sm:h-8 sm:w-8"
                    onClick={onIncrement}
                    aria-label="Tambah jumlah"
                  >
                    <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-md border-border px-2 text-[10px] text-foreground hover:bg-muted/80 sm:h-9 sm:rounded-lg sm:px-3 sm:text-xs"
                  onClick={onRemoveLine}
                >
                  <Trash2 className="h-3 w-3 sm:mr-1 sm:h-4 sm:w-4" aria-hidden />
                  <span className="hidden sm:inline">Hapus</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCatalogCard;
