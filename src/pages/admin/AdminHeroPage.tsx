import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import type { HeroApiRow } from "@/hooks/useCmsQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";

const AdminHeroPage = () => {
  const qc = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: ["cms", "hero", "admin"],
    queryFn: () => cmsFetch("hero.php") as Promise<HeroApiRow>,
  });

  const [form, setForm] = useState<Partial<HeroApiRow>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      await cmsFetch("hero.php", {
        method: "PUT",
        body: JSON.stringify({
          image_url: form.image_url ?? "",
          eyebrow: form.eyebrow ?? "",
          headline_part1: form.headline_part1 ?? "",
          headline_highlight: form.headline_highlight ?? "",
          headline_part2: form.headline_part2 ?? "",
          description_text: form.description_text ?? "",
          primary_cta_label: form.primary_cta_label ?? "",
          primary_cta_hash: form.primary_cta_hash ?? "",
          secondary_cta_label: form.secondary_cta_label ?? "",
          secondary_cta_hash: form.secondary_cta_hash ?? "",
          footer_left: form.footer_left ?? "",
          footer_right: form.footer_right ?? "",
        }),
      });
    },
    onSuccess: () => {
      toast.success("Hero disimpan.");
      qc.invalidateQueries({ queryKey: ["cms"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const url = await cmsUploadFile(f);
      setForm((prev) => ({ ...prev, image_url: url }));
      toast.success("Gambar diunggah.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (isPending && !data) {
    return <div className="h-32 animate-pulse rounded-md bg-muted" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="font-heading text-2xl font-bold text-foreground">Hero</h1>
      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        <div className="space-y-2">
          <Label>Gambar latar (URL atau unggah)</Label>
          {form.image_url ? (
            <img src={form.image_url} alt="" className="max-h-40 rounded-md object-cover" />
          ) : null}
          <Input value={form.image_url ?? ""} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
          <Input type="file" accept="image/*" className="cursor-pointer" disabled={uploading} onChange={onFile} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eyebrow">Baris atas (eyebrow)</Label>
          <Input id="eyebrow" value={form.eyebrow ?? ""} onChange={(e) => setForm((p) => ({ ...p, eyebrow: e.target.value }))} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Judul bagian 1</Label>
            <Input value={form.headline_part1 ?? ""} onChange={(e) => setForm((p) => ({ ...p, headline_part1: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label className="text-harvest">Sorotan</Label>
            <Input value={form.headline_highlight ?? ""} onChange={(e) => setForm((p) => ({ ...p, headline_highlight: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Judul bagian 2</Label>
            <Input value={form.headline_part2 ?? ""} onChange={(e) => setForm((p) => ({ ...p, headline_part2: e.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="desc">Deskripsi</Label>
          <Textarea id="desc" value={form.description_text ?? ""} onChange={(e) => setForm((p) => ({ ...p, description_text: e.target.value }))} rows={3} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Tombol utama</Label>
            <Input value={form.primary_cta_label ?? ""} onChange={(e) => setForm((p) => ({ ...p, primary_cta_label: e.target.value }))} />
            <Input placeholder="hash (mis. produk)" value={form.primary_cta_hash ?? ""} onChange={(e) => setForm((p) => ({ ...p, primary_cta_hash: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Tombol sekunder</Label>
            <Input value={form.secondary_cta_label ?? ""} onChange={(e) => setForm((p) => ({ ...p, secondary_cta_label: e.target.value }))} />
            <Input placeholder="hash (mis. kontak)" value={form.secondary_cta_hash ?? ""} onChange={(e) => setForm((p) => ({ ...p, secondary_cta_hash: e.target.value }))} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Footer kiri</Label>
            <Input value={form.footer_left ?? ""} onChange={(e) => setForm((p) => ({ ...p, footer_left: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Footer kanan</Label>
            <Input value={form.footer_right ?? ""} onChange={(e) => setForm((p) => ({ ...p, footer_right: e.target.value }))} />
          </div>
        </div>
        <Button type="button" onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? "Menyimpan…" : "Simpan"}
        </Button>
      </div>
    </div>
  );
};

export default AdminHeroPage;
