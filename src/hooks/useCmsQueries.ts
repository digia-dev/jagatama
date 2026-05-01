import { useQuery } from "@tanstack/react-query";
import { cmsFetch } from "@/lib/cmsApi";
import type { Article } from "@/data/articles";
import { articles as fallbackArticles } from "@/data/articles";
import { productsCatalog as fallbackProducts } from "@/data/productsCatalog";
import type { CatalogProduct } from "@/data/productsCatalog";
import { fallbackSettings } from "@/data/siteSettings";
import type { SiteSettings } from "@/data/siteSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type HeroSlideApiRow = {
  id: number;
  image_url: string;
  sort_order: number;
  eyebrow: string;
  headline_part1: string;
  headline_highlight: string;
  headline_part2: string;
  description_text: string;
  primary_cta_label: string;
  primary_cta_hash: string;
  secondary_cta_label: string;
  secondary_cta_hash: string;
  footer_left: string;
  footer_right: string;
  created_at?: string;
  updated_at?: string;
};

export type HeroApiRow = {
  slides: HeroSlideApiRow[];
};

export type ProductApiRow = {
  id: number;
  slug?: string;
  title: string;
  category?: string;
  description: string;
  image_url: string;
  price: number;
  price_note: string;
  price_on_request: number;
  sort_order: number;
  variants: { id: number; label: string; price: number; sort_order: number; image_url?: string }[];
};

export type ArticleSummaryApi = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date_display: string;
  image_url: string;
};

export type ArticleFullApi = ArticleSummaryApi & {
  paragraphs: { id: number; body: string; sort_order: number }[];
  extra_images: { id: number; image_url: string; caption: string; sort_order: number }[];
};

export type GalleryApiRow = {
  id: number;
  image_url: string;
  alt_text: string;
  sort_order: number;
  is_tall: number;
};

export function mapProductRowToCatalog(p: ProductApiRow): CatalogProduct {
  const cat = typeof p.category === "string" ? p.category.trim() : "";
  return {
    id: p.slug || String(p.id),
    title: p.title,
    description: p.description,
    image: p.image_url,
    price: p.price,
    priceNote: p.price_note || undefined,
    priceOnRequest: !!p.price_on_request,
    category: cat || undefined,
    variants: (p.variants ?? []).map(v => ({
      id: String(v.id),
      label: v.label,
      price: v.price || p.price,
      image: v.image_url || undefined,
    })),
  };
}

export function mapArticleFullToArticle(a: ArticleFullApi): Article {
  const paragraphs = [...(a.paragraphs || [])].sort((x, y) => x.sort_order - y.sort_order);
  const content = paragraphs.map((p) => p.body);
  const extras = [...(a.extra_images || [])].sort((x, y) => x.sort_order - y.sort_order);
  const extraImages =
    extras.length > 0
      ? extras.map((e) => ({ src: e.image_url, caption: e.caption || undefined }))
      : undefined;
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    date: a.date_display,
    image: a.image_url,
    content,
    extraImages,
  };
}

export function mapSummaryToArticleCard(a: ArticleSummaryApi): Article {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    date: a.date_display,
    image: a.image_url,
    content: [],
  };
}

