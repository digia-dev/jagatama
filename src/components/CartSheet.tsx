import { useState, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, type CartLine } from "@/context/CartContext";
import { whatsappContacts } from "@/data/whatsappContacts";
import { formatIdr } from "@/data/productsCatalog";
import { useWhatsAppContactsCms } from "@/hooks/useCmsQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import EmptyState from "@/components/EmptyState";

function buildWhatsAppBody(
  lines: CartLine[],
  subtotal: number,
  recipientName: string,
  shippingAddress: string,
) {
  const header = "Halo, saya ingin memesan produk berikut:\n\n";
  const items = lines
    .map(
      (l) =>
        `• ${l.title}${l.variantLabel ? ` (${l.variantLabel})` : ""} × ${l.qty} @ ${formatIdr(l.unitPrice)} → ${formatIdr(l.unitPrice * l.qty)}`,
    )
    .join("\n");
  const footer = `\n\nSubtotal: ${formatIdr(subtotal)}\n\nNama penerima:\n${recipientName.trim()}\n\nAlamat pengiriman:\n${shippingAddress.trim()}\n\nMohon konfirmasi ketersediaan dan ongkir. Terima kasih.`;
  return header + items + footer;
}

const CartSheet = () => {
  const {
    lines,
    cartOpen,
    setCartOpen,
    increment,
    decrement,
    removeProduct,
    clearCart,
    subtotal,
    itemCount,
  } = useCart();
  const { data: cmsContacts } = useWhatsAppContactsCms();
  const contacts = cmsContacts && cmsContacts.length > 0 ? cmsContacts : whatsappContacts.map(c => ({ id: 0, label: c.name, phone: c.waId, department: "Sales", is_primary: 1, is_active: 1 }));
  
  const [recipientName, setRecipientName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [adminWaId, setAdminWaId] = useState("");
  const [step, setStep] = useState<"cart" | "confirm">("cart");

  // Set default admin ID once contacts are loaded
  useEffect(() => {
    if (contacts.length > 0 && !adminWaId) {
      const primary = contacts.find(c => c.is_primary) || contacts[0];
      setAdminWaId(primary.phone);
    }
  }, [contacts, adminWaId]);

  const selectedAdmin = contacts.find((c) => c.phone === adminWaId) || contacts[0];

  const submitWhatsApp = () => {
    const body = buildWhatsAppBody(lines, subtotal, recipientName, shippingAddress);
    const url = `https://wa.me/${adminWaId}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCartOpen(false);
    setStep("cart");
    clearCart();
    toast.success("Pesanan dikirim! Admin akan segera merespons.");
  };

  const validateAndNext = () => {
    if (lines.length === 0) {
      toast.error("Keranjang masih kosong.");
      return;
    }
    if (!recipientName.trim()) {
      toast.error("Mohon isi nama penerima.");
      return;
    }
    if (!shippingAddress.trim()) {
      toast.error("Mohon isi alamat pengiriman.");
      return;
    }
    setStep("confirm");
  };

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex h-[100dvh] max-h-[100dvh] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <div className="border-b border-border px-6 pb-4 pt-6">
          <SheetHeader className="space-y-1 text-left">
            <SheetTitle className="font-heading text-xl">Keranjang</SheetTitle>
            <SheetDescription>
              {itemCount === 0
                ? "Belum ada item. Tambahkan dari bagian Produk."
                : `${itemCount} item di keranjang`}
            </SheetDescription>
          </SheetHeader>
        </div>

        {step === "cart" ? (
          <>
            <ScrollArea className="h-[min(42vh,300px)] shrink-0 px-6">
              <div className="space-y-4 py-4">
                {lines.length === 0 ? (
                  <EmptyState
                    title="Keranjang Kosong"
                    description="Sepertinya Anda belum menambahkan produk apapun ke keranjang."
                    action="Mulai Belanja"
                    onAction={() => setCartOpen(false)}
                  />
                ) : (
                  lines.map((line) => (
                    <div key={`${line.productId}-${line.variantId || "main"}`} className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-body text-sm font-medium leading-snug text-foreground">
                            {line.title}
                            {line.variantLabel && (
                              <span className="ml-1 text-xs text-harvest">({line.variantLabel})</span>
                            )}
                          </p>
                          <p className="font-body text-xs text-muted-foreground">{formatIdr(line.unitPrice)} / unit</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeProduct(line.productId, line.variantId)}
                          aria-label={`Hapus ${line.title} dari keranjang`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 rounded-md border border-border bg-background p-0.5">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => decrement(line.productId, line.variantId)}
                            aria-label="Kurangi jumlah"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="min-w-[2rem] text-center font-body text-sm font-medium tabular-nums">
                            {line.qty}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => increment(line.productId, line.variantId)}
                            aria-label="Tambah jumlah"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="font-body text-sm font-semibold tabular-nums text-foreground">
                          {formatIdr(line.unitPrice * line.qty)}
                        </p>
                      </div>
                      <Separator className="bg-border" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            <div className="space-y-4 border-t border-border bg-background px-6 py-5">
              <div className="flex items-center justify-between font-body text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold tabular-nums text-foreground">{formatIdr(subtotal)}</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="cart-name">Nama penerima</Label>
                  <Input
                    id="cart-name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Nama lengkap"
                    autoComplete="name"
                  />
                </div>
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="cart-address">Alamat pengiriman</Label>
                  <Textarea
                    id="cart-address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Jalan, RT/RW, kecamatan, kota, kode pos"
                    className="min-h-[100px] resize-y sm:min-h-[120px]"
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cart-admin">Admin WhatsApp</Label>
                <Select value={adminWaId} onValueChange={setAdminWaId}>
                  <SelectTrigger id="cart-admin" className="w-full">
                    <SelectValue placeholder="Pilih admin" />
                  </SelectTrigger>
                  <SelectContent>
                    {contacts.map((c) => (
                      <SelectItem key={c.phone} value={c.phone}>
                        {c.label} · {c.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={lines.length === 0}
                  onClick={() => {
                    clearCart();
                    toast.message("Keranjang dikosongkan.");
                  }}
                >
                  Kosongkan keranjang
                </Button>
                <Button type="button" className="w-full sm:w-auto bg-harvest hover:bg-harvest/90 text-white" onClick={validateAndNext}>
                  Lanjut ke Konfirmasi
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="flex-1 px-6">
              <div className="py-6 space-y-6">
                <div className="rounded-2xl border border-harvest/20 bg-harvest/5 p-4 text-center">
                  <p className="font-body text-sm font-semibold text-harvest">Pratinjau Pesanan</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                    Mohon periksa kembali sebelum mengirim ke WhatsApp
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 rounded-xl p-4 border border-border">
                    <h5 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">Item Pesanan</h5>
                    <div className="space-y-2">
                      {lines.map((l) => (
                        <div key={`${l.productId}-${l.variantId || "main"}`} className="flex justify-between text-sm font-body">
                          <span className="text-foreground">
                            {l.title}
                            {l.variantLabel && (
                              <span className="ml-1 text-[10px] text-harvest">({l.variantLabel})</span>
                            )}
                            {" "}× {l.qty}
                          </span>
                          <span className="font-semibold">{formatIdr(l.unitPrice * l.qty)}</span>
                        </div>
                      ))}
                      <Separator className="my-2 bg-border/60" />
                      <div className="flex justify-between text-base font-bold">
                        <span>Total</span>
                        <span className="text-harvest">{formatIdr(subtotal)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="bg-muted/20 rounded-xl p-4 border border-border">
                      <h5 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Penerima</h5>
                      <p className="font-body text-sm font-medium">{recipientName}</p>
                    </div>
                    <div className="bg-muted/20 rounded-xl p-4 border border-border">
                      <h5 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Admin</h5>
                      <p className="font-body text-sm font-medium">{selectedAdmin?.label || "Admin"}</p>
                    </div>
                  </div>

                  <div className="bg-muted/20 rounded-xl p-4 border border-border">
                    <h5 className="font-heading text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Alamat</h5>
                    <p className="font-body text-sm leading-relaxed">{shippingAddress}</p>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <p className="font-body text-[11px] text-blue-800 leading-relaxed">
                      * Setelah klik tombol kirim, WhatsApp Anda akan terbuka secara otomatis dengan pesan ter-format. 
                      Admin kami akan merespons dalam 1×24 jam kerja untuk info ongkir dan pembayaran.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="border-t border-border bg-background px-6 py-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button variant="ghost" onClick={() => setStep("cart")} className="font-semibold">
                Edit Pesanan
              </Button>
              <Button onClick={submitWhatsApp} className="bg-harvest hover:bg-harvest/90 text-white font-bold px-8 shadow-lg shadow-harvest/20">
                Konfirmasi & Kirim WA
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
