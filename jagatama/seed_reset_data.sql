SET NAMES utf8mb4;

SET @img_hero = 'https://api.vadr.my.id//uploads/img_69da3dbf5c6703.07189099.webp';
SET @img_about = 'https://api.vadr.my.id//uploads/img_69da3dbf836980.31202107.webp';
SET @img_melon = 'https://api.vadr.my.id//uploads/img_69da3dbf6a7a79.17316415.webp';
SET @img_tropical = 'https://api.vadr.my.id//uploads/img_69da3dbf819da2.56400345.webp';
SET @img_horti = 'https://api.vadr.my.id//uploads/img_69da3dbf5d0a98.75663562.webp';
SET @img_livestock = 'https://api.vadr.my.id//uploads/img_69da3dbf6a7397.39583392.webp';
SET @img_services = 'https://api.vadr.my.id//uploads/img_69da3dbf826a10.71814394.webp';
SET @img_gallery = 'https://api.vadr.my.id//uploads/img_69da3dbf997d23.30340118.webp';

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM article_extra_images;
DELETE FROM article_paragraphs;
DELETE FROM articles;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM gallery_items;
DELETE FROM hero_slides;
DELETE FROM admins;
SET FOREIGN_KEY_CHECKS = 1;

ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE product_variants AUTO_INCREMENT = 1;
ALTER TABLE articles AUTO_INCREMENT = 1;
ALTER TABLE article_paragraphs AUTO_INCREMENT = 1;
ALTER TABLE article_extra_images AUTO_INCREMENT = 1;
ALTER TABLE gallery_items AUTO_INCREMENT = 1;
ALTER TABLE hero_slides AUTO_INCREMENT = 1;
ALTER TABLE admins AUTO_INCREMENT = 1;

INSERT INTO admins (username, password_hash) VALUES ('admin', '$2y$10$YE2WNqcKfISNdJT7aIKDNOqY4VzbFi.JD5HoAaNJ.kbPgYRZMSpda');

INSERT INTO hero_slides (image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right) VALUES
(@img_hero, 0, 'PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi', 'Operasi agro terpadu: ', 'budidaya', ', edukasi, dan nilai tambah berkelanjutan', 'Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.', 'Lihat Produk Kami', 'produk', 'Hubungi Kami', 'kontak', 'Jagasura Farm', 'MJ Farm'),
(@img_about, 1, 'PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi', 'Operasi agro terpadu: ', 'budidaya', ', edukasi, dan nilai tambah berkelanjutan', 'Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.', 'Lihat Produk Kami', 'produk', 'Hubungi Kami', 'kontak', 'Jagasura Farm', 'MJ Farm'),
(@img_horti, 2, 'PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi', 'Operasi agro terpadu: ', 'budidaya', ', edukasi, dan nilai tambah berkelanjutan', 'Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.', 'Lihat Produk Kami', 'produk', 'Hubungi Kami', 'kontak', 'Jagasura Farm', 'MJ Farm');

INSERT INTO products (title, category, description, image_url, price, price_note, sort_order) VALUES
('Melon Premium', 'Buah', 'Dibudidayakan dalam greenhouse berteknologi tinggi dengan kualitas premium.', @img_melon, 85000, 'per kg', 1),
('Buah Tropis', 'Buah', 'Komoditas buah tropis bernilai tinggi dari perkebunan terpadu.', @img_tropical, 45000, 'per kg', 2),
('Hortikultura', 'Sayuran', 'Sayuran dan komoditas hortikultura dengan nilai ekonomi tinggi.', @img_horti, 25000, 'per kg', 3),
('Usaha Ternak & RPH', 'Peternakan', 'Peternakan kambing dan rumah pemotongan hewan berstandar nasional dengan cold storage terintegrasi.', @img_livestock, 120000, 'estimasi per paket', 4);

INSERT INTO product_variants (product_id, label, sort_order) VALUES
(1, 'Fujisawa (Jepang)', 0), (1, 'Inthanon (Belanda)', 1), (1, 'Sweet Net (Thailand)', 2), (1, 'Chamoe (Korea)', 3), (1, 'Rangipo', 4),
(2, 'Alpukat', 0), (2, 'Durian', 1), (2, 'Jambu Air', 2), (2, 'Jeruk Lemon', 3), (2, 'Mangga', 4), (2, 'Markisa', 5), (2, 'Pepaya', 6),
(3, 'Cabai', 0), (3, 'Kembang Kol', 1), (3, 'Kentang', 2), (3, 'Lettuce', 3), (3, 'Tomat', 4), (3, 'Terong', 5), (3, 'Timun', 6);

