import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatIdr } from "@/data/productsCatalog";

// TASK-10: Sticky mobile bottom cart bar - appears when items in cart
const CartBottomBar = () => {
  const { itemCount, subtotal, setCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] md:hidden">
      <div className="border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)]">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl bg-harvest px-4 py-3 shadow-sm transition active:scale-[0.98]"
          aria-label={`Buka keranjang, ${itemCount} item, total ${formatIdr(subtotal)}`}
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
            <ShoppingCart className="h-5 w-5 text-white" aria-hidden />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white font-body text-[10px] font-bold text-harvest">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <span className="font-body text-sm font-semibold text-white">
              {itemCount} produk di keranjang
            </span>
            <span className="font-heading text-sm font-bold text-white tabular-nums">
              {formatIdr(subtotal)}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CartBottomBar;
