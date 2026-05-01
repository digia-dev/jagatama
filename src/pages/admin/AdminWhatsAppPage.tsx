import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { Phone } from "lucide-react";

type WaContact = { id: number; label: string; phone: string; department: string; is_primary: number; is_active: number; sort_order: number; };
const emptyForm = (): Omit<WaContact, "id"> => ({ label: "", phone: "", department: "", is_primary: 0, is_active: 1, sort_order: 0 });

const AdminWhatsAppPage = () => {
  const qc = useQueryClient();
  const { data: rows, isPending } = useQuery<WaContact[]>({ queryKey: ["cms", "whatsapp", "admin"], queryFn: () => cmsFetch("whatsapp.php") as Promise<WaContact[]> });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd = () => { setEditingId(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (c: WaContact) => { setEditingId(c.id); setForm({ label: c.label, phone: c.phone, department: c.department, is_primary: c.is_primary, is_active: c.is_active, sort_order: c.sort_order }); setDialogOpen(true); };

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!form.label || !form.phone) throw new Error("Label dan nomor telepon wajib diisi.");
      const body = JSON.stringify(form);
      if (editingId) await cmsFetch(`whatsapp.php/${editingId}`, { method: "PUT", body });
      else await cmsFetch("whatsapp.php", { method: "POST", body });
    },
    onSuccess: () => { toast.success("Kontak WhatsApp disimpan."); qc.invalidateQueries({ queryKey: ["cms"] }); setDialogOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => cmsFetch(`whatsapp.php/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Kontak dihapus."); qc.invalidateQueries({ queryKey: ["cms"] }); setDeleteId(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Kontak WhatsApp</h1>
          <p className="text-sm text-muted-foreground mt-1">Kelola nomor WA yang tampil di situs. Tandai satu sebagai Utama untuk tombol floating.</p>
        </div>
        <Button onClick={openAdd}>Tambah Kontak</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Nomor</TableHead>
              <TableHead className="hidden sm:table-cell">Departemen</TableHead>
              <TableHead className="w-24 text-center">Utama</TableHead>
              <TableHead className="w-20 text-center">Aktif</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (<TableRow><TableCell colSpan={6} className="text-muted-foreground">Memuat…</TableCell></TableRow>)
              : (rows ?? []).length === 0 ? (<TableRow><TableCell colSpan={6} className="text-muted-foreground">Belum ada kontak WA.</TableCell></TableRow>)
              : (rows ?? []).map(c => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366]/15">
                        <Phone className="h-4 w-4 text-[#128C7E]" />
                      </div>
                      <span className="font-medium">{c.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">+{c.phone}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{c.department || "—"}</TableCell>
                  <TableCell className="text-center">
                    {c.is_primary ? <Badge className="bg-harvest text-white">Utama</Badge> : <span className="text-xs text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${c.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{c.is_active ? "✓" : "✗"}</span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(c)}>Ubah</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(c.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editingId ? "Ubah Kontak WA" : "Tambah Kontak WA"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={form.label} onChange={e => setForm(p => ({ ...p, label: e.target.value }))} placeholder="CS Utama" />
            </div>
            <div className="space-y-2">
              <Label>Nomor HP (tanpa + atau 0, gunakan 62...)</Label>
              <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="6285743855637" />
              <p className="text-xs text-muted-foreground">Contoh: 6285743855637 (untuk +62 857-4385-5637)</p>
            </div>
            <div className="space-y-2">
              <Label>Departemen (Opsional)</Label>
              <Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="Customer Service" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Urutan</Label>
                <Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Aktif</Label>
                <div className="flex items-center pt-2"><Switch checked={form.is_active === 1} onCheckedChange={v => setForm(p => ({ ...p, is_active: v ? 1 : 0 }))} /></div>
              </div>
              <div className="space-y-2">
                <Label>Utama</Label>
                <div className="flex items-center pt-2"><Switch checked={form.is_primary === 1} onCheckedChange={v => setForm(p => ({ ...p, is_primary: v ? 1 : 0 }))} /></div>
              </div>
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
          <AlertDialogHeader><AlertDialogTitle>Hapus kontak?</AlertDialogTitle><AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => deleteId !== null && delMut.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminWhatsAppPage;
