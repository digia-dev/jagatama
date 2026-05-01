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
import { Star } from "lucide-react";

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
        <Button onClick={openAdd}>Tambah Testimoni</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nama & Peran</TableHead>
              <TableHead className="hidden md:table-cell">Konten</TableHead>
              <TableHead className="w-20 text-center">Rating</TableHead>
              <TableHead className="w-20 text-center">Aktif</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow><TableCell colSpan={6} className="text-muted-foreground">Memuat…</TableCell></TableRow>
            ) : (rows ?? []).length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-muted-foreground">Belum ada testimoni.</TableCell></TableRow>
            ) : (rows ?? []).map(t => (
              <TableRow key={t.id}>
                <TableCell>
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-border" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">–</div>
                  )}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{t.content}</p>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-harvest text-harvest" : "text-border"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${t.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                    {t.is_active ? "✓" : "✗"}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(t)}>Ubah</Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteId(t.id)}>Hapus</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
              {form.avatar_url && <img src={form.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />}
              <Input value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} placeholder="https://... atau upload" />
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

export default AdminTestimoniPage;
