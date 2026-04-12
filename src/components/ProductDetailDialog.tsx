import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { CatalogProduct } from "@/data/productsCatalog";
import { formatIdr } from "@/data/productsCatalog";

type ProductDetailDialogProps = {
  product: CatalogProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ProductDetailDialog = ({ product, open, onOpenChange }: ProductDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] max-w-2xl gap-0 overflow-hidden overflow-y-auto border border-harvest/25 bg-earth-gradient p-0 text-primary-foreground shadow-2xl shadow-black/40 sm:rounded-sm [&>button]:text-primary-foreground/85 [&>button]:ring-offset-soil [&>button]:hover:bg-primary-foreground/10 [&>button]:hover:text-primary-foreground"
      >
        {product ? (
          <>
            <div className="relative h-44 w-full shrink-0 overflow-hidden sm:h-52">
              <img src={product.image} alt={product.title} className="h-full w-full object-cover" width={960} height={400} />
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
                <p className="font-heading text-base font-bold text-harvest sm:text-lg">
                  {formatIdr(product.price)}
                  {product.priceNote ? (
                    <span className="ml-1 font-body text-sm font-normal text-primary-foreground/70">{product.priceNote}</span>
                  ) : null}
                </p>
              </DialogHeader>
              {product.items && product.items.length > 0 ? (
                <div className="mt-5 border-t border-primary-foreground/10 pt-5 sm:mt-6 sm:pt-6">
                  <p className="mb-2 font-body text-xs font-semibold uppercase tracking-[0.2em] text-harvest sm:mb-3">Varian dan komoditas</p>
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
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
