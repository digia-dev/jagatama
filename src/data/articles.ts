export interface ArticleExtraImage {
  src: string;
  caption?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  content: string[];
  extraImages?: ArticleExtraImage[];
}

export const articles: Article[] = [
  {
    slug: "regenerasi-petani-muda-tantangan-dan-peluang",
    title: "Regenerasi Petani Muda: Tantangan dan Peluang di Era Modern",
    excerpt:
      "Minat generasi muda yang rendah pada usaha pertanian menjadi tantangan serius. Jagasura hadir dengan program kepeloporan untuk mengubah wajah pertanian Indonesia.",
    category: "Agro-Education",
    date: "15 Mar 2026",
    image: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png",
    extraImages: [
      { src: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bu%20Ina.png", caption: "Kegiatan lapangan bersama peserta magang di area budidaya." },
      { src: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Halal%20Bi%20Halal.png", caption: "Pembinaan komunitas petani muda yang solid dan berdaya saing." },
    ],
    content: [
      "Minat generasi muda yang rendah pada usaha pertanian selaras dengan fakta bahwa porsi petani milenial di Indonesia sangat rendah. Hal ini diperkuat dengan stigma masyarakat yang menganggap pekerjaan dalam bidang pertanian kurang memberikan kesejahteraan dalam segi ekonomi.",
      "Regenerasi pelaku pertanian di Indonesia berjalan lambat dan relatif rendah. Solusi perlu segera ditemukan mengingat Indonesia dikenal sebagai negara agraris yang menggantungkan sebagian besar perekonomiannya pada sektor ini.",
      "Sektor pertanian sangat berkontribusi dalam penyerapan tenaga kerja di Indonesia. Satu dari tiga orang tenaga kerja di Indonesia berkecimpung dalam dunia pertanian. Bidang pertanian menjadi salah satu sektor pembangunan nasional yang memiliki peran penting sebagai penyerap tenaga kerja, sumber bahan pangan dan gizi, bahan baku industri, serta pendorong pergerakan sektor-sektor ekonomi lainnya.",
      "Regenerasi petani memiliki arti yang sama dengan suksesi (farm succession) dan pewarisan usaha pertanian (farm inheritance). Regenerasi petani sangat penting mengingat dunia yang semakin terbuka dan pasar yang semakin kompetitif. Pelaku yang bekerja di sektor pertanian harus petani yang produktif dan kreatif.",
      "Koperasi Satria Tani Hanggawana — induk dari Jagasura Agrotama — berkomitmen mendukung regenerasi ini melalui Program Kepeloporan yang mencakup pelatihan pertanian, tempat magang dan praktek kerja langsung, program beasiswa petani muda, program penempatan usaha pertanian, serta kemitraan dan kerjasama strategis.",
      "Kesejahteraan, kebersamaan, dan kesetaraan menjadi pondasi yang perlu dikokohkan dalam mewujudkan regenerasi petani muda yang efektif dan berkelanjutan.",
    ],
  },
  {
    slug: "melon-premium-jagasura-farm-tembus-pasar-nasional",
    title: "Melon Premium Jagasura: Kualitas Greenhouse Tembus Pasar Nasional",
    excerpt:
      "Dengan budidaya greenhouse berteknologi tinggi, melon varietas Fujisawa, Inthanon, dan Sweet Net berhasil menembus pasar premium nasional.",
    category: "Product Update",
    date: "8 Mar 2026",
    image: "/produk/Melon%20Premium/IMG_20260419_234135%20(1).png",
    extraImages: [
      { src: "/produk/Gambar%20Latar/GH.jpg", caption: "Greenhouse dengan pengaturan iklim mikro untuk budidaya melon premium." },
      { src: "/produk/Melon%20Premium/IMG_20260419_234230%20(1).png", caption: "Sortasi dan pengecekan mutu melon sebelum distribusi ke mitra ritel." },
    ],
    content: [
      "Melon premium Jagasura, selain kaya akan nutrisi dan manfaat, juga menjadi potensi bisnis yang menjanjikan. Produksi melon premium di lingkungan greenhouse memungkinkan pengendalian iklim mikro, irigasi presisi, dan jadwal panen yang lebih konsisten.",
      "Jenis melon yang dibudidayakan antara lain Fujisawa (Jepang), Inthanon (Belanda), Sweet Net (Thailand), Chamoe (Korea), Rangipo, dan melon premium lainnya. Kombinasi varietas unggul dengan protokol sanitasi lahan menjadi fondasi mutu yang dicari oleh pembeli segmen menengah ke atas.",
      "Tim on-farm memantau parameter brix, tekstur daging buah, dan ketebalan kulit agar produk memenuhi standar sortasi yang disepakati dengan mitra distribusi. Setiap batch produksi dilacak dari blok bedengan hingga titik serah terima.",
      "Ekspansi ke pasar nasional membutuhkan integritas rantai dingin dan dokumentasi traceability sederhana. Ke depan, pengembangan varietas tambahan dan penyelarasan jadwal panen dengan permintaan musiman akan menjadi fokus untuk menjaga stabilitas pasokan.",
    ],
  },
  {
    slug: "integrated-farming-zero-waste",
    title: "Integrated Farming: Sistem Pertanian Zero Waste Masa Depan",
    excerpt:
      "Konsep budidaya ikan dengan memanfaatkan limbah pertanian sebagai pakan maggot, kemudian maggot sebagai pakan lele. Sirkular ekonomi tanpa sisa.",
    category: "Innovation",
    date: "22 Mar 2026",
    image: "/produk/Gambar%20Latar/2.jpg",
    extraImages: [
      { src: "/produk/Holtikultura/Letuce.jpg", caption: "Hortikultura segar dari sistem budidaya terintegrasi zero waste." },
      { src: "/produk/Holtikultura/Sledri%20Amigo.jpg", caption: "Diversifikasi komoditas sayuran untuk mitigasi risiko dan optimasi lahan." },
    ],
    content: [
      "Konsep Integrated Farming atau Pertanian Terpadu yang dikembangkan Jagasura Agrotama menciptakan ekosistem produksi yang tidak menghasilkan limbah (Zero Waste). Limbah pertanian dimanfaatkan sebagai pakan maggot, kemudian maggot digunakan sebagai pakan lele — sebuah rantai biologis yang sirkular dan efisien.",
      "Maggot sebagai pakan alternatif juga tersedia dalam bentuk maggot segar dan maggot sangrai untuk kebutuhan pakan ternak secara lebih luas. Sistem ini menekan biaya produksi secara signifikan sekaligus mengurangi beban lingkungan.",
      "Di sisi lain, limbah ternak kambing dan kotoran sisa budidaya maggot diolah menjadi Pupuk Organik Padat maupun Cair sebagai produk unggulan. Limbah hasil pertanian turut digunakan sebagai bahan baku, menjadikan seluruh sistem pertanian ini benar-benar sirkular.",
      "Penerapan Plant Growth Promoting Rhizobacteria (PGPR) dan Agensia Pengendali Hayati (APH) yang sudah terbukti meningkatkan hasil pertanian semakin memperkuat komitmen Jagasura terhadap prinsip Back to Nature — mengurangi ketergantungan pada input kimia sintesis.",
      "Visi ini sejalan dengan misi Koperasi Satria Tani Hanggawana untuk menyajikan restorasi pertanian kekinian berbasis industri dan kearifan lokal, serta menerapkan agro teknologi tepat guna yang ramah lingkungan.",
    ],
  },
  {
    slug: "usaha-ternak-kambing-tegal-peluang-bisnis-besar",
    title: "Usaha Ternak Kambing di Tegal: 900 Ekor Per Hari, Peluang Bisnis Raksasa",
    excerpt:
      "Tegal terkenal dengan kuliner Sate Kambing yang membuat kebutuhan daging kambing sangat tinggi. Jagasura hadir dengan ekosistem ternak kambing terintegrasi.",
    category: "Partnership",
    date: "10 Mar 2026",
    image: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Bupati%20Tegal.png",
    extraImages: [
      { src: "/produk/Tanaman%20Buah/1776621585079.jpg.jpeg", caption: "Kunjungan mitra bisnis ke lahan peternakan terintegrasi Jagasura." },
      { src: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Baznaz%20Cirebon.png", caption: "Sinergi dengan mitra strategis dalam pengembangan kawasan usaha ternak." },
    ],
    content: [
      "Tegal terkenal dengan kuliner Sate Kambing yang sangat diminati. Fakta ini membuat kebutuhan daging kambing di wilayah Tegal dan sekitarnya sangat tinggi, mencapai 900 ekor per hari. Jagasura Agrotama hadir sebagai solusi dengan mengembangkan ekosistem bisnis ternak kambing terintegrasi.",
      "Selain memproduksi daging, potensi susu kambing perah juga sangat eksklusif karena tersedia dalam jumlah terbatas. Nilai jual susu kambing perah yang tinggi menjadikannya komoditas premium dengan margin yang sangat menarik bagi investor dan mitra.",
      "Proses pemotongan dilakukan sesuai dengan standar RPH (Rumah Pemotongan Hewan) yang memastikan pembagian karkas yang tepat, kualitas daging terjaga, serta penyimpanan di cold storage dengan standar suhu terkontrol. Seluruh operasional mengikuti standar keamanan pangan, higienitas, dan kelayakan produk asal hewan sesuai regulasi Kementan RI.",
      "RPH Jagasura menerapkan sistem cold storage lengkap mulai dari pascapenyembelihan, penanganan karkas, hingga distribusi — untuk menjaga mutu dan keamanan daging sampai ke tangan konsumen akhir.",
      "Model bisnis ini menggunakan pendekatan pemberdayaan masyarakat dan generasi muda dalam suatu kawasan terintegrasi, sehingga manfaat ekonomi dapat dirasakan secara luas oleh ekosistem bisnis di sekitarnya.",
    ],
  },
  {
    slug: "program-agropreneurship-beasiswa-petani-muda",
    title: "Program Agropreneurship & Beasiswa: Mencetak Petani Muda Masa Depan",
    excerpt:
      "Agropreneurship Farm Class yang rekreatif, inovatif, dan inspiratif hadir untuk mencetak generasi petani muda yang maju, mandiri, dan modern.",
    category: "Training",
    date: "1 Mar 2026",
    image: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Rektor%20UMT.jpg",
    extraImages: [
      { src: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Kyai.png", caption: "Sinergi tokoh masyarakat dan ulama dalam mendukung gerakan pertanian mandiri." },
      { src: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/IMG_20260420_021054%20(1).png", caption: "Aktivitas pelatihan lapangan bersama instruktur berpengalaman." },
    ],
    content: [
      "Program pelatihan Jagasura dirancang sebagai langkah penting dalam implementasi di bidang pertanian. Berperan aktif dalam pembangunan industri pertanian melalui pengembangan sumber daya manusia pertanian yang ulet, tangguh, dan mandiri.",
      "Program Kepeloporan mencakup: Pelatihan Pertanian (Swadaya dan Berbayar), Tempat Magang dan Praktek Kerja Langsung, Program Beasiswa Petani Muda, Program Penempatan Usaha Pertanian, serta Kemitraan dan Kerjasama strategis.",
      "Beasiswa Pertanian diberikan untuk calon petani muda yang maju, mandiri, dan modern. Program ini secara langsung menjawab tantangan rendahnya minat generasi muda terhadap sektor pertanian dengan memberikan insentif nyata dan jalur karier yang terstruktur.",
      "Agropreneurship Farm Class yang rekreatif, inovatif, dan inspiratif hadir sebagai format pembelajaran yang menyenangkan namun tetap substansif. Peserta tidak hanya belajar budidaya, tetapi juga mengenal manajemen usaha, pemasaran, dan kemitraan.",
      "Diklat dan Permagangan, Pengolahan Pupuk Organik, Bank Pakan Ternak, serta Edukasi Kemandirian Ekonomi Hijau menjadi komponen utama dalam ekosistem Farm–Food–Mart yang dikembangkan bersama Koperasi Satria Tani Hanggawana.",
    ],
  },
  {
    slug: "masterplan-lahan-agroedukasi-tegal",
    title: "Masterplan Lahan AgroEdu Jagasura di Dukuhwaru, Tegal",
    excerpt:
      "Lahan AgroEdu seluas beberapa hektare di Jalan Gili Turi, Dukuhwaru, Tegal, dirancang sebagai pusat industri pertanian terintegrasi pertama di wilayah Tegal.",
    category: "Agro-Education",
    date: "20 Feb 2026",
    image: "/produk/Gambar%20Latar/Latar%202.jpg",
    extraImages: [
      { src: "/produk/Gambar%20Latar/GH.jpg", caption: "Greenhouse modern di kawasan lahan AgroEdu Jagasura, Tegal." },
      { src: "/produk/Gambar%20Sinergitas%20(Tentang%20Kami)/Pelatihan.png", caption: "Aktivitas edukasi pertanian bagi peserta magang dari berbagai daerah." },
    ],
    content: [
      "Lahan AgroEdu Jagasura berlokasi di Jalan Gili Turi, Dukuhwaru, Tegal, Jawa Tengah, Indonesia. Kawasan ini dirancang sebagai pusat industri pertanian terintegrasi yang mencakup berbagai unit usaha dalam satu ekosistem yang saling mendukung.",
      "Masterplan lahan AgroEdu mencakup zona-zona produksi yang terintegrasi: greenhouse untuk budidaya melon premium dan hortikultura, klaster perkebunan buah tropis, kawasan usaha ternak, unit perikanan terpadu, klaster pupuk organik, serta fasilitas pelatihan dan agrowisata.",
      "Koperasi Satria Tani Hanggawana menciptakan infrastruktur industri pertanian terintegrasi untuk menghasilkan komoditas pangan yang berkelanjutan dan memberdayakan ekosistem bisnis yang mencakup: Jasa Penataan dan Olah Lahan, Budidaya Melon dan Hortikultura, Klaster Perkebunan Buah Tropis, Kawasan Usaha Ternak, Klaster Pupuk Organik, Perikanan Terpadu, Agrowisata, Pelatihan, Produk Kerajinan, Pemasaran, dan Kemitraan.",
      "Konsep tiga pilar utama — Farm, Food, dan Mart — menjadi inti kegiatan koperasi. Farm menghasilkan komoditas berkualitas, Food mengolahnya menjadi produk bernilai tambah, dan Mart memasarkannya kepada konsumen akhir melalui berbagai kanal distribusi.",
      "Visi besar ini: 'Terwujudnya Industri Pertanian ramah lingkungan, berkelanjutan, dan mandiri' — bukan sekadar slogan, melainkan peta jalan nyata yang sedang diwujudkan di lahan Dukuhwaru, Tegal.",
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
