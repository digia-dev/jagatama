import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import type { GalleryApiRow } from "@/hooks/useCmsQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";

const AdminGalleryPage = () => {
  const qc = useQueryClient();
  const { data: rows, isPending } = useQuery({
    queryKey: ["cms", "gallery", "admin"],
    queryFn: () => cmsFetch("gallery.php") as Promise<GalleryApiRow[]>,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isTall, setIsTall] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const openAdd = () => {
    setEditingId(null);
    setImageUrl("");
    setAltText("");
    setSortOrder(rows?.length ?? 0);
    setIsTall(false);
    setDialogOpen(true);
  };

  const openEdit = (g: GalleryApiRow) => {
    setEditingId(g.id);
    setImageUrl(g.image_url);
    setAltText(g.alt_text);
    setSortOrder(g.sort_order);
    setIsTall(g.is_tall === 1);
    setDialogOpen(true);
  };

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!imageUrl.trim()) throw new Error("Gambar wajib diisi.");
      const body = {
        image_url: imageUrl.trim(),
        alt_text: altText,
        sort_order: sortOrder,
        is_tall: isTall ? 1 : 0,
      };
      if (editingId) {
        await cmsFetch(`gallery.php/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await cmsFetch("gallery.php", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
    },
    onSuccess: () => {
      toast.success("Item galeri disimpan.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: number) => {
      await cmsFetch(`gallery.php/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Item dihapus.");
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
      setImageUrl(await cmsUploadFile(f));
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
        <h1 className="font-heading text-2xl font-bold text-foreground">Galeri</h1>
        <Button type="button" onClick={openAdd}>
          Tambah gambar
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[108px] min-w-[96px]">Gambar</TableHead>
              <TableHead className="min-w-[120px]">Alt</TableHead>
              <TableHead className="hidden min-w-[200px] max-w-[320px] md:table-cell">URL</TableHead>
              <TableHead className="w-[72px]">Urut</TableHead>
              <TableHead className="w-[72px]">Tinggi</TableHead>
              <TableHead className="w-[1%] whitespace-nowrap text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  Memuat…
                </TableCell>
              </TableRow>
            ) : rows?.length ? (
              rows.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="align-middle">
                    <img src={g.image_url} alt="" className="h-16 w-[96px] rounded-md border border-border/60 object-cover" />
                  </TableCell>
                  <TableCell className="max-w-[200px] align-middle text-sm lg:max-w-xs">
                    <span className="line-clamp-2">{g.alt_text || "—"}</span>
                  </TableCell>
                  <TableCell className="hidden max-w-[320px] align-middle md:table-cell">
                    <span className="line-clamp-1 font-mono text-xs text-muted-foreground">{g.image_url}</span>
                  </TableCell>
                  <TableCell className="align-middle tabular-nums">{g.sort_order}</TableCell>
                  <TableCell className="align-middle text-sm">{g.is_tall === 1 ? "Ya" : "Tidak"}</TableCell>
                  <TableCell className="whitespace-nowrap text-right align-middle">
                    <Button type="button" variant="outline" size="sm" className="mr-2" onClick={() => openEdit(g)}>
                      Ubah
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteId(g.id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
                  Galeri kosong.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Ubah item" : "Tambah item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label>Gambar</Label>
              {imageUrl ? <img src={imageUrl} alt="" className="max-h-40 rounded-md object-cover" /> : null}
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <Input type="file" accept="image/*" disabled={uploading} onChange={onFile} />
            </div>
            <div className="space-y-2">
              <Label>Teks alternatif</Label>
              <Input value={altText} onChange={(e) => setAltText(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Urutan</Label>
              <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tall" checked={isTall} onCheckedChange={(c) => setIsTall(c === true)} />
              <Label htmlFor="tall" className="cursor-pointer font-normal">
                Kotak tinggi (grid besar)
              </Label>
            </div>
          </div>
          <DialogFooter>
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
            <AlertDialogTitle>Hapus dari galeri?</AlertDialogTitle>
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

export default AdminGalleryPage;
