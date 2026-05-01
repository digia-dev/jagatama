import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";

type TeamMember = { id: number; name: string; position: string; department: string; bio: string; avatar_url: string; sort_order: number; is_active: number; };
const emptyForm = (): Omit<TeamMember, "id"> => ({ name: "", position: "", department: "", bio: "", avatar_url: "", sort_order: 0, is_active: 1 });

const AdminTeamPage = () => {
  const qc = useQueryClient();
  const { data: rows, isPending } = useQuery<TeamMember[]>({ queryKey: ["cms", "team", "admin"], queryFn: () => cmsFetch("team.php") as Promise<TeamMember[]> });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => { setEditingId(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (m: TeamMember) => { setEditingId(m.id); setForm({ name: m.name, position: m.position, department: m.department, bio: m.bio, avatar_url: m.avatar_url, sort_order: m.sort_order, is_active: m.is_active }); setDialogOpen(true); };

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!form.name) throw new Error("Nama wajib diisi.");
      const body = JSON.stringify(form);
      if (editingId) await cmsFetch(`team.php/${editingId}`, { method: "PUT", body });
      else await cmsFetch("team.php", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Data tim disimpan."); qc.invalidateQueries({ queryKey: ["cms"] }); setDialogOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => cmsFetch(`team.php/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Anggota dihapus."); qc.invalidateQueries({ queryKey: ["cms"] }); setDeleteId(null); },
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
        <h1 className="font-heading text-2xl font-bold">Struktural Tim</h1>
        <Button onClick={openAdd}>Tambah Anggota</Button>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead className="hidden sm:table-cell">Jabatan</TableHead>
              <TableHead className="hidden lg:table-cell">Departemen</TableHead>
              <TableHead className="w-16 text-center">Urut</TableHead>
              <TableHead className="w-20 text-center">Aktif</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (<TableRow><TableCell colSpan={7} className="text-muted-foreground">Memuat…</TableCell></TableRow>)
              : (rows ?? []).length === 0 ? (<TableRow><TableCell colSpan={7} className="text-muted-foreground">Belum ada anggota tim.</TableCell></TableRow>)
              : (rows ?? []).map(m => (
                <TableRow key={m.id}>
                  <TableCell>
                    {m.avatar_url ? <img src={m.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-border" />
                      : <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold">{m.name.charAt(0)}</div>}
                  </TableCell>
                  <TableCell className="font-medium">{m.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{m.position || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-sm">{m.department || "—"}</TableCell>
                  <TableCell className="text-center tabular-nums">{m.sort_order}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${m.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{m.is_active ? "✓" : "✗"}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(m)}>Ubah</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(m.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader><DialogTitle>{editingId ? "Ubah Anggota Tim" : "Tambah Anggota Tim"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Nama Lengkap</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Jabatan</Label><Input value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} placeholder="Direktur Utama" /></div>
              <div className="space-y-2"><Label>Departemen</Label><Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="Manajemen" /></div>
            </div>
            <div className="space-y-2"><Label>Bio (Opsional)</Label><Textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} /></div>
            <div className="space-y-2">
              <Label>Foto</Label>
              {form.avatar_url && <img src={form.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover" />}
              <Input value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} placeholder="https://..." />
              <Input type="file" accept="image/*" disabled={uploading} onChange={onFile} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Urutan</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} /></div>
              <div className="space-y-2"><Label>Tampilkan</Label><div className="flex items-center pt-2"><Switch checked={form.is_active === 1} onCheckedChange={v => setForm(p => ({ ...p, is_active: v ? 1 : 0 }))} /></div></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Batal</Button>
            <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>{saveMut.isPending ? "Menyimpan…" : "Simpan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus anggota tim?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => deleteId !== null && delMut.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTeamPage;