INSERT INTO articles (slug, title, excerpt, category, date_display, image_url) VALUES
('regenerasi-petani-muda-tantangan-dan-peluang', 'Regenerasi Petani Muda: Tantangan dan Peluang di Era Modern', 'Indonesia membutuhkan generasi baru petani yang tidak hanya memahami cara bercocok tanam, tetapi juga menguasai teknologi dan bisnis.', 'Agro-Education', '15 Mar 2026', @img_gallery),
('melon-premium-jagasura-farm-tembus-pasar-nasional', 'Melon Premium Jagasura Farm Tembus Pasar Nasional', 'Dengan budidaya greenhouse berteknologi tinggi, melon varietas Fujisawa dan Inthanon berhasil memasuki pasar premium.', 'Product Update', '8 Mar 2026', @img_melon),
('pelatihan-pertanian-terpadu-batch-12-dibuka', 'Pelatihan Pertanian Terpadu Batch ke-12 Dibuka', 'Program magang dan pelatihan pertanian terpadu untuk generasi muda kembali dibuka dengan kuota terbatas.', 'Training', '1 Mar 2026', @img_services),
('integrasi-teknologi-dan-kearifan-lokal-di-lahan', 'Integrasi Teknologi dan Kearifan Lokal di Lahan', 'Pendekatan hibrida antara sensor irigasi dan praktik turun-temurun membantu menjaga produksi tetap stabil saat cuaca ekstrem.', 'Innovation', '22 Feb 2026', @img_horti),
('kemitraan-petani-dan-distribusi-produk-segar', 'Kemitraan Petani dan Distribusi Produk Segar', 'Memperpendek rantai pasok antara kebun dan konsumen akhir melalui kemitraan yang transparan dan saling menguntungkan.', 'Partnership', '10 Feb 2026', @img_tropical);

