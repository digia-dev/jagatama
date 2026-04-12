import type { ArticleSummaryApi, ProductApiRow } from "@/hooks/useCmsQueries";
import type { CatalogProduct } from "@/data/productsCatalog";

export function filterCatalogProducts(products: CatalogProduct[], search: string, category: string): CatalogProduct[] {
  const q = search.trim().toLowerCase();
  const cat = category.trim();
  return products.filter((p) => {
    if (cat && (p.category ?? "").trim() !== cat) return false;
    if (!q) return true;
    const hay = `${p.title} ${p.description} ${p.category ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}

export function uniqueProductCategories(products: CatalogProduct[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const c = (p.category ?? "").trim();
    if (c) set.add(c);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "id"));
}

export function filterProductApiRows(products: ProductApiRow[], search: string, category: string): ProductApiRow[] {
  const q = search.trim().toLowerCase();
  const cat = category.trim();
  return products.filter((p) => {
    if (cat && (p.category ?? "").trim() !== cat) return false;
    if (!q) return true;
    const hay = `${p.title} ${p.description} ${p.category ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}

export function uniqueCategoriesFromProductRows(products: ProductApiRow[]): string[] {
  const set = new Set<string>();
  for (const p of products) {
    const c = (p.category ?? "").trim();
    if (c) set.add(c);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b, "id"));
}

export function filterArticleSummaries(articles: ArticleSummaryApi[], search: string, category: string): ArticleSummaryApi[] {
  const q = search.trim().toLowerCase();
  const cat = category.trim();
  return articles.filter((a) => {
    if (cat && (a.category ?? "").trim() !== cat) return false;
    if (!q) return true;
    const hay = `${a.title} ${a.slug} ${a.excerpt} ${a.category}`.toLowerCase();
    return hay.includes(q);
  });
}

export function uniqueArticleCategories(articles: ArticleSummaryApi[]): string[] {
  const set = new Set<string>();
  for (const a of articles) {
    const c = (a.category ?? "").trim();
    if (c) set.add(c);
  }
  return Array.from(set).sort((x, y) => x.localeCompare(y, "id"));
}
