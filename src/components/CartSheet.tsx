import { useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { whatsappContacts } from "@/data/whatsappContacts";
import { formatIdr } from "@/data/productsCatalog";
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

function buildWhatsAppBody(
  lines: { title: string; unitPrice: number; qty: number }[],
  subtotal: number,
  recipientName: string,
  shippingAddress: string,
) {
  const header = "Halo, saya ingin memesan produk berikut:\n\n";
  const items = lines
    .map(
      (l) =>
        `• ${l.title} × ${l.qty} @ ${formatIdr(l.unitPrice)} → ${formatIdr(l.unitPrice * l.qty)}`,
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
  const [recipientName, setRecipientName] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [adminWaId, setAdminWaId] = useState(whatsappContacts[0].waId);

  const submitWhatsApp = () => {
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
    const body = buildWhatsAppBody(lines, subtotal, recipientName, shippingAddress);
    const url = `https://wa.me/${adminWaId}?text=${encodeURIComponent(body)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCartOpen(false);
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

        <ScrollArea className="h-[min(42vh,300px)] shrink-0 px-6">
          <div className="space-y-4 py-4">
            {lines.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">Keranjang kosong.</p>
            ) : (
              lines.map((line) => (
                <div key={line.productId} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-body text-sm font-medium leading-snug text-foreground">{line.title}</p>
                      <p className="font-body text-xs text-muted-foreground">{formatIdr(line.unitPrice)} / unit</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => removeProduct(line.productId)}
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
                        onClick={() => decrement(line.productId)}
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
                        onClick={() => increment(line.productId)}
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
                {whatsappContacts.map((c) => (
                  <SelectItem key={c.waId} value={c.waId}>
                    {c.name} · {c.phone}
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
            <Button type="button" className="w-full sm:w-auto" onClick={submitWhatsApp}>
              Kirim ke WhatsApp
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
