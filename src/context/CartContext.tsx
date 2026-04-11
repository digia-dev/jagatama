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
  title: string;
  unitPrice: number;
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  addProduct: (product: { id: string; title: string; unitPrice: number }, delta?: number) => void;
  setProductQty: (productId: string, qty: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  getQty: (productId: string) => number;
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
    (product: { id: string; title: string; unitPrice: number }, delta = 1) => {
      const n = Math.max(1, Math.floor(delta));
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productId === product.id);
        if (i === -1) {
          return [...prev, { productId: product.id, title: product.title, unitPrice: product.unitPrice, qty: n }];
        }
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + n };
        return next;
      });
    },
    [],
  );

  const setProductQty = useCallback((productId: string, qty: number) => {
    const q = Math.floor(qty);
    if (q <= 0) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = { ...next[i], qty: q };
      return next;
    });
  }, []);

  const increment = useCallback((productId: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId);
      if (i === -1) return prev;
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + 1 };
      return next;
    });
  }, []);

  const decrement = useCallback((productId: string) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.productId === productId);
      if (i === -1) return prev;
      const q = prev[i].qty - 1;
      if (q <= 0) return prev.filter((l) => l.productId !== productId);
      const next = [...prev];
      next[i] = { ...next[i], qty: q };
      return next;
    });
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const getQty = useCallback(
    (productId: string) => lines.find((l) => l.productId === productId)?.qty ?? 0,
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
