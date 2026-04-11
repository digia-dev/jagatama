import { useQuery } from "@tanstack/react-query";
import { cmsFetch } from "@/lib/cmsApi";
import type { Article } from "@/data/articles";
import { articles as fallbackArticles } from "@/data/articles";
import { productsCatalog as fallbackProducts } from "@/data/productsCatalog";
import type { CatalogProduct } from "@/data/productsCatalog";

export type HeroApiRow = {
  id: number;
  image_url: string;
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
  updated_at?: string;
};

export type ProductApiRow = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  price: number;
  price_note: string;
  sort_order: number;
  variants: { id: number; label: string; sort_order: number }[];
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
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    image: p.image_url,
    price: p.price,
    priceNote: p.price_note || undefined,
    items: p.variants?.map((v) => v.label) ?? [],
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

export function useHeroCms() {
  return useQuery({
    queryKey: ["cms", "hero"],
    queryFn: async () => {
      const data = (await cmsFetch("hero.php")) as HeroApiRow;
      return data;
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

export function useProductsCatalogMerged(): { products: CatalogProduct[]; fromApi: boolean; pending: boolean } {
  const q = useProductsCms();
  if (q.isPending) {
    return { products: fallbackProducts, fromApi: false, pending: true };
  }
  if (q.data && q.data.length > 0) {
    return { products: q.data.map(mapProductRowToCatalog), fromApi: true, pending: false };
  }
  return { products: fallbackProducts, fromApi: false, pending: false };
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

export function useArticlesMerged(): { articles: Article[]; fromApi: boolean; pending: boolean } {
  const q = useArticlesListCms();
  if (q.isPending) {
    return { articles: fallbackArticles, fromApi: false, pending: true };
  }
  if (q.data && q.data.length > 0) {
    return {
      articles: q.data.map(mapSummaryToArticleCard),
      fromApi: true,
      pending: false,
    };
  }
  return { articles: fallbackArticles, fromApi: false, pending: false };
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
      const data = (await cmsFetch("gallery.php")) as GalleryApiRow[];
      if (!Array.isArray(data)) throw new Error("invalid");
      return data;
    },
    retry: 1,
    staleTime: 60_000,
  });
}
