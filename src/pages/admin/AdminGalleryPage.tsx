import { useState, useMemo, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cmsFetch, cmsUploadFile } from "@/lib/cmsApi";
import type { GalleryApiRow } from "@/hooks/useCmsQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { toast } from "sonner";
import { 
  FolderPlus, 
  Upload, 
  LayoutGrid, 
  List, 
  Folder, 
  FileText, 
  MoreVertical, 
  ChevronRight, 
  Trash2,
  Download,
  ExternalLink,
  Search,
  Home,
  Scissors,
  Copy,
  ClipboardPaste,
  ChevronDown,
  CheckCircle2,
  X,
  CheckSquare
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

type Clipboard = {
  id: number;
  action: "cut" | "copy";
  item: GalleryApiRow;
} | null;

const AdminGalleryPage = () => {
  const qc = useQueryClient();
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dropTargetId, setDropTargetId] = useState<number | null>(null);
  const [clipboard, setClipboard] = useState<Clipboard>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Fetch items in current folder
  const { data: rows, isPending } = useQuery({
    queryKey: ["cms", "gallery", "admin", currentFolderId],
    queryFn: () => cmsFetch(`gallery.php${currentFolderId ? `?parent_id=${currentFolderId}` : "?parent_id=root"}`) as Promise<GalleryApiRow[]>,
  });

  // Fetch all folders for sidebar tree
  const { data: allFolders } = useQuery<GalleryApiRow[]>({
    queryKey: ["cms", "gallery", "folders"],
    queryFn: async () => {
      const all = await cmsFetch("gallery.php") as GalleryApiRow[];
      return all.filter(r => r.is_folder === 1);
    },
  });

  // Fetch current folder details for name in breadcrumb
  const { data: currentFolder } = useQuery<GalleryApiRow>({
    queryKey: ["cms", "gallery", "detail", currentFolderId],
    queryFn: () => cmsFetch(`gallery.php/${currentFolderId}`) as Promise<GalleryApiRow>,
    enabled: !!currentFolderId,
  });

  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredRows = useMemo(() => {
    if (!rows) return [];
    if (!searchQuery) return rows;
    const q = searchQuery.toLowerCase();
    return rows.filter(r => 
      (r.title || "").toLowerCase().includes(q) || 
      (r.tags || "").toLowerCase().includes(q)
    );
  }, [rows, searchQuery]);

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === filteredRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRows.map(r => r.id));
    }
  };

  const createFolderMut = useMutation({
    mutationFn: async () => {
      if (!folderName.trim()) throw new Error("Nama folder wajib diisi.");
      await cmsFetch("gallery.php", {
        method: "POST",
        body: JSON.stringify({
          title: folderName.trim(),
          is_folder: 1,
          parent_id: currentFolderId,
          file_type: "folder"
        }),
      });
    },
    onSuccess: () => {
      toast.success("Folder berhasil dibuat.");
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
      setFolderDialogOpen(false);
      setFolderName("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const moveMut = useMutation({
    mutationFn: async ({ id, newParentId }: { id: number, newParentId: number | null }) => {
      await cmsFetch(`gallery.php/${id}`, {
        method: "PUT",
        body: JSON.stringify({ parent_id: newParentId }),
      });
    },
    onSuccess: () => {
      toast.success("Item berhasil dipindahkan.");
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const copyMut = useMutation({
    mutationFn: async ({ item, newParentId }: { item: GalleryApiRow, newParentId: number | null }) => {
      await cmsFetch("gallery.php", {
        method: "POST",
        body: JSON.stringify({
          image_url: item.image_url,
          title: `${item.title} (Copy)`,
          alt_text: item.alt_text,
          sort_order: item.sort_order,
          is_tall: item.is_tall,
          tags: item.tags,
          parent_id: newParentId,
          is_folder: item.is_folder,
          file_type: item.file_type,
          file_size: item.file_size,
          mime_type: item.mime_type
        }),
      });
    },
    onSuccess: () => {
      toast.success("Item berhasil disalin.");
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: number) => {
      await cmsFetch(`gallery.php/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Item dihapus.");
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
      setDeleteId(null);
      setSelectedIds(prev => prev.filter(x => x !== deleteId));
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDelMut = useMutation({
    mutationFn: async (ids: number[]) => {
      await cmsFetch("gallery.php", {
        method: "DELETE",
        body: JSON.stringify({ ids })
      });
    },
    onSuccess: () => {
      toast.success(`${selectedIds.length} item berhasil dihapus.`);
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
      setSelectedIds([]);
      setBulkDeleteConfirm(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
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
            alt_text: file.name,
            sort_order: 0
          }),
        });
      }
      toast.success("File berhasil diunggah.");
      qc.invalidateQueries({ queryKey: ["cms", "gallery"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: number | null) => {
    e.preventDefault();
    if (draggedId !== id) {
      setDropTargetId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: number | null) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      moveMut.mutate({ id: draggedId, newParentId: targetId });
    }
    setDraggedId(null);
    setDropTargetId(null);
  };

  const handleCut = (item: GalleryApiRow) => {
    setClipboard({ id: item.id, action: "cut", item });
    toast.info(`Potong "${item.title}"`);
  };

  const handleCopy = (item: GalleryApiRow) => {
    setClipboard({ id: item.id, action: "copy", item });
    toast.info(`Salin "${item.title}"`);
  };

  const handlePaste = () => {
    if (!clipboard) return;
    if (clipboard.action === "cut") {
      moveMut.mutate({ id: clipboard.id, newParentId: currentFolderId });
      setClipboard(null);
    } else {
      copyMut.mutate({ item: clipboard.item, newParentId: currentFolderId });
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.ctrlKey || e.metaKey) {
        const itemToActOn = filteredRows.find(r => r.id === selectedId) || filteredRows[0];
        
        switch (e.key.toLowerCase()) {
          case "x":
            if (itemToActOn) handleCut(itemToActOn);
            break;
          case "c":
            if (itemToActOn) handleCopy(itemToActOn);
            break;
          case "v":
            handlePaste();
            break;
          case "a":
            e.preventDefault();
            selectAll();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clipboard, filteredRows, currentFolderId, selectedId, selectedIds]);

  const SidebarItem = ({ folder, level = 0 }: { folder: GalleryApiRow; level?: number }) => {
    const isSelected = currentFolderId === folder.id;
    const children = allFolders?.filter(f => f.parent_id === folder.id) || [];
    const [expanded, setExpanded] = useState(false);

    return (
      <div className="space-y-1">
        <div 
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer text-xs transition-colors ${isSelected ? "bg-harvest/10 text-harvest font-bold" : "hover:bg-muted"} ${dropTargetId === folder.id ? "bg-harvest/20 ring-2 ring-harvest ring-inset" : ""}`}
          onClick={() => { setCurrentFolderId(folder.id); setSelectedIds([]); }}
          onDragOver={(e) => handleDragOver(e, folder.id)}
          onDrop={(e) => handleDrop(e, folder.id)}
          style={{ paddingLeft: `${(level * 12) + 8}px` }}
        >
          <div onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}>
            {children.length > 0 ? (
              <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? "" : "-rotate-90"}`} />
            ) : (
              <div className="w-3" />
            )}
          </div>
          <Folder className={`h-3.5 w-3.5 ${isSelected ? "fill-harvest/20" : "text-muted-foreground"}`} />
          <span className="truncate">{folder.title}</span>
        </div>
        {expanded && children.map(c => <SidebarItem key={c.id} folder={c} level={level + 1} />)}
      </div>
    );
  };

  return (
    <div className="flex h-[calc(100vh-120px)] w-full gap-6 overflow-hidden relative">
      {/* Selection Toolbar */}
      {selectedIds.length > 0 && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-harvest text-white h-14 flex items-center justify-between px-6 rounded-xl animate-in slide-in-from-top-4 duration-300 shadow-lg">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setSelectedIds([])}>
              <X className="h-5 w-5" />
            </Button>
            <span className="font-bold text-sm">{selectedIds.length} item dipilih</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-2" onClick={selectAll}>
              <CheckSquare className="h-4 w-4" />
              {selectedIds.length === filteredRows.length ? "Batal Semua" : "Pilih Semua"}
            </Button>
            <div className="w-px h-6 bg-white/20 mx-2" />
            <Button variant="destructive" size="sm" className="bg-white text-destructive hover:bg-white/90 gap-2 font-bold" onClick={() => setBulkDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4" />
              Hapus ({selectedIds.length})
            </Button>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-56 shrink-0 hidden lg:flex flex-col border-r border-border pr-4 ${selectedIds.length > 0 ? "pt-16" : ""}`}>
        <h2 className="text-[10px] font-bold uppercase text-muted-foreground mb-4 px-2 tracking-widest">Navigasi Drive</h2>
        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-2">
            <div 
              className={`flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-xs transition-colors ${currentFolderId === null ? "bg-harvest/10 text-harvest font-bold" : "hover:bg-muted"} ${dropTargetId === null ? "bg-harvest/20 ring-2 ring-harvest ring-inset" : ""}`}
              onClick={() => { setCurrentFolderId(null); setSelectedIds([]); }}
              onDragOver={(e) => handleDragOver(e, null)}
              onDrop={(e) => handleDrop(e, null)}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Drive Saya</span>
            </div>
            
            <div className="mt-4 mb-2 px-2">
              <p className="text-[9px] font-bold text-muted-foreground/50 uppercase">Folder</p>
            </div>
            
            {allFolders?.filter(f => f.parent_id === null).map(f => (
              <SidebarItem key={f.id} folder={f} />
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 ${selectedIds.length > 0 ? "pt-16" : ""}`}>
        <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-xl font-bold text-foreground">Drive Galeri</h1>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <button 
                  onClick={() => { setCurrentFolderId(null); setSelectedIds([]); }} 
                  className={`hover:text-harvest flex items-center gap-1.5 transition-colors ${!currentFolderId ? "font-bold text-foreground" : ""}`}
                  onDragOver={(e) => handleDragOver(e, null)}
                  onDrop={(e) => handleDrop(e, null)}
                >
                  <Home className="h-3 w-3" />
                  Drive Saya
                </button>
                {currentFolderId && (
                  <>
                    <ChevronRight className="h-2.5 w-2.5" />
                    <span className="font-bold text-foreground">{currentFolder?.title || "..."}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {clipboard && (
                <Button variant="default" size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700 h-8" onClick={handlePaste}>
                  <ClipboardPaste className="h-3.5 w-3.5" />
                  Tempel
                </Button>
              )}
              <div className="flex bg-muted p-1 rounded-md mr-1">
                <Button variant={viewMode === "grid" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("grid")}>
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button variant={viewMode === "list" ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewMode("list")}>
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Button variant="outline" size="sm" className="gap-2 h-8" onClick={() => setFolderDialogOpen(true)}>
                <FolderPlus className="h-3.5 w-3.5" />
                Folder Baru
              </Button>
              <div className="relative">
                <Button size="sm" className="gap-2 h-8" disabled={uploading}>
                  {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Upload
                </Button>
                <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={onFileUpload} disabled={uploading} />
              </div>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
            <Input 
              placeholder="Cari file atau folder..." 
              className="pl-9 max-w-sm h-9 bg-muted/30 border-muted"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {isPending ? (
            <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-harvest" /></div>
          ) : filteredRows.length === 0 ? (
            <div className={`flex flex-col items-center justify-center flex-1 border-2 border-dashed border-border rounded-xl bg-muted/30 transition-colors ${dropTargetId === currentFolderId ? "border-harvest bg-harvest/5" : ""}`}>
              <Folder className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm italic">Folder ini kosong</p>
            </div>
          ) : (
            <ScrollArea className="flex-1 -mx-2 px-2">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 pb-4">
                  {filteredRows.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <div 
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(item.id)}
                        onDragOver={(e) => item.is_folder ? handleDragOver(e, item.id) : null}
                        onDrop={(e) => item.is_folder ? handleDrop(e, item.id) : null}
                        onClick={(e) => {
                          if (e.ctrlKey || e.metaKey || selectedIds.length > 0) {
                            toggleSelect(item.id);
                          } else {
                            setSelectedId(item.id);
                          }
                        }}
                        className={`group relative flex flex-col items-center p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? "border-harvest bg-harvest/10 shadow-md ring-2 ring-harvest/20" : selectedId === item.id ? "border-harvest bg-harvest/5 shadow-sm" : "border-transparent hover:border-border hover:bg-card"} ${dropTargetId === item.id ? "bg-harvest/10 border-harvest border-dashed" : ""} ${clipboard?.id === item.id && clipboard?.action === "cut" ? "opacity-40 grayscale" : ""}`}
                        onDoubleClick={() => item.is_folder ? setCurrentFolderId(item.id) : window.open(item.image_url, "_blank")}
                      >
                        {/* Selection Checkbox */}
                        <div 
                          className={`absolute top-2 left-2 z-10 transition-all ${isSelected ? "opacity-100 scale-110" : "opacity-0 group-hover:opacity-100 scale-100"}`}
                          onClick={(e) => { e.stopPropagation(); toggleSelect(item.id); }}
                        >
                          {isSelected ? (
                            <CheckCircle2 className="h-5 w-5 text-harvest fill-white shadow-sm" />
                          ) : (
                            <div className="h-5 w-5 rounded-full border-2 border-white bg-black/20 backdrop-blur-sm shadow-sm" />
                          )}
                        </div>

                        <div className="relative w-full aspect-square flex items-center justify-center mb-2 bg-muted/50 rounded-lg overflow-hidden group-hover:bg-muted border border-border/20">
                          {item.is_folder ? (
                            <Folder className={`h-10 w-10 text-amber-500 fill-amber-500/20 transition-transform ${dropTargetId === item.id ? "scale-110" : ""}`} />
                          ) : item.file_type === "image" ? (
                            <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FileText className="h-10 w-10 text-slate-400" />
                          )}
                          
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100" onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="secondary" size="icon" className="h-6 w-6 bg-white/90 hover:bg-white shadow-sm border-none"><MoreVertical className="h-3 w-3" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => item.is_folder ? setCurrentFolderId(item.id) : window.open(item.image_url, "_blank")}><ExternalLink className="h-3.5 w-3.5 mr-2" /> Buka</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => toggleSelect(item.id)}><CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Pilih</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCut(item)}><Scissors className="h-3.5 w-3.5 mr-2" /> Potong</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleCopy(item)}><Copy className="h-3.5 w-3.5 mr-2" /> Salin</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {!item.is_folder && <DropdownMenuItem asChild><a href={item.image_url} download={item.title}><Download className="h-3.5 w-3.5 mr-2" /> Download</a></DropdownMenuItem>}
                                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <p className="text-[10px] font-medium text-center line-clamp-2 w-full px-1 text-muted-foreground group-hover:text-foreground">{item.title}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-border bg-card mb-4 text-sm">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-10 text-center"><Checkbox checked={selectedIds.length === filteredRows.length && filteredRows.length > 0} onCheckedChange={selectAll} /></TableHead>
                        <TableHead className="h-9">Nama</TableHead>
                        <TableHead className="hidden md:table-cell w-[120px] h-9">Tipe</TableHead>
                        <TableHead className="hidden md:table-cell w-[100px] h-9 text-right">Ukuran</TableHead>
                        <TableHead className="w-[1%] text-right h-9 pr-4">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRows.map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        return (
                          <TableRow 
                            key={item.id} 
                            draggable
                            onDragStart={() => handleDragStart(item.id)}
                            onDragOver={(e) => item.is_folder ? handleDragOver(e, item.id) : null}
                            onDrop={(e) => item.is_folder ? handleDrop(e, item.id) : null}
                            onClick={(e) => {
                              if (e.ctrlKey || e.metaKey || selectedIds.length > 0) {
                                toggleSelect(item.id);
                              } else {
                                setSelectedId(item.id);
                              }
                            }}
                            className={`cursor-pointer transition-colors ${isSelected ? "bg-harvest/10" : selectedId === item.id ? "bg-harvest/5" : "hover:bg-muted/30"} ${dropTargetId === item.id ? "bg-harvest/10" : ""} ${clipboard?.id === item.id && clipboard?.action === "cut" ? "opacity-40 grayscale" : ""}`}
                            onDoubleClick={() => item.is_folder ? setCurrentFolderId(item.id) : null}
                          >
                            <TableCell className="text-center" onClick={e => e.stopPropagation()}>
                              <Checkbox checked={isSelected} onCheckedChange={() => toggleSelect(item.id)} />
                            </TableCell>
                            <TableCell className="py-1.5">
                              <div className="flex items-center gap-3">
                                {item.is_folder ? <Folder className="h-4 w-4 text-amber-500 fill-amber-500/20" /> : item.file_type === "image" ? <div className="h-7 w-7 rounded overflow-hidden border border-border/30"><img src={item.image_url} alt="" className="w-full h-full object-cover" /></div> : <FileText className="h-4 w-4 text-slate-400" />}
                                <span className={`font-medium text-xs ${isSelected ? "text-harvest font-bold" : ""}`}>{item.title}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-[10px] text-muted-foreground uppercase">{item.file_type}</TableCell>
                            <TableCell className="hidden md:table-cell text-[10px] text-muted-foreground text-right">{item.file_size > 0 ? `${(item.file_size / 1024).toFixed(1)} KB` : "—"}</TableCell>
                            <TableCell className="text-right pr-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}><Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => item.is_folder ? setCurrentFolderId(item.id) : window.open(item.image_url, "_blank")}><ExternalLink className="h-3.5 w-3.5 mr-2" /> Buka</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleCut(item)}><Scissors className="h-3.5 w-3.5 mr-2" /> Potong</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleCopy(item)}><Copy className="h-3.5 w-3.5 mr-2" /> Salin</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {!item.is_folder && <DropdownMenuItem asChild><a href={item.image_url} download={item.title}><Download className="h-3.5 w-3.5 mr-2" /> Download</a></DropdownMenuItem>}
                                  <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(item.id)}><Trash2 className="h-3.5 w-3.5 mr-2" /> Hapus</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </ScrollArea>
          )}
        </div>
      </main>

      <Dialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Buat Folder Baru</DialogTitle></DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Nama Folder</Label>
            <Input id="folder-name" value={folderName} onChange={e => setFolderName(e.target.value)} placeholder="Mis: Produk 2026, Banner Promo" autoFocus />
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setFolderDialogOpen(false)}>Batal</Button><Button onClick={() => createFolderMut.mutate()} disabled={createFolderMut.isPending}>Buat Folder</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Hapus item ini?</AlertDialogTitle><AlertDialogDescription>Tindakan ini akan menghapus file/folder secara permanen.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => deleteId !== null && delMut.mutate(deleteId)}>Hapus</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteConfirm} onOpenChange={setBulkDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} item sekaligus?</AlertDialogTitle>
            <AlertDialogDescription>Semua item yang dipilih akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => bulkDelMut.mutate(selectedIds)}>Hapus Semua</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`animate-spin ${className}`}><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);

export default AdminGalleryPage;
