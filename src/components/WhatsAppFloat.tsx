import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Phone, X } from "lucide-react";
import { whatsappContacts } from "@/data/whatsappContacts";
import { cn } from "@/lib/utils";

const WA_LOGO = "https://api.vadr.my.id//uploads/img_68c3ca1163b892.70450478.webp";

const WhatsAppFloat = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-[102] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-2.5 shadow-lg transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2",
          open && "ring-4 ring-[#25D366]/35",
        )}
        aria-label="Buka pilihan kontak WhatsApp"
        aria-expanded={open}
      >
        <img src={WA_LOGO} alt="" className="h-full w-full object-contain" width={40} height={40} />
      </button>

      <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay
            className={cn(
              "fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px]",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            )}
          />
          <DialogPrimitive.Content
            onOpenAutoFocus={(e) => e.preventDefault()}
            className={cn(
              "fixed z-[101] w-[min(calc(100vw-2rem),20rem)] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-black/20",
              "bottom-[calc(1.5rem+3.5rem+0.75rem)] right-6",
              "origin-bottom-right",
              "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              "data-[state=open]:slide-in-from-bottom-3 data-[state=closed]:slide-out-to-bottom-3",
              "duration-200 ease-out",
            )}
          >
            <DialogPrimitive.Title className="sr-only">Hubungi via WhatsApp</DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">Pilih salah satu kontak untuk membuka WhatsApp</DialogPrimitive.Description>

            <div className="relative border-b border-border bg-gradient-to-r from-[#25D366]/8 to-transparent px-5 py-4">
              <p className="font-heading text-base font-semibold text-foreground">Hubungi via WhatsApp</p>
              <p className="mt-0.5 font-body text-sm text-muted-foreground">Pilih salah satu kontak</p>
            </div>

            <div className="flex flex-col gap-0.5 p-2">
              {whatsappContacts.map((c) => (
                <a
                  key={c.waId}
                  href={`https://wa.me/${c.waId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-foreground transition-colors hover:bg-[#25D366]/10"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/15">
                    <Phone className="h-4 w-4 text-[#128C7E]" aria-hidden />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  </div>
                </a>
              ))}
            </div>

            <DialogPrimitive.Close
              type="button"
              className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground opacity-80 transition-opacity hover:bg-secondary hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Tutup"
            >
              <X className="h-4 w-4" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default WhatsAppFloat;
