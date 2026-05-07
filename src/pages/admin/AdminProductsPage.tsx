import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, LayoutGrid, List, MoreVertical, Edit, Trash2, Image as ImageIcon, X } from "lucide-react";
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
import MediaLibraryDialog from "@/components/admin/MediaLibraryDialog";
import { formatIdr } from "@/data/productsCatalog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const ALL = "__all__";

type VariantRow = { id?: number; label: string; price: number; image_url?: string; sort_order?: number };

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
      variants: p.variants?.map(v => ({ 
        id: v.id, 
        label: v.label, 
        price: v.price ?? 0, 
        image_url: (v as any).image_url ?? "", 
        sort_order: v.sort_order 
      })) ?? [],
    });
    setDialogOpen(true);
  };

  const addVariant = () => setForm((p: ProductForm) => ({ ...p, variants: [...p.variants, { label: "", price: 0, image_url: "" }] }));
  const removeVariant = (i: number) => setForm((p: ProductForm) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }));
  const setVariantField = (i: number, field: keyof VariantRow, val: any) =>
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-foreground">Produk</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-md mr-2">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button type="button" onClick={openAdd}>
            Tambah produk
          </Button>
        </div>
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
              className="border-border bg-background pl-9 h-9"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-52 md:w-60">
          <Label htmlFor="admin-produk-kategori">Kategori</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="admin-produk-kategori" className="border-border bg-background h-9">
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

      {isPending ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Memuat…</div>
      ) : filtered.length === 0 ? (
        <div className="flex h-64 items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/30 text-muted-foreground text-sm">
          {rows?.length ? "Tidak ada produk yang cocok dengan filter." : "Belum ada produk."}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="group relative flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer" onClick={() => openEdit(p)}>
              <div className="relative aspect-square bg-muted">
                {p.image_url ? (
                  <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-7 w-7 shadow-sm">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEdit(p)}>
                        <Edit className="h-3.5 w-3.5 mr-2" /> Ubah
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {p.category && (
                  <Badge variant="secondary" className="absolute top-1.5 left-1.5 bg-background/80 backdrop-blur-sm text-[9px] px-1.5 h-4">
                    {p.category}
                  </Badge>
                )}
              </div>
              <div className="p-2.5 flex-1 flex flex-col">
                <h3 className="font-bold text-[11px] leading-tight line-clamp-2 mb-1.5 group-hover:text-harvest transition-colors">
                  {p.title}
                </h3>
                <div className="mt-auto">
                  <p className="text-xs font-bold text-harvest">
                    {formatIdr(p.price)}
                    {p.price_note && <span className="text-[9px] font-normal text-muted-foreground ml-0.5">/{p.price_note}</span>}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/40">
                    <span className="text-[8px] text-muted-foreground uppercase tracking-wider">#{p.sort_order}</span>
                    {p.variants?.length > 0 && <Badge variant="outline" className="text-[8px] h-3.5 px-1">{p.variants.length} Var</Badge>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[80px] min-w-[80px]">Gambar</TableHead>
                <TableHead className="min-w-[160px]">Judul</TableHead>
                <TableHead className="hidden min-w-[100px] lg:table-cell">Kategori</TableHead>
                <TableHead className="hidden min-w-[120px] md:table-cell">Harga</TableHead>
                <TableHead className="hidden w-[60px] sm:table-cell text-center">Urut</TableHead>
                <TableHead className="w-[1%] whitespace-nowrap text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => openEdit(p)}>
                  <TableCell className="align-middle">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="h-10 w-10 rounded-md border border-border/60 object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-dashed border-border bg-muted/50 text-[10px] text-muted-foreground">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[280px] align-middle font-medium lg:max-w-md">
                    <span className="line-clamp-1 text-sm">{p.title}</span>
                  </TableCell>
                  <TableCell className="hidden align-middle text-xs text-muted-foreground lg:table-cell">{p.category || "—"}</TableCell>
                  <TableCell className="hidden align-middle text-xs tabular-nums md:table-cell text-harvest font-bold">
                    {formatIdr(p.price)}
                    {p.price_note ? <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">{p.price_note}</span> : null}
                  </TableCell>
                  <TableCell className="hidden align-middle tabular-nums sm:table-cell text-center text-xs">{p.sort_order}</TableCell>
                  <TableCell className="whitespace-nowrap text-right align-middle">
                    <div className="flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-harvest" onClick={() => openEdit(p)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
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
              <Label>Gambar Utama Produk</Label>
              {form.image_url ? <img src={form.image_url} alt="" className="max-h-32 rounded-md object-cover border border-border/50" /> : null}
              <div className="flex gap-2">
                <Input className="flex-1" value={form.image_url ?? ""} onChange={(e) => setForm((p: ProductForm) => ({ ...p, image_url: e.target.value }))} />
                <MediaLibraryDialog onSelect={(url) => setForm((p: ProductForm) => ({ ...p, image_url: url }))} />
              </div>
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
            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-bold">Varian / Komoditas</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Tambah Varian</Button>
              </div>
              {form.variants.length === 0 ? (
                <p className="text-xs text-muted-foreground italic bg-muted/30 p-4 rounded-lg text-center border border-dashed border-border">Belum ada varian. Klik "Tambah Varian" untuk menambahkan.</p>
              ) : (
                <div className="space-y-3">
                  {form.variants.map((v, i) => (
                    <div key={i} className="relative p-4 bg-muted/20 rounded-xl border border-border/50 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="relative group/var h-14 w-14 shrink-0 bg-card rounded-lg border border-border overflow-hidden flex items-center justify-center">
                              {v.image_url ? (
                                <>
                                  <img src={v.image_url} alt="" className="h-full w-full object-cover" />
                                  <button onClick={() => setVariantField(i, "image_url", "")} className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover/var:opacity-100 transition-opacity">
                                    <X className="h-3 w-3" />
                                  </button>
                                </>
                              ) : (
                                <ImageIcon className="h-6 w-6 text-muted-foreground/30" />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover/var:bg-black/20 transition-all flex items-center justify-center">
                                <MediaLibraryDialog 
                                  trigger={<Button variant="ghost" size="icon" className="h-full w-full rounded-none opacity-0 group-hover/var:opacity-100 text-white hover:text-white hover:bg-transparent"><ImageIcon className="h-4 w-4" /></Button>}
                                  onSelect={url => setVariantField(i, "image_url", url)} 
                                />
                              </div>
                            </div>
                            <div className="flex-1 space-y-2">
                              <Input
                                value={v.label}
                                className="h-8 text-xs font-bold"
                                onChange={e => setVariantField(i, "label", e.target.value)}
                                placeholder="Nama varian (mis. Fujisawa (Jepang))"
                              />
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-muted-foreground shrink-0 font-bold uppercase tracking-wider">Harga RP:</span>
                                <Input
                                  type="number"
                                  min={0}
                                  className="h-7 text-[11px] tabular-nums"
                                  value={v.price}
                                  onChange={e => setVariantField(i, "price", parseInt(e.target.value) || 0)}
                                  placeholder="Harga (0 = ikut utama)"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeVariant(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-muted-foreground bg-amber-50 text-amber-700 px-3 py-1.5 rounded border border-amber-100 italic">
                    Tips: Harga 0 akan otomatis mengikuti harga produk utama.
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-row pt-4 mt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button type="button" onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              {saveMut.isPending ? "Menyimpan…" : "Simpan Produk"}
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