INSERT INTO article_paragraphs (article_id, body, sort_order) VALUES
(1, 'Regenerasi petani muda menjadi salah satu agenda strategis ketahanan pangan nasional. Di tengah penuaan demografi pelaku pertanian, masuknya generasi muda ke sektor ini menentukan apakah Indonesia mampu menjaga produktivitas sekaligus daya saing di pasar global.', 0),
(1, 'Tantangan utamanya tidak lagi sekadar keterampilan budidaya lapangan. Petani masa kini dihadapkan pada data, rantai pasok, standar mutu, serta tuntutan keberlanjutan lingkungan. Tanpa literasi digital dan manajemen usaha, transformasi pertanian akan berjalan lambat.', 1),
(1, 'Di sisi peluang, ekosistem startup agrikultur, akses pembiayaan berbasis kelompok, serta program magang di kebun dan greenhouse modern membuka jalur karier yang sebelumnya kurang terlihat oleh banyak orang muda.', 2),
(1, 'Kunci keberhasilan adalah kolaborasi antara pemerintah daerah, dunia usaha, dan lembaga pendidikan vokasi. Ketika pelatihan teknis dipadukan dengan mentoring bisnis dan akses pasar, profil petani muda berubah dari sekadar produsen menjadi pengelola usaha agro yang adaptif.', 3),
(1, 'Jagasura Agrotama berkomitmen mendukung regenerasi ini melalui program edukasi lapangan, fasilitasi magang, dan demonstrasi teknologi tepat guna yang dapat ditiru oleh petani mitra di sekitar kawasan operasi.', 4),
(2, 'Produksi melon premium di lingkungan greenhouse memungkinkan pengendalian iklim mikro, irigasi presisi, dan jadwal panen yang lebih konsisten. Kombinasi varietas unggul dengan protokol sanitasi lahan menjadi fondasi mutu yang dicari oleh pembeli segmen menengah ke atas.', 0),
(2, 'Varietas seperti Fujisawa dan Inthanon dipilih setelah uji adaptasi dan uji pasar. Tim on-farm memantau parameter brix, tekstur daging buah, dan ketebalan kulit agar produk memenuhi standar sortasi yang disepakati dengan mitra distribusi.', 1),
(2, 'Ekspansi ke pasar nasional membutuhkan integritas rantai dingin dan dokumentasi traceability sederhana. Setiap batch produksi dilacak dari blok bedengan hingga titik serah terima guna memperkuat kepercayaan pelanggan dan mempermudah recall bila diperlukan.', 2),
(2, 'Ke depan, pengembangan varietas tambahan dan penyelarasan jadwal panen dengan permintaan musiman akan menjadi fokus untuk menjaga stabilitas pasokan tanpa menekan harga di tingkat petani.', 3),
(3, 'Batch ke-12 dirancang sebagai program intensif yang menggabungkan teori ringkas dengan praktik langsung di lahan dan fasilitas pendukung. Peserta tidak hanya belajar budidaya, tetapi juga mengenal keselamatan kerja, pengelolaan input, dan komunikasi dengan pembeli.', 0),
(3, 'Kuota dibatasi agar setiap peserta mendapat bimbingan yang memadai dari instruktur lapangan. Kurikulum disusun berbasis kompetensi yang relevan dengan kebutuhan usaha tani kecil hingga menengah di wilayah sekitar.', 1),
(3, 'Seleksi peserta mempertimbangkan motivasi, ketersediaan waktu, dan potensi penerapan ilmu setelah program selesai. Kami mendorong peserta yang berasal dari kelompok tani atau komunitas agar pengetahuan dapat menyebar lebih luas.', 2),
(3, 'Pendaftaran dibuka secara online dengan pengumpulan dokumen sederhana. Untuk informasi jadwal, biaya, dan persyaratan terbaru, calon peserta dapat menghubungi kontak resmi yang tertera di halaman Kontak situs ini.', 3),
(4, 'Teknologi tidak menggantikan kearifan lokal; keduanya saling melengkapi. Contoh nyata adalah penjadwalan irigasi berdasarkan data kelembaban tanah yang tetap dikalibrasi dengan pengamatan petani terhadap musim dan pola angin setempat.', 0),
(4, 'Di kawasan budidaya kami, tim lapangan mendokumentasikan keputusan penting setiap musim sehingga pembelajaran tidak hilang ketika pergantian personel. Basis pengetahuan ini mempercepat adaptasi saat varietas atau input baru diperkenalkan.', 1),
(4, 'Partisipasi petani mitra dalam uji coba terbatas memastikan solusi teknis tetap relevan secara sosial dan ekonomi, bukan hanya secara teknis.', 2),
(5, 'Distribusi produk segar membutuhkan sinkronisasi antara jadwal panen, kapasitas sortasi, dan jendela waktu pengiriman. Kemitraan jangka panjang dengan petani membantu perencanaan volume yang lebih dapat diprediksi.', 0),
(5, 'Skema harga dan insentif mutu disepakati di awal musim agar risiko fluktuasi dapat dikelola bersama. Transparansi grade dan penjelasan penolakan mutu mengurangi konflik dan memperkuat kepercayaan.', 1),
(5, 'Kami terus membuka dialog dengan mitra ritel dan layanan katering yang membutuhkan pasokan stabil sayuran dan buah bermutu, sehingga manfaat ekonomi dari lahan dapat dirasakan lebih luas oleh pelaku usaha kecil.', 2);

INSERT INTO article_extra_images (article_id, image_url, caption, sort_order) VALUES
(1, @img_about, 'Kegiatan lapangan bersama peserta magang di area budidaya.', 0),
(1, @img_services, 'Ruang pelatihan dan demonstrasi teknik budidaya terkini.', 1),
(2, @img_gallery, 'Greenhouse dengan pengaturan iklim mikro untuk budidaya melon.', 0),
(2, @img_horti, 'Sortasi dan pengecekan mutu sebelum distribusi.', 1),
(3, @img_hero, 'Aktivitas pengenalan infrastruktur pertanian terintegrasi.', 0),
(3, @img_about, 'Praktik langsung di lahan bersama instruktur.', 1),
(4, @img_gallery, 'Pengamatan tanaman dan keputusan irigasi berbasis data dan pengalaman lapangan.', 0),
(4, @img_tropical, 'Diversifikasi komoditas untuk mitigasi risiko iklim.', 1),
(5, @img_livestock, 'Koordinasi pasokan dan standar mutu bersama mitra petani.', 0),
(5, @img_melon, 'Penyiapan komoditas segar untuk saluran distribusi.', 1);

INSERT INTO gallery_items (image_url, alt_text, sort_order, is_tall) VALUES
(@img_hero, 'Greenhouse aerial view', 0, 0),
(@img_about, 'Hands planting seedlings', 1, 0),
(@img_melon, 'Premium melon cultivation', 2, 0),
(@img_services, 'Young farmers in training', 3, 0),
(@img_gallery, 'Greenhouse interior', 4, 0),
(@img_livestock, 'Livestock grazing', 5, 0);
