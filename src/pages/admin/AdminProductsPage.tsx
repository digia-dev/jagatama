import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import type { ProductApiRow } from "@/hooks/useCmsQueries";
import { filterProductApiRows, uniqueCategoriesFromProductRows } from "@/lib/filterCatalogProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { formatIdr } from "@/data/productsCatalog";

const ALL = "__all__";

type VariantRow = { id?: number; label: string; price: number; sort_order?: number };

interface ProductForm {
  title: string;
  category: string;
  description: string;
  image_url: string;
  price: number;
  price_note: string;
  sort_order: number;
  variants: VariantRow[];
}

const emptyForm = (): ProductForm => ({
  title: "",
  category: "",
  description: "",
  image_url: "",
  price: 0,
  price_note: "",
  sort_order: 0,
  variants: [],
});

const AdminProductsPage = () => {
  const qc = useQueryClient();
  const { data: rows, isPending } = useQuery({
    queryKey: ["cms", "products", "admin"],
    queryFn: () => cmsFetch("products.php") as Promise<ProductApiRow[]>,
  });

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(ALL);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => uniqueCategoriesFromProductRows(rows ?? []), [rows]);

  const filtered = useMemo(() => {
    const cat = category === ALL ? "" : category;
    return filterProductApiRows(rows ?? [], search, cat);
  }, [rows, search, category]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (p: ProductApiRow) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category ?? "",
      description: p.description,
      image_url: p.image_url,
      price: p.price,
      price_note: p.price_note,
      sort_order: p.sort_order,
      variants: p.variants?.map(v => ({ id: v.id, label: v.label, price: v.price ?? 0, sort_order: v.sort_order })) ?? [],
    });
    setDialogOpen(true);
  };

  const addVariant = () => setForm((p: ProductForm) => ({ ...p, variants: [...p.variants, { label: "", price: 0 }] }));
  const removeVariant = (i: number) => setForm((p: ProductForm) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  const setVariantField = (i: number, field: keyof VariantRow, val: string | number) =>
    setForm((p: ProductForm) => ({ ...p, variants: p.variants.map((v, idx) => idx === i ? { ...v, [field]: val } : v) }));

  const saveMut = useMutation({
    mutationFn: async () => {
      const body = {
        title: form.title,
        category: form.category ?? "",
        description: form.description ?? "",
        image_url: form.image_url ?? "",
        price: Number(form.price) || 0,
        price_note: form.price_note ?? "",
        sort_order: Number(form.sort_order) || 0,
        variants: form.variants,
      };
      if (!body.title) throw new Error("Judul wajib diisi.");
      if (editingId) {
        await cmsFetch(`products.php/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await cmsFetch("products.php", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
    },
    onSuccess: () => {
      toast.success("Produk disimpan.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: number) => {
      await cmsFetch(`products.php/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Produk dihapus.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await cmsUploadFile(f);
      setForm((p: ProductForm) => ({ ...p, image_url: url }));
      toast.success("Gambar diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const colCount = 7;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-foreground">Produk</h1>
        <Button type="button" onClick={openAdd}>
          Tambah produk
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-0 flex-1 space-y-2 sm:min-w-[200px]">
          <Label htmlFor="admin-produk-cari">Cari</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="admin-produk-cari"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Judul, deskripsi, kategori…"
              className="border-border bg-background pl-9"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-52 md:w-60">
          <Label htmlFor="admin-produk-kategori">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="admin-produk-kategori" className="border-border bg-background">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>Semua kategori</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] min-w-[88px]">Gambar</TableHead>
              <TableHead className="min-w-[160px]">Judul</TableHead>
              <TableHead className="hidden min-w-[100px] lg:table-cell">Kategori</TableHead>
              <TableHead className="hidden min-w-[140px] md:table-cell">Harga</TableHead>
              <TableHead className="hidden w-[72px] sm:table-cell">Urut</TableHead>
              <TableHead className="hidden min-w-[80px] xl:table-cell">Varian</TableHead>
              <TableHead className="w-[1%] whitespace-nowrap text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={colCount} className="text-muted-foreground">
                  Memuat…
                </TableCell>
              </TableRow>
            ) : filtered.length ? (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="align-middle">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-14 w-[88px] rounded-md border border-border/60 object-cover" />
                    ) : (
                      <div className="flex h-14 w-[88px] items-center justify-center rounded-md border border-dashed border-border bg-muted/50 text-[10px] text-muted-foreground">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[280px] align-middle font-medium lg:max-w-md xl:max-w-lg">
                    <span className="line-clamp-2">{p.title}</span>
                  </TableCell>
                  <TableCell className="hidden align-middle text-muted-foreground lg:table-cell">{p.category || "—"}</TableCell>
                  <TableCell className="hidden align-middle text-sm tabular-nums md:table-cell">
                    {formatIdr(p.price)}
                    {p.price_note ? <span className="mt-0.5 block text-xs font-normal text-muted-foreground">{p.price_note}</span> : null}
                  </TableCell>
                  <TableCell className="hidden align-middle tabular-nums sm:table-cell">{p.sort_order}</TableCell>
                  <TableCell className="hidden align-middle text-sm text-muted-foreground xl:table-cell">
                    {p.variants?.length ? `${p.variants.length} item` : "—"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right align-middle">
                    <Button type="button" variant="outline" size="sm" className="mr-2" onClick={() => openEdit(p)}>
                      Ubah
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteId(p.id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="text-muted-foreground">
                  {rows?.length ? "Tidak ada produk yang cocok dengan filter." : "Belum ada produk."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingId ? "Ubah produk" : "Tambah produk"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={form.title ?? ""} onChange={(e) => setForm((p: ProductForm) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input
                value={form.category ?? ""}
                onChange={(e) => setForm((p: ProductForm) => ({ ...p, category: e.target.value }))}
                placeholder="Mis. Buah, Sayuran, Peternakan"
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi</Label>
              <Textarea value={form.description ?? ""} onChange={(e) => setForm((p: ProductForm) => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Gambar</Label>
              {form.image_url ? <img src={form.image_url} alt="" className="max-h-32 rounded-md object-cover" /> : null}
              <Input value={form.image_url ?? ""} onChange={(e) => setForm((p: ProductForm) => ({ ...p, image_url: e.target.value }))} />
              <Input type="file" accept="image/*" disabled={uploading} onChange={onFile} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Harga (IDR)</Label>
                <Input
                  type="number"
                  min={0}
                  value={form.price ?? 0}
                  onChange={(e) => setForm((p: ProductForm) => ({ ...p, price: parseInt(e.target.value, 10) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Catatan harga</Label>
                <Input value={form.price_note ?? ""} onChange={(e) => setForm((p: ProductForm) => ({ ...p, price_note: e.target.value }))} placeholder="per kg" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm((p: ProductForm) => ({ ...p, sort_order: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Varian / Komoditas</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Tambah Varian</Button>
              </div>
              {form.variants.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Belum ada varian. Klik "Tambah Varian" untuk menambahkan.</p>
              ) : (
                <div className="space-y-2">
                  {form.variants.map((v, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <Input
                          value={v.label}
                          onChange={e => setVariantField(i, "label", e.target.value)}
                          placeholder="Nama varian (mis. Fujisawa)"
                        />
                      </div>
                      <div className="w-28 space-y-1">
                        <Input
                          type="number"
                          min={0}
                          value={v.price}
                          onChange={e => setVariantField(i, "price", parseInt(e.target.value) || 0)}
                          placeholder="Harga"
                        />
                      </div>
                      <Button type="button" variant="ghost" size="sm" className="shrink-0 text-destructive" onClick={() => removeVariant(i)}>✕</Button>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground">Harga 0 = pakai harga produk utama</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              {saveMut.isPending ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus produk?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId !== null) delMut.mutate(deleteId);
              }}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProductsPage;
