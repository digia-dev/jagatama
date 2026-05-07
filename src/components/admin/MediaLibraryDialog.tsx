import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import type { GalleryApiRow } from "@/hooks/useCmsQueries";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Image as ImageIcon, Check, Upload, Folder, FileText, ChevronRight, Home } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface MediaLibraryDialogProps {
  onSelect: (url: string) => void;
  trigger?: React.ReactNode;
}

const MediaLibraryDialog = ({ onSelect, trigger }: MediaLibraryDialogProps) => {
  const qc = useQueryClient();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: images, isLoading } = useQuery<GalleryApiRow[]>({
    queryKey: ["cms", "gallery", "picker", currentFolderId],
    queryFn: () => cmsFetch(`gallery.php${currentFolderId ? `?parent_id=${currentFolderId}` : "?parent_id=root"}`) as Promise<GalleryApiRow[]>,
    enabled: open
  });

  const { data: currentFolder } = useQuery<GalleryApiRow>({
    queryKey: ["cms", "gallery", "detail", "picker", currentFolderId],
    queryFn: () => cmsFetch(`gallery.php/${currentFolderId}`) as Promise<GalleryApiRow>,
    enabled: open && !!currentFolderId,
  });

  const filteredItems = (images || []).filter((item) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (item.title || "").toLowerCase().includes(s) ||
      (item.tags || "").toLowerCase().includes(s)
    );
  });

  const handleSelect = (item: GalleryApiRow) => {
    if (item.is_folder) {
      setCurrentFolderId(item.id);
      return;
    }
    onSelect(item.image_url);
    setOpen(false);
  };

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await cmsUploadFile(file);
      const isImage = file.type.startsWith("image/");
      
      await cmsFetch("gallery.php", {
        method: "POST",
        body: JSON.stringify({
          image_url: url,
          title: file.name,
          file_type: isImage ? "image" : "document",
          file_size: file.size,
          mime_type: file.type,
          parent_id: currentFolderId,
          tags: "upload_baru",
          sort_order: 0
        })
      });
      
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
      onSelect(url);
      setOpen(false);
      toast.success("File berhasil diunggah ke folder ini.");
    } catch (err) {
      toast.error("Gagal mengunggah file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ImageIcon className="h-4 w-4" />
            Pilih Media
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden bg-background">
        <Tabs defaultValue="browse" className="w-full">
          <DialogHeader className="p-6 pb-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <DialogTitle className="text-xl">Pustaka Media</DialogTitle>
                <DialogDescription className="text-xs">
                  Pilih file dari Drive Jagatama
                </DialogDescription>
              </div>
              <TabsList className="bg-muted/50 h-8">
                <TabsTrigger value="browse" className="text-xs px-4">Jelajahi</TabsTrigger>
                <TabsTrigger value="upload" className="text-xs px-4">Upload</TabsTrigger>
              </TabsList>
            </div>
          </DialogHeader>

          <TabsContent value="browse" className="border-none m-0 focus-visible:ring-0">
            <div className="px-6 pb-4 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-medium border-b border-border/50 pb-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`h-6 px-1.5 flex items-center gap-1.5 transition-colors ${!currentFolderId ? "text-harvest font-bold bg-harvest/5" : "text-muted-foreground hover:text-foreground"}`} 
                  onClick={() => setCurrentFolderId(null)}
                >
                  <Home className="h-3 w-3" />
                  Drive Saya
                </Button>
                {currentFolderId && (
                  <>
                    <ChevronRight className="h-2.5 w-2.5 text-muted-foreground/50" />
                    <span className="font-bold text-harvest bg-harvest/5 px-2 py-0.5 rounded">{currentFolder?.title || "..."}</span>
                  </>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  placeholder="Cari file..."
                  className="pl-9 h-8 text-xs bg-muted/30 border-muted focus-visible:ring-harvest/30"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="px-6 pb-6">
              {isLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-harvest" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center bg-muted/20 rounded-xl border border-dashed border-border/50">
                  <Folder className="h-8 w-8 text-muted-foreground/20 mb-3" />
                  <p className="text-muted-foreground italic text-xs">Tidak ada file di folder ini</p>
                </div>
              ) : (
                <ScrollArea className="max-h-[50vh] overflow-y-auto pr-4">
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 pb-2">
                    {filteredItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="group relative flex flex-col items-center p-2 rounded-lg border border-transparent hover:border-harvest/30 hover:bg-harvest/5 transition-all outline-none focus-visible:ring-2 focus-visible:ring-harvest/50"
                      >
                        <div className="relative w-full aspect-square flex items-center justify-center mb-1.5 bg-muted/40 rounded-md overflow-hidden group-hover:bg-harvest/10 border border-border/30">
                          {item.is_folder ? (
                            <Folder className="h-8 w-8 text-amber-500 fill-amber-500/20" />
                          ) : item.file_type === "image" ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-full w-full object-contain p-1 transition-transform group-hover:scale-110"
                            />
                          ) : (
                            <FileText className="h-8 w-8 text-slate-400" />
                          )}
                          
                          {(!item.is_folder) && (
                            <div className="absolute inset-0 bg-harvest/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Check className="text-harvest h-5 w-5 drop-shadow-sm" />
                            </div>
                          )}
                        </div>
                        <p className="text-[9px] font-medium text-center line-clamp-1 w-full text-muted-foreground group-hover:text-foreground">
                          {item.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="border-none m-0 p-8 sm:p-12">
            <div className="max-w-md mx-auto w-full p-8 sm:p-10 border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center text-center bg-muted/10">
              {isUploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-harvest mb-4" />
                  <p className="text-base font-medium text-foreground">Mengunggah file...</p>
                </>
              ) : (
                <>
                  <div className="h-12 w-12 bg-harvest/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-harvest" />
                  </div>
                  <h3 className="text-base font-bold mb-2">Upload File Baru</h3>
                  <p className="text-muted-foreground text-[10px] mb-8">
                    File akan disimpan ke folder: <br/>
                    <span className="font-bold text-harvest inline-flex items-center gap-1 mt-1 uppercase tracking-wider">
                      <Folder className="h-2.5 w-2.5" /> {currentFolderId ? currentFolder?.title : "Drive Saya"}
                    </span>
                  </p>
                  <label htmlFor="drive-picker-upload" className="cursor-pointer">
                    <div className="bg-harvest text-white px-8 py-2 rounded-full font-bold text-sm hover:bg-harvest-dark shadow-md shadow-harvest/20 transition-all hover:scale-105 active:scale-95">
                      Pilih File
                    </div>
                    <input
                      id="drive-picker-upload"
                      type="file"
                      className="hidden"
                      onChange={onFileUpload}
                    />
                  </label>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default MediaLibraryDialog;
