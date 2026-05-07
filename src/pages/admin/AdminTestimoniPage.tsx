import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Star, LayoutGrid, List, MoreVertical, Edit, Trash2, Quote } from "lucide-react";
import MediaLibraryDialog from "@/components/admin/MediaLibraryDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar_url: string;
  rating: number;
  is_active: number;
  sort_order: number;
};

const emptyForm = (): Omit<Testimonial, "id"> => ({
  name: "", role: "", content: "", avatar_url: "",
  rating: 5, is_active: 1, sort_order: 0,
});

const AdminTestimoniPage = () => {
  const qc = useQueryClient();
  const { data: rows, isPending } = useQuery<Testimonial[]>({
    queryKey: ["cms", "testimonials", "admin"],
    queryFn: () => cmsFetch("testimonials.php") as Promise<Testimonial[]>,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const openAdd = () => { setEditingId(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setForm({ name: t.name, role: t.role, content: t.content, avatar_url: t.avatar_url, rating: t.rating, is_active: t.is_active, sort_order: t.sort_order });
    setDialogOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.content) throw new Error("Nama dan konten wajib diisi.");
      const body = JSON.stringify(form);
      if (editingId) {
        await cmsFetch(`testimonials.php/${editingId}`, { method: "PUT", body });
      } else {
        await cmsFetch("testimonials.php", { method: "POST", body });
      }
    },
    onSuccess: () => { toast.success("Testimoni disimpan."); qc.invalidateQueries({ queryKey: ["cms"] }); setDialogOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => cmsFetch(`testimonials.php/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Testimoni dihapus."); qc.invalidateQueries({ queryKey: ["cms"] }); setDeleteId(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true);
    try { const url = await cmsUploadFile(f); setForm(p => ({ ...p, avatar_url: url })); toast.success("Foto diunggah."); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Upload gagal."); }
    finally { setUploading(false); e.target.value = ""; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-foreground">Testimoni</h1>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-md mr-2">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" onClick={openAdd}>Tambah Testimoni</Button>
        </div>
      </div>

      {isPending ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Memuat…</div>
      ) : (rows ?? []).length === 0 ? (
        <div className="flex h-64 items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/30 text-muted-foreground text-sm">
          Belum ada testimoni.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(rows ?? []).map((t) => (
            <div key={t.id} className={`group relative bg-card p-5 rounded-2xl border ${t.is_active ? "border-border shadow-sm" : "border-dashed border-muted bg-muted/10 opacity-70"} hover:shadow-md transition-all cursor-pointer`} onClick={() => openEdit(t)}>
              <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(t)}>
                      <Edit className="h-3.5 w-3.5 mr-2" /> Ubah
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(t.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-3 mb-3">
                {t.avatar_url ? (
                  <img src={t.avatar_url} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-harvest/10" />
                ) : (
                  <div className="h-11 w-11 rounded-full bg-harvest/5 flex items-center justify-center text-harvest/40">
                    <Quote className="h-5 w-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-sm leading-tight truncate">{t.name}</h3>
                  <p className="text-[10px] text-muted-foreground truncate">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-0.5 mb-2.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-harvest text-harvest" : "text-border"}`} />
                ))}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-3 italic leading-relaxed">
                "{t.content}"
              </p>

              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Urutan: {t.sort_order}</span>
                <Badge variant={t.is_active ? "success" : "secondary"} className="text-[8px] h-3.5 px-1.5">
                  {t.is_active ? "Aktif" : "Off"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card text-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Foto</TableHead>
                <TableHead>Nama & Peran</TableHead>
                <TableHead className="hidden md:table-cell">Konten</TableHead>
                <TableHead className="w-20 text-center">Rating</TableHead>
                <TableHead className="w-20 text-center">Aktif</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(rows ?? []).map(t => (
                <TableRow key={t.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => openEdit(t)}>
                  <TableCell>
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">–</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="line-clamp-1 text-xs text-muted-foreground">{t.content}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < t.rating ? "fill-harvest text-harvest" : "text-border"}`} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${t.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {t.is_active ? "✓" : "✗"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-harvest" onClick={() => openEdit(t)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(t.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Ubah Testimoni" : "Tambah Testimoni"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Nama</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Peran / Jabatan</Label>
                <Input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="Mis. Bupati Tegal" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Konten Testimoni</Label>
              <Textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Foto (Opsional)</Label>
              {form.avatar_url && <img src={form.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-border shadow-sm mb-2" />}
              <div className="flex gap-2">
                <Input className="flex-1" value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} placeholder="Pilih dari galeri atau upload..." />
                <MediaLibraryDialog onSelect={(url) => setForm(p => ({ ...p, avatar_url: url }))} />
              </div>
              <Input type="file" accept="image/*" disabled={uploading} onChange={onFile} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Rating (1–5)</Label>
                <Input type="number" min={1} max={5} value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))} />
              </div>
              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Aktif</Label>
                <div className="flex items-center pt-2">
                  <Switch checked={form.is_active === 1} onCheckedChange={v => setForm(p => ({ ...p, is_active: v ? 1 : 0 }))} />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
              {saveMut.isPending ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus testimoni?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId !== null && delMut.mutate(deleteId)}>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Badge = ({ children, variant = "secondary", className = "" }: { children: React.ReactNode, variant?: "secondary" | "success" | "outline", className?: string }) => {
  const styles = {
    secondary: "bg-muted text-muted-foreground",
    success: "bg-green-100 text-green-700",
    outline: "border border-border text-muted-foreground"
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${styles[variant]} ${className}`}>{children}</span>;
};

export default AdminTestimoniPage;
