# PT Jagasura Agro Utama - Platform Terintegrasi

Platform *company profile*, katalog produk, agrowisata, dan *e-commerce* via WhatsApp resmi untuk **PT Jagasura Agro Utama** (Koperasi Satria Tani Hanggawana). Platform ini menggunakan arsitektur modern (React Vite) yang terhubung ke Backend kustom berbasis PHP (Headless CMS) untuk memungkinkan pengelolaan konten yang dinamis secara real-time.

## 🚀 Fitur Utama

- **Company Profile Dinamis**: Visi, misi, data tim ("Penggerak Ekosistem"), dan *testimonial* (Mitra/Review) tersinkronisasi dengan *database* CMS.
- **Katalog & Keranjang Produk**: Pengunjung dapat mencari, mem-filter, dan menambahkan produk ke keranjang. *Checkout* langsung terhubung ke nomor WhatsApp admin dengan *template* pesan terisi otomatis (termasuk total harga).
- **Agrowisata & Program (Beasiswa/Magang)**: Integrasi reservasi tiket & pendaftaran langsung ke WhatsApp. Layout *responsive* berbasis interaksi *swipe* (*Carousel*) di perangkat *mobile*.
- **Admin Panel Terpusat (CMS)**: Halaman *dashboard* admin (`/admin`) untuk mengelola teks berjalan (Hero), produk, portofolio galeri, artikel berita, testimoni, data tim, hingga tautan WhatsApp tanpa harus mengubah kode (kredensial dikelola di konfigurasi server).
- **Desain Modern & Responsif**: Dibangun dengan Tailwind CSS, menggunakan pendekatan *Mobile-First*, interaksi animasi halus (Framer Motion), serta aksesibilitas tinggi berkat komponen UI shadcn.

## 🛠️ Stack Teknologi

- **Frontend**: React 18, TypeScript, Vite, React Router DOM v6
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI), Tailwind Merge, clsx
- **Animasi & UI**: Framer Motion, Embla Carousel, Lucide Icons
- **State & Data Fetching**: TanStack Query (React Query)
- **Backend / API**: Native PHP 8+ (Routing & REST API JSON)
- **Database**: MySQL / MariaDB

## 📦 Panduan Instalasi & Menjalankan Aplikasi Lokal

Aplikasi ini dibagi menjadi dua *environment* yang berjalan bersamaan: peladen *frontend* (Node.js) dan peladen *backend/API* (PHP).

### 1. Prasyarat (*Prerequisites*)
Pastikan Anda sudah menginstal:
- **Node.js** (v18 atau lebih baru) dan npm
- **PHP** (v8.0 atau lebih baru)
- **MySQL / MariaDB** (seperti XAMPP, Laragon, dsb.)

### 2. Setup Database & Backend
1. Buat *database* MySQL kosong (misalnya bernama `jagatama`).
2. *Import* file *schema* SQL yang tersedia di `jagatama/database.sql` ke dalam *database* yang baru Anda buat.
3. *Copy* file `.env.example` (jika ada) menjadi `.env` di folder *root* proyek Anda, lalu sesuaikan koneksi databasenya:
   ```env
   DB_HOST=127.0.0.1
   DB_NAME=jagatama
   DB_USER=root
   DB_PASS=
   ```
4. Masuk ke direktori *root* proyek, dan jalankan *server* PHP bawaan yang diarahkan ke folder `jagatama` (folder yang berisi skrip API):
   ```bash
   php -S localhost:8000 -t jagatama
   ```
   *(Backend akan berjalan di `http://localhost:8000`)*

### 3. Setup Frontend
1. Buka jendela terminal/CMD baru di folder proyek *root* Anda.
2. Instal semua dependensi Node.js:
   ```bash
   npm install
   ```
3. Jalankan peladen pengembangan (*development server*) Vite:
   ```bash
   npm run dev
   ```
4. Buka tautan URL lokal yang tertera di terminal Anda (biasanya `http://localhost:5173`) di *browser*.

## 🔑 Akses Panel Admin

Secara standar, panel admin dapat diakses melalui rute `/admin` (misalnya: `http://localhost:5173/admin`). Pengaturan sistem masuk (*login*) diatur dalam konfigurasi API Backend atau di-bypass di sesi pengembangan. Silakan merujuk pada `jagatama/login.php` dan `jagatama/settings.php` untuk konfigurasi kredensial.

---

<p align="center">
  <b>Developed by DIGIA</b>
</p>
