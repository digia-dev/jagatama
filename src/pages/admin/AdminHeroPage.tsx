import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import { parseHeroCmsResponse, type HeroApiRow, type HeroSlideApiRow } from "@/hooks/useCmsQueries";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/sonner";

type SlideEditor = Omit<HeroSlideApiRow, "id" | "created_at" | "updated_at">;

const SLIDE_TEMPLATE: SlideEditor = {
  image_url: "",
  sort_order: 0,
  eyebrow: "PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi",
  headline_part1: "Operasi agro terpadu: ",
  headline_highlight: "budidaya",
  headline_part2: ", edukasi, dan nilai tambah berkelanjutan",
  description_text:
    "Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.",
  primary_cta_label: "Lihat Produk Kami",
  primary_cta_hash: "produk",
  secondary_cta_label: "Hubungi Kami",
  secondary_cta_hash: "kontak",
  footer_left: "Jagasura Farm",
  footer_right: "MJ Farm",
};

function slideToEditor(s: HeroSlideApiRow): SlideEditor {
  return {
    image_url: s.image_url,
    sort_order: s.sort_order,
    eyebrow: s.eyebrow,
    headline_part1: s.headline_part1,
    headline_highlight: s.headline_highlight,
    headline_part2: s.headline_part2,
    description_text: s.description_text,
    primary_cta_label: s.primary_cta_label,
    primary_cta_hash: s.primary_cta_hash,
    secondary_cta_label: s.secondary_cta_label,
    secondary_cta_hash: s.secondary_cta_hash,
    footer_left: s.footer_left,
    footer_right: s.footer_right,
  };
}

