import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { productsCatalog, formatIdr, type CatalogProduct } from "@/data/productsCatalog";

const ProductsSection = () => {
  const [active, setActive] = useState<CatalogProduct | null>(null);
  const { addProduct, getQty, increment, decrement, removeProduct, setCartOpen } = useCart();

  return (
    <section id="produk" className="section-padding bg-earth-gradient">
      <div className="mx-auto max-w-7xl">
        <p className="mb-3 font-body text-sm uppercase tracking-[0.25em] text-harvest">Produk Kami</p>
        <h2 className="mb-16 max-w-3xl font-heading text-3xl font-bold leading-tight text-earth-foreground md:text-5xl">
          Dari Lahan ke Pasar, <br className="hidden md:block" />
          Kualitas Tanpa Kompromi
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {productsCatalog.map((product) => {
            const qty = getQty(product.id);
            return (
              <article
                key={product.id}
                className="group flex flex-col overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-lg shadow-black/5"
              >
                <div className="relative h-[300px] w-full shrink-0 overflow-hidden sm:h-[320px] md:h-[360px]">
                  <button
                    type="button"
                    onClick={() => setActive(product)}
                    className="relative block h-full w-full cursor-pointer overflow-hidden text-left outline-none ring-offset-background transition focus-visible:ring-2 focus-visible:ring-harvest focus-visible:ring-offset-2"
                    aria-label={`Buka detail ${product.title}`}
                  >
                    <img
                      src={product.image}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                      width={800}
                      height={900}
                      aria-hidden
                    />
                  </button>
                </div>

                <div className="flex flex-col border-t border-border px-5 pb-4 pt-5 md:px-6 md:pb-5 md:pt-6">
                  <h3 className="mb-2 font-heading text-xl font-bold text-foreground md:text-2xl">{product.title}</h3>
                  <p className="mb-3 line-clamp-2 font-body text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                  <p className="mb-3 font-heading text-lg font-bold text-harvest">
                    {formatIdr(product.price)}
                    {product.priceNote ? (
                      <span className="ml-1 font-body text-xs font-normal text-muted-foreground">{product.priceNote}</span>
                    ) : null}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActive(product)}
                    className="inline-flex w-fit items-center gap-1 font-body text-xs font-semibold uppercase tracking-wider text-harvest transition-colors hover:text-harvest/80"
                  >
                    Detail
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </button>
                </div>

                <div
                  className="border-t border-border bg-muted/40 px-4 py-4 md:px-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    {qty === 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1.5 bg-harvest text-primary-foreground hover:bg-harvest/90"
                          onClick={() => {
                            addProduct(
                              { id: product.id, title: product.title, unitPrice: product.price },
                              1,
                            );
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" aria-hidden />
                          Tambah ke keranjang
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => decrement(product.id)}
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-[2rem] text-center font-body text-sm font-semibold tabular-nums text-foreground">
                            {qty}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => increment(product.id)}
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeProduct(product.id)}>
                          <Trash2 className="mr-1 h-4 w-4" aria-hidden />
                          Hapus
                        </Button>
                        <Button type="button" variant="secondary" size="sm" onClick={() => setCartOpen(true)}>
                          Lihat keranjang
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Dialog open={active !== null} onOpenChange={(open) => !open && setActive(null)}>
          <DialogContent
            className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden overflow-y-auto border border-harvest/25 bg-earth-gradient p-0 text-primary-foreground shadow-2xl shadow-black/40 sm:rounded-sm [&>button]:text-primary-foreground/85 [&>button]:ring-offset-soil [&>button]:hover:bg-primary-foreground/10 [&>button]:hover:text-primary-foreground"
          >
            {active && (
              <>
                <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-56">
                  <img src={active.image} alt={active.title} className="h-full w-full object-cover" width={960} height={400} />
                  <div className="absolute inset-0 bg-gradient-to-t from-soil/95 via-soil/35 to-transparent" />
                </div>
                <div className="border-t border-primary-foreground/10 px-6 pb-7 pt-6 sm:px-8 sm:pb-8">
                  <DialogHeader className="space-y-3 text-left">
                    <DialogTitle className="font-heading text-2xl font-bold text-primary-foreground sm:text-3xl">
                      {active.title}
                    </DialogTitle>
                    <p className="font-body text-base leading-relaxed text-primary-foreground/75">{active.description}</p>
                    <p className="font-heading text-lg font-bold text-harvest">
                      {formatIdr(active.price)}
                      {active.priceNote ? (
                        <span className="ml-1 font-body text-sm font-normal text-primary-foreground/70">{active.priceNote}</span>
                      ) : null}
                    </p>
                  </DialogHeader>
                  {active.items && active.items.length > 0 && (
                    <div className="mt-6 border-t border-primary-foreground/10 pt-6">
                      <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-harvest">Varian dan komoditas</p>
                      <ul className="flex flex-wrap gap-2">
                        {active.items.map((item) => (
                          <li
                            key={item}
                            className="rounded-full border border-primary-foreground/15 bg-primary-foreground/5 px-3 py-1.5 font-body text-sm text-primary-foreground/90"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default ProductsSection;
