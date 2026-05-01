import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatIdr } from "@/data/productsCatalog";
import { Button } from "@/components/ui/button";

const MobileCheckoutBar = () => {
  const { itemCount, subtotal, setCartOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 md:hidden">
      <Button
        onClick={() => setCartOpen(true)}
        className="h-14 w-full justify-between rounded-xl bg-harvest px-6 text-white shadow-lg shadow-harvest/30 ring-1 ring-white/20 active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-harvest">
              {itemCount}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
              Total Pesanan
            </span>
            <span className="font-heading text-base font-bold tabular-nums">
              {formatIdr(subtotal)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 font-heading text-sm font-bold uppercase tracking-wide">
          Buka Keranjang
        </div>
      </Button>
    </div>
  );
};

export default MobileCheckoutBar;