const AdminHeroPage = () => {
  const qc = useQueryClient();
  const { data, isPending } = useQuery<HeroApiRow>({
    queryKey: ["cms", "hero", "admin"],
    queryFn: async () => parseHeroCmsResponse(await cmsFetch("hero.php")),
  });

  const [slideDialog, setSlideDialog] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [draft, setDraft] = useState<SlideEditor>(SLIDE_TEMPLATE);
  const [deleteSlideId, setDeleteSlideId] = useState<number | null>(null);
  const [uploadingSlide, setUploadingSlide] = useState(false);

  const slidesSorted = (data?.slides ?? []).slice().sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);

  const openAddSlide = () => {
    setEditingSlideId(null);
    const base = slidesSorted[0];
    setDraft({
      ...SLIDE_TEMPLATE,
      ...(base ? slideToEditor(base) : {}),
      sort_order: slidesSorted.length,
      image_url: "",
    });
    setSlideDialog(true);
  };

  const openEditSlide = (s: HeroSlideApiRow) => {
    setEditingSlideId(s.id);
    setDraft(slideToEditor(s));
    setSlideDialog(true);
  };

  const saveSlideMut = useMutation({
    mutationFn: async () => {
      if (!draft.image_url.trim()) throw new Error("Gambar wajib diisi.");
      const body = {
        image_url: draft.image_url.trim(),
        sort_order: draft.sort_order,
        eyebrow: draft.eyebrow,
        headline_part1: draft.headline_part1,
        headline_highlight: draft.headline_highlight,
        headline_part2: draft.headline_part2,
        description_text: draft.description_text,
        primary_cta_label: draft.primary_cta_label,
        primary_cta_hash: draft.primary_cta_hash,
        secondary_cta_label: draft.secondary_cta_label,
        secondary_cta_hash: draft.secondary_cta_hash,
        footer_left: draft.footer_left,
        footer_right: draft.footer_right,
      };
      if (editingSlideId && editingSlideId > 0) {
        await cmsFetch(`hero_slides.php/${editingSlideId}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
      } else {
        await cmsFetch("hero_slides.php", {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
    },
    onSuccess: () => {
      toast.success("Slide hero disimpan.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setSlideDialog(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delSlideMut = useMutation({
    mutationFn: async (id: number) => {
      await cmsFetch(`hero_slides.php/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Slide dihapus.");
      qc.invalidateQueries({ queryKey: ["cms"] });
      setDeleteSlideId(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onSlideFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploadingSlide(true);
    try {
      const url = await cmsUploadFile(f);
      setDraft((d) => ({ ...d, image_url: url }));
      toast.success("Gambar diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploadingSlide(false);
      e.target.value = "";
    }
  };

  const setD = <K extends keyof SlideEditor>(key: K, value: SlideEditor[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  if (isPending && !data) {
    return <div className="h-32 animate-pulse rounded-md bg-muted" />;
  }

  const heroColCount = 5;

  return (
    <div className="w-full space-y-8">
      <h1 className="font-heading text-2xl font-bold text-foreground">Hero</h1>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-foreground">Slide karusel</h2>
        <p className="text-sm text-muted-foreground">
          Setiap slide punya gambar latar dan teks sendiri (judul, deskripsi, tombol). Urutan mengikuti angka sort.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={openAddSlide}>
            Tambah slide
          </Button>
        </div>
        <div className="overflow-x-auto rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[108px] min-w-[96px]">Gambar</TableHead>
                <TableHead className="w-[64px]">Urut</TableHead>
                <TableHead className="hidden min-w-[160px] max-w-[240px] sm:table-cell">Eyebrow</TableHead>
                <TableHead className="min-w-[200px]">Judul (hero)</TableHead>
                <TableHead className="w-[1%] whitespace-nowrap text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {slidesSorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={heroColCount} className="text-muted-foreground">
                    Belum ada slide. Tambahkan minimal satu.
                  </TableCell>
                </TableRow>
              ) : (
                slidesSorted.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="align-middle">
                      <img src={s.image_url} alt="" className="h-16 w-[96px] rounded-md border border-border/60 object-cover" />
                    </TableCell>
                    <TableCell className="align-middle tabular-nums">{s.sort_order}</TableCell>
                    <TableCell className="hidden max-w-[240px] align-middle text-xs text-muted-foreground sm:table-cell">
                      <span className="line-clamp-2">{s.eyebrow || "—"}</span>
                    </TableCell>
                    <TableCell className="max-w-md align-middle text-sm lg:max-w-xl">
                      <span className="line-clamp-2">
                        {s.headline_part1}
                        <span className="text-harvest">{s.headline_highlight}</span>
                        {s.headline_part2}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right align-middle">
                      <Button type="button" variant="outline" size="sm" className="mr-2" onClick={() => openEditSlide(s)}>
                        Ubah
                      </Button>
                      <Button type="button" variant="destructive" size="sm" onClick={() => setDeleteSlideId(s.id)}>
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={slideDialog} onOpenChange={setSlideDialog}>
        <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="shrink-0 border-b border-border px-6 py-4">
            <DialogTitle>{editingSlideId ? "Ubah slide" : "Slide baru"}</DialogTitle>
          </DialogHeader>
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {draft.image_url ? <img src={draft.image_url} alt="" className="max-h-44 w-full rounded-md object-cover" /> : null}
            <div className="space-y-2">
              <Label>URL gambar</Label>
              <Input value={draft.image_url} onChange={(e) => setD("image_url", e.target.value)} placeholder="https://..." />
              <Input type="file" accept="image/*" className="cursor-pointer" disabled={uploadingSlide} onChange={onSlideFile} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slide-sort">Urutan (sort)</Label>
              <Input
                id="slide-sort"
                type="number"
                value={draft.sort_order}
                onChange={(e) => setD("sort_order", Number(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slide-eyebrow">Baris atas (eyebrow)</Label>
              <Input id="slide-eyebrow" value={draft.eyebrow} onChange={(e) => setD("eyebrow", e.target.value)} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Judul bagian 1</Label>
                <Input value={draft.headline_part1} onChange={(e) => setD("headline_part1", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-harvest">Sorotan</Label>
                <Input value={draft.headline_highlight} onChange={(e) => setD("headline_highlight", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Judul bagian 2</Label>
                <Input value={draft.headline_part2} onChange={(e) => setD("headline_part2", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="slide-desc">Deskripsi</Label>
              <Textarea id="slide-desc" value={draft.description_text} onChange={(e) => setD("description_text", e.target.value)} rows={3} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tombol utama</Label>
                <Input value={draft.primary_cta_label} onChange={(e) => setD("primary_cta_label", e.target.value)} />
                <Input
                  placeholder="hash (mis. produk)"
                  value={draft.primary_cta_hash}
                  onChange={(e) => setD("primary_cta_hash", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tombol sekunder</Label>
                <Input value={draft.secondary_cta_label} onChange={(e) => setD("secondary_cta_label", e.target.value)} />
                <Input
                  placeholder="hash (mis. kontak)"
                  value={draft.secondary_cta_hash}
                  onChange={(e) => setD("secondary_cta_hash", e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Footer kiri</Label>
                <Input value={draft.footer_left} onChange={(e) => setD("footer_left", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Footer kanan</Label>
                <Input value={draft.footer_right} onChange={(e) => setD("footer_right", e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter className="shrink-0 border-t border-border px-6 py-4">
            <Button type="button" variant="outline" onClick={() => setSlideDialog(false)}>
              Batal
            </Button>
            <Button type="button" onClick={() => saveSlideMut.mutate()} disabled={saveSlideMut.isPending}>
              {saveSlideMut.isPending ? "Menyimpan…" : "Simpan slide"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteSlideId !== null} onOpenChange={(o) => !o && setDeleteSlideId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus slide?</AlertDialogTitle>
            <AlertDialogDescription>Slide ini akan dihapus dari karusel hero.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteSlideId != null) delSlideMut.mutate(deleteSlideId);
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

export default AdminHeroPage;
