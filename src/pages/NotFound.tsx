import { Link } from "react-router-dom";
import { ShoppingBag, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream-gradient px-6 text-center">
      {/* Logo */}
      <Link to="/" className="mb-10 flex items-center gap-3">
        <img src="/logotp.png" alt="Jagasura Agrotama" className="h-12 w-auto object-contain" />
        <div className="flex flex-col text-left">
          <span className="font-heading text-xl font-bold">
            <span className="text-harvest">Jagasura</span> Agrotama
          </span>
          <span className="text-xs text-muted-foreground">Sustainable Agriculture</span>
        </div>
      </Link>

      {/* Illustration */}
      <div className="mb-6 text-[6rem] leading-none select-none" aria-hidden>🌱</div>

      {/* Error text */}
      <p className="mb-2 font-body text-sm font-bold uppercase tracking-[0.25em] text-harvest">Error 404</p>
      <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
        Lahan Ini Belum Ditanami
      </h1>
      <p className="mb-10 max-w-md font-body text-base text-muted-foreground">
        Halaman yang Anda cari tidak ditemukan. Mungkin sudah dipindahkan atau URL-nya salah ketik.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-harvest px-6 py-3 font-body font-semibold text-white shadow-sm transition hover:bg-harvest/90"
        >
          <Home className="h-4 w-4" aria-hidden />
          Kembali ke Beranda
        </Link>
        <Link
          to="/produk"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-body font-semibold text-foreground transition hover:border-harvest/40 hover:bg-secondary/60"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden />
          Lihat Produk Kami
        </Link>
      </div>

      <p className="mt-12 font-body text-xs text-muted-foreground">
        "Bertani itu Keren dan Berdaya Saing" — Jagasura Agrotama
      </p>
    </div>
  );
};

export default NotFound;
