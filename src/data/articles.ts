import galleryImg from "@/assets/gallery-greenhouse.jpg";

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  content: string[];
}

export const articles: Article[] = [
  {
    slug: "regenerasi-petani-muda-tantangan-dan-peluang",
    title: "Regenerasi Petani Muda: Tantangan dan Peluang di Era Modern",
    excerpt:
      "Indonesia membutuhkan generasi baru petani yang tidak hanya memahami cara bercocok tanam, tetapi juga menguasai teknologi dan bisnis.",
    category: "Agro-Education",
    date: "15 Mar 2026",
    image: galleryImg,
    content: [
      "Regenerasi petani muda menjadi salah satu agenda strategis ketahanan pangan nasional. Di tengah penuaan demografi pelaku pertanian, masuknya generasi muda ke sektor ini menentukan apakah Indonesia mampu menjaga produktivitas sekaligus daya saing di pasar global.",
      "Tantangan utamanya tidak lagi sekadar keterampilan budidaya lapangan. Petani masa kini dihadapkan pada data, rantai pasok, standar mutu, serta tuntutan keberlanjutan lingkungan. Tanpa literasi digital dan manajemen usaha, transformasi pertanian akan berjalan lambat.",
      "Di sisi peluang, ekosistem startup agrikultur, akses pembiayaan berbasis kelompok, serta program magang di kebun dan greenhouse modern membuka jalur karier yang sebelumnya kurang terlihat oleh banyak orang muda.",
      "Kunci keberhasilan adalah kolaborasi antara pemerintah daerah, dunia usaha, dan lembaga pendidikan vokasi. Ketika pelatihan teknis dipadukan dengan mentoring bisnis dan akses pasar, profil petani muda berubah dari sekadar produsen menjadi pengelola usaha agro yang adaptif.",
      "Jagasura Agrotama berkomitmen mendukung regenerasi ini melalui program edukasi lapangan, fasilitasi magang, dan demonstrasi teknologi tepat guna yang dapat ditiru oleh petani mitra di sekitar kawasan operasi.",
    ],
  },
  {
    slug: "melon-premium-jagasura-farm-tembus-pasar-nasional",
    title: "Melon Premium Jagasura Farm Tembus Pasar Nasional",
    excerpt:
      "Dengan budidaya greenhouse berteknologi tinggi, melon varietas Fujisawa dan Inthanon berhasil memasuki pasar premium.",
    category: "Product Update",
    date: "8 Mar 2026",
    image: galleryImg,
    content: [
      "Produksi melon premium di lingkungan greenhouse memungkinkan pengendalian iklim mikro, irigasi presisi, dan jadwal panen yang lebih konsisten. Kombinasi varietas unggul dengan protokol sanitasi lahan menjadi fondasi mutu yang dicari oleh pembeli segmen menengah ke atas.",
      "Varietas seperti Fujisawa dan Inthanon dipilih setelah uji adaptasi dan uji pasar. Tim on-farm memantau parameter brix, tekstur daging buah, dan ketebalan kulit agar produk memenuhi standar sortasi yang disepakati dengan mitra distribusi.",
      "Ekspansi ke pasar nasional membutuhkan integritas rantai dingin dan dokumentasi traceability sederhana. Setiap batch produksi dilacak dari blok bedengan hingga titik serah terima guna memperkuat kepercayaan pelanggan dan mempermudah recall bila diperlukan.",
      "Ke depan, pengembangan varietas tambahan dan penyelarasan jadwal panen dengan permintaan musiman akan menjadi fokus untuk menjaga stabilitas pasokan tanpa menekan harga di tingkat petani.",
    ],
  },
  {
    slug: "pelatihan-pertanian-terpadu-batch-12-dibuka",
    title: "Pelatihan Pertanian Terpadu Batch ke-12 Dibuka",
    excerpt:
      "Program magang dan pelatihan pertanian terpadu untuk generasi muda kembali dibuka dengan kuota terbatas.",
    category: "Training",
    date: "1 Mar 2026",
    image: galleryImg,
    content: [
      "Batch ke-12 dirancang sebagai program intensif yang menggabungkan teori ringkas dengan praktik langsung di lahan dan fasilitas pendukung. Peserta tidak hanya belajar budidaya, tetapi juga mengenal keselamatan kerja, pengelolaan input, dan komunikasi dengan pembeli.",
      "Kuota dibatasi agar setiap peserta mendapat bimbingan yang memadai dari instruktur lapangan. Kurikulum disusun berbasis kompetensi yang relevan dengan kebutuhan usaha tani kecil hingga menengah di wilayah sekitar.",
      "Seleksi peserta mempertimbangkan motivasi, ketersediaan waktu, dan potensi penerapan ilmu setelah program selesai. Kami mendorong peserta yang berasal dari kelompok tani atau komunitas agar pengetahuan dapat menyebar lebih luas.",
      "Pendaftaran dibuka secara online dengan pengumpulan dokumen sederhana. Untuk informasi jadwal, biaya, dan persyaratan terbaru, calon peserta dapat menghubungi kontak resmi yang tertera di halaman Kontak situs ini.",
    ],
  },
  {
    slug: "integrasi-teknologi-dan-kearifan-lokal-di-lahan",
    title: "Integrasi Teknologi dan Kearifan Lokal di Lahan",
    excerpt:
      "Pendekatan hibrida antara sensor irigasi dan praktik turun-temurun membantu menjaga produksi tetap stabil saat cuaca ekstrem.",
    category: "Innovation",
    date: "22 Feb 2026",
    image: galleryImg,
    content: [
      "Teknologi tidak menggantikan kearifan lokal; keduanya saling melengkapi. Contoh nyata adalah penjadwalan irigasi berdasarkan data kelembaban tanah yang tetap dikalibrasi dengan pengamatan petani terhadap musim dan pola angin setempat.",
      "Di kawasan budidaya kami, tim lapangan mendokumentasikan keputusan penting setiap musim sehingga pembelajaran tidak hilang ketika pergantian personel. Basis pengetahuan ini mempercepat adaptasi saat varietas atau input baru diperkenalkan.",
      "Partisipasi petani mitra dalam uji coba terbatas memastikan solusi teknis tetap relevan secara sosial dan ekonomi, bukan hanya secara teknis.",
    ],
  },
  {
    slug: "kemitraan-petani-dan-distribusi-produk-segar",
    title: "Kemitraan Petani dan Distribusi Produk Segar",
    excerpt:
      "Memperpendek rantai pasok antara kebun dan konsumen akhir melalui kemitraan yang transparan dan saling menguntungkan.",
    category: "Partnership",
    date: "10 Feb 2026",
    image: galleryImg,
    content: [
      "Distribusi produk segar membutuhkan sinkronisasi antara jadwal panen, kapasitas sortasi, dan jendela waktu pengiriman. Kemitraan jangka panjang dengan petani membantu perencanaan volume yang lebih dapat diprediksi.",
      "Skema harga dan insentif mutu disepakati di awal musim agar risiko fluktuasi dapat dikelola bersama. Transparansi grade dan penjelasan penolakan mutu mengurangi konflik dan memperkuat kepercayaan.",
      "Kami terus membuka dialog dengan mitra ritel dan layanan katering yang membutuhkan pasokan stabil sayuran dan buah bermutu, sehingga manfaat ekonomi dari lahan dapat dirasakan lebih luas oleh pelaku usaha kecil.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
