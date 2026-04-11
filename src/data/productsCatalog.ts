import melonImg from "@/assets/product-melon.jpg";
import tropicalImg from "@/assets/product-tropical.jpg";
import hortiImg from "@/assets/product-horticulture.jpg";
import livestockImg from "@/assets/product-livestock.jpg";

export type CatalogProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  priceNote?: string;
  items?: string[];
};

export const productsCatalog: CatalogProduct[] = [
  {
    id: "melon-premium",
    title: "Melon Premium",
    description: "Dibudidayakan dalam greenhouse berteknologi tinggi dengan kualitas premium.",
    image: melonImg,
    price: 85000,
    priceNote: "per kg",
    items: ["Fujisawa (Jepang)", "Inthanon (Belanda)", "Sweet Net (Thailand)", "Chamoe (Korea)", "Rangipo"],
  },
  {
    id: "buah-tropis",
    title: "Buah Tropis",
    description: "Komoditas buah tropis bernilai tinggi dari perkebunan terpadu.",
    image: tropicalImg,
    price: 45000,
    priceNote: "per kg",
    items: ["Alpukat", "Durian", "Jambu Air", "Jeruk Lemon", "Mangga", "Markisa", "Pepaya"],
  },
  {
    id: "hortikultura",
    title: "Hortikultura",
    description: "Sayuran dan komoditas hortikultura dengan nilai ekonomi tinggi.",
    image: hortiImg,
    price: 25000,
    priceNote: "per kg",
    items: ["Cabai", "Kembang Kol", "Kentang", "Lettuce", "Tomat", "Terong", "Timun"],
  },
  {
    id: "ternak-rph",
    title: "Usaha Ternak & RPH",
    description: "Peternakan kambing dan rumah pemotongan hewan berstandar nasional dengan cold storage terintegrasi.",
    image: livestockImg,
    price: 120000,
    priceNote: "estimasi per paket",
  },
];

export function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
