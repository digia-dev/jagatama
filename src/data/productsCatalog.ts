export type ProductVariant = {
  id?: number | string;
  label: string;
  price?: number;
  image?: string;
};

export type CatalogProduct = {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  priceNote?: string;
  category?: string;
  items?: string[]; // Fallback for legacy data
  variants?: ProductVariant[];
  priceOnRequest?: boolean;
};

export const productsCatalog: CatalogProduct[] = [
  {
    id: "melon-premium",
    title: "Melon Premium",
    category: "Buah",
    description: "Selain kaya akan nutrisi dan manfaat, melon kami juga menjadi potensi bisnis yang menjanjikan. Dibudidayakan dalam greenhouse berteknologi tinggi dengan kualitas premium.",
    image: "/produk/Melon%20Premium/IMG_20260419_234019%20(1).png",
    price: 85000,
    priceNote: "per kg",
    items: ["Fujisawa (Jepang)", "Inthanon (Belanda)", "Sweet Net (Thailand)", "Chamoe (Korea)", "Rangipo"],
  },
  {
    id: "buah-tropis",
    title: "Buah Tropis",
    category: "Buah",
    description: "Komoditas buah tropis unggulan dengan permintaan pasar tinggi dari perkebunan terpadu kami yang terintegrasi.",
    image: "/produk/Tanaman%20Buah/1776621428934.jpg.jpeg",
    price: 45000,
    priceNote: "per kg",
    items: ["Alpukat", "Durian", "Jambu Air", "Jambu Kristal", "Jeruk Lemon", "Mangga", "Markisa", "Pepaya"],
  },
  {
    id: "hortikultura",
    title: "Hortikultura",
    category: "Sayuran",
    description: "Sektor hortikultura mempunyai nilai ekonomis dan potensi agribisnis yang sangat tinggi.",
    image: "/produk/Holtikultura/Bayam%20Jepang.jpeg",
    price: 25000,
    priceNote: "per kg",
    items: ["Cabai", "Kembang Kol", "Kentang", "Lettuce", "Tomat", "Terong", "Timun"],
  },
  {
    id: "ubi-unggulan",
    title: "Ubi Unggulan",
    category: "Umbi-umbian",
    description: "Bisnis pertanian umbi-umbian adalah salah satu bisnis yang tidak pernah mati. Komoditas lokal dengan pangsa pasar internasional yang terus berkembang.",
    image: "/produk/Holtikultura/Ubi%20Madu.jpg",
    price: 18000,
    priceNote: "per kg",
    items: ["Ubi Madu", "Ubi Ungu (Murasaki)", "Ubi Ace Putih"],
  },
  {
    id: "ternak-rph",
    title: "Usaha Ternak & RPH",
    category: "Peternakan",
    description: "Ekosistem bisnis ternak kambing terintegrasi. Tegal terkenal dengan kuliner Sate Kambing — kebutuhan daging kambing mencapai 900 ekor per hari. RPH berstandar Kementan RI.",
    image: "/produk/Gambar%20Latar/3.jpg",
    price: 120000,
    priceNote: "per kg",
    items: ["Kambing Pedaging", "Susu Kambing Perah", "Karkas Berkualitas", "Cold Storage Terintegrasi", "RPH Standar Kementan RI"],
    priceOnRequest: true,
  },
  {
    id: "perikanan-terpadu",
    title: "Perikanan Terpadu",
    category: "Perikanan",
    description: "Konsep Zero Waste: limbah pertanian → pakan maggot → pakan lele. Integrated Farming yang ramah lingkungan dan efisien.",
    image: "/produk/Gambar%20Latar/GH.jpg",
    price: 30000,
    priceNote: "per kg",
    items: ["Budidaya Lele Terintegrasi", "Maggot Segar", "Maggot Sangrai", "Pakan Ternak Berbasis Maggot"],
    priceOnRequest: true,
  },
  {
    id: "pupuk-organik",
    title: "Pupuk Organik & APH",
    category: "Agriinput",
    description: "Pupuk organik padat dan cair berbahan baku limbah ternak dan budidaya. Mendukung pertanian berkelanjutan — Back to Nature.",
    image: "/produk/Gambar%20Latar/5.jpg",
    price: 15000,
    priceNote: "per kg",
    items: ["Pupuk Organik Padat", "Pupuk Organik Cair", "PGPR (Plant Growth Promoting Rhizobacteria)", "Agensia Pengendali Hayati (APH)"],
    priceOnRequest: true,
  },
  {
    id: "produk-olahan",
    title: "Produk Olahan & Kerajinan",
    category: "Produk Olahan",
    description: "Hasil panen diolah menjadi produk turunan bernilai ekonomi tinggi. Aneka kerajinan berbahan dasar bambu bernilai estetika tinggi.",
    image: "/produk/Gambar%20Latar/2.jpg",
    price: 25000,
    priceNote: "per produk",
    items: ["Olahan Bawang Merah", "Olahan Ubi", "Mug Bambu", "Tumbler Bambu", "Lonceng Angin", "Lampu Taman Bambu", "Gazebo Bambu", "Greenhouse Bambu"],
  },
  {
    id: "pelatihan",
    title: "Pelatihan & Agropreneurship",
    category: "Edukasi",
    description: "Agropreneurship Farm Class yang rekreatif, inovatif, dan inspiratif. Program magang, beasiswa, dan penempatan usaha pertanian bagi generasi muda.",
    image: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png",
    price: 500000,
    priceNote: "per program",
    items: ["Pelatihan Pertanian Swadaya & Berbayar", "Tempat Magang & Praktek Kerja Langsung", "Beasiswa Petani Muda", "Program Penempatan Usaha Pertanian", "Kemitraan & Kerjasama"],
  },
];

export function formatIdr(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
