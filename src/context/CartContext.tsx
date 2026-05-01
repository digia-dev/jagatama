import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartLine = {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  title: string;
  unitPrice: number;
  qty: number;
};

type AddProductArgs = {
  id: string;
  title: string;
  unitPrice: number;
  variantId?: string;
  variantLabel?: string;
};

type CartContextValue = {
  lines: CartLine[];
  addProduct: (product: AddProductArgs, delta?: number) => void;
  setProductQty: (productId: string, qty: number, variantId?: string) => void;
  increment: (productId: string, variantId?: string) => void;
  decrement: (productId: string, variantId?: string) => void;
  removeProduct: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  getQty: (productId: string, variantId?: string) => number;
  itemCount: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const addProduct = useCallback(
    (product: AddProductArgs, delta = 1) => {
      const n = Math.max(1, Math.floor(delta));
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productId === product.id && l.variantId === product.variantId);
        if (i === -1) {
          return [
            ...prev,
            {
              productId: product.id,
              variantId: product.variantId,
              variantLabel: product.variantLabel,
              title: product.title,
              unitPrice: product.unitPrice,
              qty: n,
            },
          ];
        }
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + n };
        return next;
      });
    },
    [],
  );

  const setProductQty = useCallback((productId: string, qty: number, variantId?: string) => {
    const q = Math.floor(qty);
    if (q <= 0) {
      setLines((prev) => prev.filter((l) => !(l.productId === productId && l.variantId === variantId)));
      return;
    }
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.variantId === variantId);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = { ...next[i], qty: q };
      return next;
    });
  }, []);

  const increment = useCallback((productId: string, variantId?: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.variantId === variantId);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + 1 };
      return next;
    });
  }, []);

  const decrement = useCallback((productId: string, variantId?: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId && l.variantId === variantId);
      if (i === -1) return prev;
      const q = prev[i].qty - 1;
      if (q <= 0) return prev.filter((l) => !(l.productId === productId && l.variantId === variantId));
      const next = [...prev];
      next[i] = { ...next[i], qty: q };
      return next;
    });
  }, []);

  const removeProduct = useCallback((productId: string, variantId?: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.variantId === variantId)));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const getQty = useCallback(
    (productId: string, variantId?: string) =>
      lines.find((l) => l.productId === productId && l.variantId === variantId)?.qty ?? 0,
    [lines],
  );

  const itemCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unitPrice * l.qty, 0), [lines]);

  const value = useMemo(
    () => ({
      lines,
      addProduct,
      setProductQty,
      increment,
      decrement,
      removeProduct,
      clearCart,
      getQty,
      itemCount,
      subtotal,
      cartOpen,
      setCartOpen,
    }),
    [
      lines,
      addProduct,
      setProductQty,
      increment,
      decrement,
      removeProduct,
      clearCart,
      getQty,
      itemCount,
      subtotal,
      cartOpen,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
