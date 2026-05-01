import { useState, useEffect } from "react";
import { useSettingsCms, useUpdateSettingsMutation } from "@/hooks/useCmsQueries";
import { cmsUploadFile } from "@/lib/cmsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, Save, Globe } from "lucide-react";

const AdminSettingsPage = () => {
  const { data: settings, isLoading } = useSettingsCms();
  const updateMutation = useUpdateSettingsMutation();
  const [form, setForm] = useState({
    logo_url: "",
    brand_name: "",
    tagline: "",
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (settings) {
      setForm({
        logo_url: settings.logo_url || "",
        brand_name: settings.brand_name || "",
        tagline: settings.tagline || "",
      });
    }
  }, [settings]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const url = await cmsUploadFile(file);
      setForm((prev) => ({ ...prev, logo_url: url }));
      toast.success("Logo berhasil diunggah");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = () => {
    updateMutation.mutate(form, {
      onSuccess: () => {
        toast.success("Pengaturan berhasil disimpan");
      },
      onError: (err: any) => {
        toast.error(err.message || "Gagal menyimpan pengaturan");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-harvest" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Pengaturan Situs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Kelola identitas brand, logo, dan informasi dasar website.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Identitas Brand</CardTitle>
            <CardDescription>
              Informasi ini akan muncul di Navbar, Footer, dan Meta Tags.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand_name">Nama Brand</Label>
              <Input
                id="brand_name"
                value={form.brand_name}
                onChange={(e) => setForm({ ...form, brand_name: e.target.value })}
                placeholder="Contoh: Jagasura Agrotama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                placeholder="Contoh: Sustainable Agriculture"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Logo Situs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center p-4">
              {form.logo_url ? (
                <img
                  src={form.logo_url}
                  alt="Logo Preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <div className="text-center">
                  <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground">Belum ada logo</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo-upload" className="cursor-pointer">
                <div className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? "Mengunggah..." : "Ganti Logo"}
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={isUploading}
                />
              </Label>
              <p className="text-[10px] text-muted-foreground text-center">
                Rekomendasi: PNG transparan, ukuran minimal 200x200px.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-harvest hover:bg-harvest/90 text-white gap-2"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Simpan Perubahan
        </Button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
