import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";
import { UserCog } from "lucide-react";

type AdminUser = { id: number; username: string; created_at: string; };

const AdminUsersPage = () => {
  const qc = useQueryClient();
  const { data: rows, isPending } = useQuery<AdminUser[]>({ queryKey: ["cms", "users", "admin"], queryFn: () => cmsFetch("users.php") as Promise<AdminUser[]> });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd = () => { setEditingId(null); setForm({ username: "", password: "" }); setDialogOpen(true); };
  const openEdit = (u: AdminUser) => { setEditingId(u.id); setForm({ username: u.username, password: "" }); setDialogOpen(true); };

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!form.username) throw new Error("Username wajib diisi.");
      if (!editingId && !form.password) throw new Error("Password wajib diisi untuk user baru.");
      const body = JSON.stringify(form);
      if (editingId) await cmsFetch(`users.php/${editingId}`, { method: "PUT", body });
      else await cmsFetch("users.php", { method: "POST", body });
    },
    onSuccess: () => { toast.success("User disimpan."); qc.invalidateQueries({ queryKey: ["cms", "users"] }); setDialogOpen(false); },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: number) => cmsFetch(`users.php/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("User dihapus."); qc.invalidateQueries({ queryKey: ["cms", "users"] }); setDeleteId(null); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Kelola User Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Tambah, ubah, atau hapus akun admin CMS.</p>
        </div>
        <Button onClick={openAdd}>Tambah User</Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Username</TableHead>
              <TableHead className="hidden sm:table-cell">Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (<TableRow><TableCell colSpan={4} className="text-muted-foreground">Memuat…</TableCell></TableRow>)
              : (rows ?? []).length === 0 ? (<TableRow><TableCell colSpan={4} className="text-muted-foreground">Belum ada user.</TableCell></TableRow>)
              : (rows ?? []).map(u => (
                <TableRow key={u.id}>
                  <TableCell className="text-muted-foreground">{u.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-harvest/10">
                        <UserCog className="h-4 w-4 text-harvest" />
                      </div>
                      <span className="font-medium">{u.username}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{new Date(u.created_at).toLocaleDateString("id-ID")}</TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" className="mr-2" onClick={() => openEdit(u)}>Ubah</Button>
                    <Button variant="destructive" size="sm" onClick={() => setDeleteId(u.id)}>Hapus</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>{editingId ? "Ubah User" : "Tambah User Admin"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} autoComplete="off" />
            </div>
            <div className="space-y-2">
              <Label>{editingId ? "Password Baru (kosongkan jika tidak diubah)" : "Password"}</Label>
              <Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} autoComplete="new-password" />
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
          <AlertDialogHeader><AlertDialogTitle>Hapus user ini?</AlertDialogTitle><AlertDialogDescription>Anda tidak bisa menghapus akun yang sedang login.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => deleteId !== null && delMut.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUsersPage;
