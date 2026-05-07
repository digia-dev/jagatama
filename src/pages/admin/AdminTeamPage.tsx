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
import { LayoutGrid, List, MoreVertical, Edit, Trash2, User, Building2 } from "lucide-react";
import MediaLibraryDialog from "@/components/admin/MediaLibraryDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

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
        <div className="flex items-center gap-2">
          <div className="flex bg-muted p-1 rounded-md mr-2">
            <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("grid")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" onClick={openAdd}>Tambah Anggota</Button>
        </div>
      </div>

      {isPending ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">Memuat…</div>
      ) : (rows ?? []).length === 0 ? (
        <div className="flex h-64 items-center justify-center border-2 border-dashed border-border rounded-xl bg-muted/30 text-muted-foreground text-sm">
          Belum ada anggota tim.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {(rows ?? []).map((m) => (
            <div key={m.id} className={`group relative bg-card p-4 rounded-2xl border ${m.is_active ? "border-border shadow-sm" : "border-dashed border-muted opacity-70"} hover:shadow-md transition-all cursor-pointer`} onClick={() => openEdit(m)}>
              <div className="absolute top-3 right-3" onClick={e => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEdit(m)}>
                      <Edit className="h-3.5 w-3.5 mr-2" /> Ubah
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(m.id)}>
                      <Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative mb-3">
                  {m.avatar_url ? (
                    <img src={m.avatar_url} alt="" className="h-16 w-16 rounded-full object-cover ring-2 ring-harvest/10" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-7 w-7 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                
                <h3 className="font-bold text-xs leading-tight mb-1 truncate w-full px-1">{m.name}</h3>
                <p className="text-harvest font-semibold text-[10px] mb-1 truncate w-full">{m.position || "—"}</p>
                <div className="flex items-center justify-center gap-1 text-[9px] text-muted-foreground mb-3 opacity-80">
                  <Building2 className="h-2.5 w-2.5" />
                  <span className="truncate">{m.department || "Semua"}</span>
                </div>
                
                <div className="w-full pt-3 border-t border-border/40 flex items-center justify-between mt-auto">
                  <span className="text-[8px] text-muted-foreground uppercase tracking-wider">Ord: {m.sort_order}</span>
                  <div className={`h-1.5 w-1.5 rounded-full ${m.is_active ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-muted"}`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-card text-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
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
              {(rows ?? []).map(m => (
                <TableRow key={m.id} className="hover:bg-muted/30 cursor-pointer" onClick={() => openEdit(m)}>
                  <TableCell>
                    {m.avatar_url ? <img src={m.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover ring-2 ring-border" />
                      : <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">{m.name.charAt(0)}</div>}
                  </TableCell>
                  <TableCell className="font-medium text-sm">{m.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{m.position || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{m.department || "—"}</TableCell>
                  <TableCell className="text-center tabular-nums text-xs">{m.sort_order}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${m.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{m.is_active ? "✓" : "✗"}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-harvest" onClick={() => openEdit(m)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDeleteId(m.id)}><Trash2 className="h-4 w-4" /></Button>
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
              {form.avatar_url && <img src={form.avatar_url} alt="" className="h-20 w-20 rounded-full object-cover ring-2 ring-border shadow-sm mb-2" />}
              <div className="flex gap-2">
                <Input className="flex-1" value={form.avatar_url} onChange={e => setForm(p => ({ ...p, avatar_url: e.target.value }))} placeholder="Pilih dari galeri atau upload..." />
                <MediaLibraryDialog onSelect={(url) => setForm(p => ({ ...p, avatar_url: url }))} />
              </div>
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
