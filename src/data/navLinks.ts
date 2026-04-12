import type { To } from "react-router-dom";

export type NavItem = { label: string; to: To };

export const mainNavLinks: NavItem[] = [
  { label: "Beranda", to: { pathname: "/", hash: "beranda" } },
  { label: "Tentang Kami", to: { pathname: "/", hash: "tentang" } },
  { label: "Tim Kami", to: "/tim" },
  { label: "Layanan", to: "/layanan" },
  { label: "Produk", to: "/produk" },
  { label: "Artikel", to: "/artikel" },
  { label: "Gallery", to: { pathname: "/", hash: "gallery" } },
  { label: "Kontak", to: { pathname: "/", hash: "kontak" } },
];