function heroStr(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

function normalizeHeroPayload(raw: unknown): HeroApiRow {
  const o = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  const legacy = {
    eyebrow: heroStr(o.eyebrow),
    headline_part1: heroStr(o.headline_part1),
    headline_highlight: heroStr(o.headline_highlight),
    headline_part2: heroStr(o.headline_part2),
    description_text: heroStr(o.description_text),
    primary_cta_label: heroStr(o.primary_cta_label),
    primary_cta_hash: heroStr(o.primary_cta_hash),
    secondary_cta_label: heroStr(o.secondary_cta_label),
    secondary_cta_hash: heroStr(o.secondary_cta_hash),
    footer_left: heroStr(o.footer_left),
    footer_right: heroStr(o.footer_right),
  };
  const slidesRaw = o.slides;
  const slides: HeroSlideApiRow[] = Array.isArray(slidesRaw)
    ? slidesRaw
        .map((s) => {
          if (!s || typeof s !== "object") return null;
          const r = s as Record<string, unknown>;
          const id = typeof r.id === "number" ? r.id : Number(r.id);
          const image_url = heroStr(r.image_url).trim();
          const sort_order = typeof r.sort_order === "number" ? r.sort_order : Number(r.sort_order) || 0;
          if (!Number.isFinite(id) || !image_url) return null;
          const pick = (k: keyof typeof legacy) => heroStr(r[k]).trim() || legacy[k];
          return {
            id,
            image_url,
            sort_order,
            eyebrow: pick("eyebrow"),
            headline_part1: pick("headline_part1"),
            headline_highlight: pick("headline_highlight"),
            headline_part2: pick("headline_part2"),
            description_text: pick("description_text"),
            primary_cta_label: pick("primary_cta_label"),
            primary_cta_hash: pick("primary_cta_hash"),
            secondary_cta_label: pick("secondary_cta_label"),
            secondary_cta_hash: pick("secondary_cta_hash"),
            footer_left: pick("footer_left"),
            footer_right: pick("footer_right"),
            created_at: typeof r.created_at === "string" ? r.created_at : undefined,
            updated_at: typeof r.updated_at === "string" ? r.updated_at : undefined,
          } as HeroSlideApiRow;
        })
        .filter((x): x is HeroSlideApiRow => x !== null)
    : [];
  const legacyUrl = typeof o.image_url === "string" ? o.image_url.trim() : "";
  if (slides.length === 0 && legacyUrl) {
    slides.push({
      id: 0,
      image_url: legacyUrl,
      sort_order: 0,
      eyebrow: legacy.eyebrow,
      headline_part1: legacy.headline_part1,
      headline_highlight: legacy.headline_highlight,
      headline_part2: legacy.headline_part2,
      description_text: legacy.description_text,
      primary_cta_label: legacy.primary_cta_label,
      primary_cta_hash: legacy.primary_cta_hash,
      secondary_cta_label: legacy.secondary_cta_label,
      secondary_cta_hash: legacy.secondary_cta_hash,
      footer_left: legacy.footer_left,
      footer_right: legacy.footer_right,
    });
  }
  return { slides };
}

export function parseHeroCmsResponse(raw: unknown): HeroApiRow {
  return normalizeHeroPayload(raw);
}

export function useHeroCms() {
  return useQuery<HeroApiRow>({
    queryKey: ["cms", "hero"],
    queryFn: async () => {
      const data = await cmsFetch("hero_slides.php");
      // The API returns an array directly, but normalizeHeroPayload expects { slides: [...] } or { ...legacy, slides: [...] }
      if (Array.isArray(data)) {
        return normalizeHeroPayload({ slides: data });
      }
      return normalizeHeroPayload(data);
    },
    retry: 1,
    staleTime: 60_000,
  });
}

export function useProductsCms() {
  return useQuery({
    queryKey: ["cms", "products"],
    queryFn: async () => {
      const data = (await cmsFetch("products.php")) as ProductApiRow[];
      if (!Array.isArray(data)) throw new Error("invalid");
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });
}

export function useProductsCatalogMerged(): { products: CatalogProduct[]; fromApi: boolean; pending: boolean; error: boolean } {
  const { data, isPending, isError } = useQuery({
    queryKey: ["cms", "products"],
    queryFn: async () => {
      const data = (await cmsFetch("products.php")) as ProductApiRow[];
      if (!Array.isArray(data)) throw new Error("invalid");
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });

  // While pending, we show fallbacks to avoid layout shift, but we mark it as pending
  if (isPending) return { products: fallbackProducts, fromApi: false, pending: true, error: false };
  
  // If error or no data, we use fallbacks
  if (isError || !data) return { products: fallbackProducts, fromApi: false, pending: false, error: true };
  
  // If we have data but it's empty, we might still want to show fallbacks OR an empty state.
  // User says "not matching data", so we should show EXACTLY what is in CMS if we have data.
  if (data.length === 0) {
     return { products: fallbackProducts, fromApi: false, pending: false, error: false };
  }

  const products: CatalogProduct[] = data.map(p => ({
    id: p.slug || String(p.id),
    title: p.title,
    category: p.category ?? "Lainnya",
    description: p.description,
    image: p.image_url,
    price: p.price,
    priceNote: p.price_note,
    priceOnRequest: !!p.price_on_request,
    variants: (p.variants ?? []).map(v => ({
      id: String(v.id),
      label: v.label,
      price: v.price || p.price,
      image: v.image_url || undefined,
    })),
  }));
  return { products, fromApi: true, pending: false, error: false };
}

export function useArticlesListCms() {
  return useQuery({
    queryKey: ["cms", "articles"],
    queryFn: async () => {
      const data = (await cmsFetch("articles.php")) as ArticleSummaryApi[];
      if (!Array.isArray(data)) throw new Error("invalid");
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });
}

export function useArticlesMerged(): { articles: Article[]; fromApi: boolean; pending: boolean; error: boolean } {
  const { data, isPending, isError } = useQuery({
    queryKey: ["cms", "articles"],
    queryFn: async () => {
      const data = (await cmsFetch("articles.php")) as ArticleSummaryApi[];
      if (!Array.isArray(data)) throw new Error("invalid");
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });

  if (isPending) return { articles: fallbackArticles, fromApi: false, pending: true, error: false };
  if (isError || !data) return { articles: fallbackArticles, fromApi: false, pending: false, error: true };
  
  if (data.length === 0) {
    return { articles: fallbackArticles, fromApi: false, pending: false, error: false };
  }

  const articles: Article[] = data.map(mapSummaryToArticleCard);
  return { articles, fromApi: true, pending: false, error: false };
}

export function useArticleBySlugCms(slug: string | undefined) {
  return useQuery({
    queryKey: ["cms", "article", slug],
    queryFn: async () => {
      if (!slug) throw new Error("no slug");
      const enc = encodeURIComponent(slug);
      const data = (await cmsFetch(`articles.php/slug/${enc}`)) as ArticleFullApi;
      return mapArticleFullToArticle(data);
    },
    enabled: Boolean(slug),
    retry: 1,
    staleTime: 60_000,
  });
}

export function useGalleryCms() {
  return useQuery({
    queryKey: ["cms", "gallery"],
    queryFn: async () => {
      const data = await cmsFetch("gallery.php");
      if (!Array.isArray(data)) throw new Error("invalid");
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });
}

export function useSettingsCms() {
  return useQuery<SiteSettings>({
    queryKey: ["cms", "settings"],
    queryFn: async () => {
      try {
        const data = await cmsFetch("settings.php");
        return data as SiteSettings;
      } catch {
        return fallbackSettings;
      }
    },
    staleTime: 60_000,
  });
}

export function useUpdateSettingsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SiteSettings) => {
      return cmsFetch("settings.php", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cms", "settings"] });
    },
  });
}

export type WhatsAppContactApiRow = {
  id: number;
  label: string;
  phone: string;
  department: string;
  is_primary: number;
  is_active: number;
};

export function useWhatsAppContactsCms() {
  return useQuery<WhatsAppContactApiRow[]>({
    queryKey: ["cms", "whatsapp-contacts"],
    queryFn: async () => {
      try {
        const data = await cmsFetch("whatsapp.php?active=1");
        if (!Array.isArray(data) || data.length === 0) return [];
        return data as WhatsAppContactApiRow[];
      } catch {
        return [];
      }
    },
    staleTime: 60_000,
  });
}
