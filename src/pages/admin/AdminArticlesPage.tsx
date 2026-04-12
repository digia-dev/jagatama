import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import type { ArticleFullApi, ArticleSummaryApi } from "@/hooks/useCmsQueries";
import { filterArticleSummaries, uniqueArticleCategories } from "@/lib/filterCatalogProducts";
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

const ALL = "__all__";

type ExtraRow = { image_url: string; caption: string };

const AdminArticlesPage = () => {
  const qc = useQueryClient();
  const { data: list, isPending } = useQuery({
    queryKey: ["cms", "articles", "admin"],
    queryFn: () => cmsFetch("articles.php") as Promise<ArticleSummaryApi[]>,
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState(ALL);

  const categories = useMemo(() => uniqueArticleCategories(list ?? []), [list]);

  const filtered = useMemo(() => {
    const cat = filterCategory === ALL ? "" : filterCategory;
    return filterArticleSummaries(list ?? [], search, cat);
  }, [list, search, filterCategory]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("");
  const [dateDisplay, setDateDisplay] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [paragraphsText, setParagraphsText] = useState("");
  const [extras, setExtras] = useState<ExtraRow[]>([{ image_url: "", caption: "" }]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingFull, setLoadingFull] = useState(false);

  const resetForm = () => {
    setEditingId(null);
    setSlug("");
    setTitle("");
    setExcerpt("");
    setCategory("");
    setDateDisplay("");
    setImageUrl("");
    setParagraphsText("");
    setExtras([{ image_url: "", caption: "" }]);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = async (id: number) => {
    setLoadingFull(true);
    try {
      const full = (await cmsFetch(`articles.php/${id}`)) as ArticleFullApi;
      setEditingId(full.id);
      setSlug(full.slug);
      setTitle(full.title);
      setExcerpt(full.excerpt);
      setCategory(full.category);
      setDateDisplay(full.date_display);
      setImageUrl(full.image_url);
      const sortedP = [...(full.paragraphs || [])].sort((a, b) => a.sort_order - b.sort_order);
      setParagraphsText(sortedP.map((p) => p.body).join("\n\n"));
      const sortedE = [...(full.extra_images || [])].sort((a, b) => a.sort_order - b.sort_order);
      setExtras(
        sortedE.length > 0
          ? sortedE.map((e) => ({ image_url: e.image_url, caption: e.caption }))
          : [{ image_url: "", caption: "" }],
      );
      setDialogOpen(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal memuat artikel.");
    } finally {
      setLoadingFull(false);
    }
  };

  const paragraphsPayload = () =>
    paragraphsText
      .split(/\n\s*\n/)
      .map((s) => s.trim())
      .filter(Boolean);

  const extrasPayload = () =>
    extras
      .filter((e) => e.image_url.trim())
      .map((e) => ({ image_url: e.image_url.trim(), caption: e.caption.trim() }));

  const saveMut = useMutation({
    mutationFn: async () => {
      if (!slug.trim() || !title.trim()) throw new Error("Slug dan judul wajib diisi.");
      const body = {
        slug: slug.trim(),
        title: title.trim(),
        excerpt,
        category,
        date_display: dateDisplay,
        image_url: imageUrl,
        paragraphs: paragraphsPayload().map((bodyText) => ({ body: bodyText })),
        extra_images: extrasPayload(),
      };
      if (editingId) {
        await cmsFetch(`articles.php/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await cmsFetch("articles.php", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
    },
    onSuccess: () => {
      toast.success("Artikel disimpan.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setDialogOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: number) => {
      await cmsFetch(`articles.php/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Artikel dihapus.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setDeleteId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const uploadMain = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      setImageUrl(await cmsUploadFile(f));
      toast.success("Gambar utama diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const uploadExtra = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await cmsUploadFile(f);
      setExtras((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], image_url: url };
        return next;
      });
      toast.success("Gambar diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const colCount = 6;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-foreground">Artikel</h1>
        <Button type="button" onClick={openAdd}>
          Tambah artikel
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
        <div className="min-w-0 flex-1 space-y-2 sm:min-w-[200px]">
          <Label htmlFor="admin-artikel-cari">Cari</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <Input
              id="admin-artikel-cari"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Judul, slug, ringkasan, kategori…"
              className="border-border bg-background pl-9"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full space-y-2 sm:w-52 md:w-60">
          <Label htmlFor="admin-artikel-kategori">Kategori</Label>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger id="admin-artikel-kategori" className="border-border bg-background">
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
              <TableHead className="min-w-[180px]">Judul</TableHead>
              <TableHead className="hidden min-w-[100px] lg:table-cell">Kategori</TableHead>
              <TableHead className="hidden min-w-[110px] md:table-cell">Tanggal</TableHead>
              <TableHead className="hidden min-w-[140px] xl:table-cell">Slug</TableHead>
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
              filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="align-middle">
                    {a.image_url ? (
                      <img src={a.image_url} alt="" className="h-14 w-[88px] rounded-md border border-border/60 object-cover" />
                    ) : (
                      <div className="flex h-14 w-[88px] items-center justify-center rounded-md border border-dashed border-border bg-muted/50 text-[10px] text-muted-foreground">
                        —
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[300px] align-middle font-medium lg:max-w-md xl:max-w-lg">
                    <span className="line-clamp-2">{a.title}</span>
                  </TableCell>
                  <TableCell className="hidden align-middle text-muted-foreground lg:table-cell">{a.category || "—"}</TableCell>
                  <TableCell className="hidden align-middle text-sm text-muted-foreground md:table-cell">{a.date_display || "—"}</TableCell>
                  <TableCell className="hidden max-w-[220px] truncate align-middle font-mono text-xs text-muted-foreground xl:table-cell">{a.slug}</TableCell>
                  <TableCell className="whitespace-nowrap text-right align-middle">
                    <Button type="button" variant="outline" size="sm" className="mr-2" onClick={() => openEdit(a.id)} disabled={loadingFull}>
                      Ubah
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteId(a.id)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={colCount} className="text-muted-foreground">
                  {list?.length ? "Tidak ada artikel yang cocok dengan filter." : "Belum ada artikel."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Ubah artikel" : "Tambah artikel"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="contoh-artikel" />
              </div>
              <div className="space-y-2">
                <Label>Tanggal tampil</Label>
                <Input value={dateDisplay} onChange={(e) => setDateDisplay(e.target.value)} placeholder="15 Mar 2026" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Judul</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Ringkasan</Label>
              <Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Gambar utama</Label>
              {imageUrl ? <img src={imageUrl} alt="" className="max-h-36 rounded-md object-cover" /> : null}
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              <Input type="file" accept="image/*" disabled={uploading} onChange={uploadMain} />
            </div>
            <div className="space-y-2">
              <Label>Paragraf (pisahkan dengan baris kosong)</Label>
              <Textarea value={paragraphsText} onChange={(e) => setParagraphsText(e.target.value)} rows={12} />
            </div>
            <div className="space-y-3">
              <Label>Gambar tambahan</Label>
              {extras.map((ex, i) => (
                <div key={i} className="space-y-2 rounded-md border border-border p-3">
                  <Input placeholder="URL gambar" value={ex.image_url} onChange={(e) => {
                    const next = [...extras];
                    next[i] = { ...next[i], image_url: e.target.value };
                    setExtras(next);
                  }} />
                  <Input type="file" accept="image/*" disabled={uploading} onChange={(e) => uploadExtra(i, e)} />
                  <Input placeholder="Keterangan" value={ex.caption} onChange={(e) => {
                    const next = [...extras];
                    next[i] = { ...next[i], caption: e.target.value };
                    setExtras(next);
                  }} />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setExtras((prev) => [...prev, { image_url: "", caption: "" }])}
              >
                Tambah gambar
              </Button>
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
            <AlertDialogTitle>Hapus artikel?</AlertDialogTitle>
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

export default AdminArticlesPage;
