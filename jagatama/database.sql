SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS article_extra_images;
DROP TABLE IF EXISTS article_paragraphs;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS gallery_items;
DROP TABLE IF EXISTS hero_slides;
DROP TABLE IF EXISTS admins;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE admins (
  id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admins (username, password_hash) VALUES ('admin', '$2y$10$YE2WNqcKfISNdJT7aIKDNOqY4VzbFi.JD5HoAaNJ.kbPgYRZMSpda');

CREATE TABLE hero_slides (
  id INT NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(1024) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  eyebrow VARCHAR(512) NOT NULL DEFAULT '',
  headline_part1 VARCHAR(512) NOT NULL DEFAULT '',
  headline_highlight VARCHAR(256) NOT NULL DEFAULT '',
  headline_part2 VARCHAR(512) NOT NULL DEFAULT '',
  description_text TEXT,
  primary_cta_label VARCHAR(128) NOT NULL DEFAULT '',
  primary_cta_hash VARCHAR(128) NOT NULL DEFAULT '',
  secondary_cta_label VARCHAR(128) NOT NULL DEFAULT '',
  secondary_cta_hash VARCHAR(128) NOT NULL DEFAULT '',
  footer_left VARCHAR(128) NOT NULL DEFAULT '',
  footer_right VARCHAR(128) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hero_slides_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hero_slides (image_url, sort_order, eyebrow, headline_part1, headline_highlight, headline_part2, description_text, primary_cta_label, primary_cta_hash, secondary_cta_label, secondary_cta_hash, footer_left, footer_right) VALUES
('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1920&q=80', 0, 'PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi', 'Operasi agro terpadu: ', 'budidaya', ', edukasi, dan nilai tambah berkelanjutan', 'Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.', 'Lihat Produk Kami', 'produk', 'Hubungi Kami', 'kontak', 'Jagasura Farm', 'MJ Farm'),
('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80', 1, 'PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi', 'Operasi agro terpadu: ', 'budidaya', ', edukasi, dan nilai tambah berkelanjutan', 'Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.', 'Lihat Produk Kami', 'produk', 'Hubungi Kami', 'kontak', 'Jagasura Farm', 'MJ Farm'),
('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1920&q=80', 2, 'PT Jagasura Agrotama Indonesia · Hortikultura dan peternakan terintegrasi', 'Operasi agro terpadu: ', 'budidaya', ', edukasi, dan nilai tambah berkelanjutan', 'Greenhouse dan hortikultura, MJ Farm, serta diklat dan magang—dijalankan secara teknis dan terukur.', 'Lihat Produk Kami', 'produk', 'Hubungi Kami', 'kontak', 'Jagasura Farm', 'MJ Farm');

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(128) NOT NULL DEFAULT '',
  description TEXT,
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  price INT NOT NULL DEFAULT 0,
  price_note VARCHAR(128) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_products_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE product_variants (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  label VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_pv_product (product_id),
  CONSTRAINT fk_pv_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (title, category, description, image_url, price, price_note, sort_order) VALUES
('Melon Premium', 'Buah', 'Dibudidayakan dalam greenhouse berteknologi tinggi dengan kualitas premium.', 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=1200&q=80', 85000, 'per kg', 1),
('Buah Tropis', 'Buah', 'Komoditas buah tropis bernilai tinggi dari perkebunan terpadu.', 'https://images.unsplash.com/photo-1619566636858-adfe3c16a13b?w=1200&q=80', 45000, 'per kg', 2),
('Hortikultura', 'Sayuran', 'Sayuran dan komoditas hortikultura dengan nilai ekonomi tinggi.', 'https://images.unsplash.com/photo-1592419047123-071b8e0f7e4d?w=1200&q=80', 25000, 'per kg', 3),
('Usaha Ternak & RPH', 'Peternakan', 'Peternakan kambing dan rumah pemotongan hewan berstandar nasional dengan cold storage terintegrasi.', 'https://images.unsplash.com/photo-1500597377353-f2f23f0d8c1e?w=1200&q=80', 120000, 'estimasi per paket', 4);

INSERT INTO product_variants (product_id, label, sort_order) VALUES
(1, 'Fujisawa (Jepang)', 0), (1, 'Inthanon (Belanda)', 1), (1, 'Sweet Net (Thailand)', 2), (1, 'Chamoe (Korea)', 3), (1, 'Rangipo', 4),
(2, 'Alpukat', 0), (2, 'Durian', 1), (2, 'Jambu Air', 2), (2, 'Jeruk Lemon', 3), (2, 'Mangga', 4), (2, 'Markisa', 5), (2, 'Pepaya', 6),
(3, 'Cabai', 0), (3, 'Kembang Kol', 1), (3, 'Kentang', 2), (3, 'Lettuce', 3), (3, 'Tomat', 4), (3, 'Terong', 5), (3, 'Timun', 6);

CREATE TABLE articles (
  id INT NOT NULL AUTO_INCREMENT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(512) NOT NULL,
  excerpt TEXT,
  category VARCHAR(128) NOT NULL DEFAULT '',
  date_display VARCHAR(64) NOT NULL DEFAULT '',
  image_url VARCHAR(1024) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_articles_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE article_paragraphs (
  id INT NOT NULL AUTO_INCREMENT,
  article_id INT NOT NULL,
  body TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_ap_article (article_id),
  CONSTRAINT fk_ap_article FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE article_extra_images (
  id INT NOT NULL AUTO_INCREMENT,
  article_id INT NOT NULL,
  image_url VARCHAR(1024) NOT NULL,
  caption VARCHAR(512) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_ae_article (article_id),
  CONSTRAINT fk_ae_article FOREIGN KEY (article_id) REFERENCES articles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO articles (slug, title, excerpt, category, date_display, image_url) VALUES (
  'regenerasi-petani-muda-tantangan-dan-peluang',
  'Regenerasi Petani Muda: Tantangan dan Peluang di Era Modern',
  'Indonesia membutuhkan generasi baru petani yang tidak hanya memahami cara bercocok tanam, tetapi juga menguasai teknologi dan bisnis.',
  'Agro-Education',
  '15 Mar 2026',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80'
);

INSERT INTO article_paragraphs (article_id, body, sort_order) VALUES
(1, 'Regenerasi petani muda menjadi salah satu agenda strategis ketahanan pangan nasional. Di tengah penuaan demografi pelaku pertanian, masuknya generasi muda ke sektor ini menentukan apakah Indonesia mampu menjaga produktivitas sekaligus daya saing di pasar global.', 0),
(1, 'Tantangan utamanya tidak lagi sekadar keterampilan budidaya lapangan. Petani masa kini dihadapkan pada data, rantai pasok, standar mutu, serta tuntutan keberlanjutan lingkungan.', 1),
(1, 'Jagasura Agrotama berkomitmen mendukung regenerasi ini melalui program edukasi lapangan, fasilitasi magang, dan demonstrasi teknologi tepat guna.', 2);

INSERT INTO article_extra_images (article_id, image_url, caption, sort_order) VALUES
(1, 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80', 'Kegiatan lapangan bersama peserta magang di area budidaya.', 0),
(1, 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80', 'Ruang pelatihan dan demonstrasi teknik budidaya terkini.', 1);

INSERT INTO articles (slug, title, excerpt, category, date_display, image_url) VALUES (
  'melon-premium-jagasura-farm-tembus-pasar-nasional',
  'Melon Premium Jagasura Farm Tembus Pasar Nasional',
  'Dengan budidaya greenhouse berteknologi tinggi, melon varietas unggul berhasil memasuki pasar premium.',
  'Product Update',
  '8 Mar 2026',
  'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=1200&q=80'
);

INSERT INTO article_paragraphs (article_id, body, sort_order) VALUES
(2, 'Produksi melon premium di lingkungan greenhouse memungkinkan pengendalian iklim mikro, irigasi presisi, dan jadwal panen yang lebih konsisten.', 0),
(2, 'Ekspansi ke pasar nasional membutuhkan integritas rantai dingin dan dokumentasi traceability sederhana.', 1);

CREATE TABLE gallery_items (
  id INT NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(1024) NOT NULL,
  alt_text VARCHAR(512) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_tall TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO gallery_items (image_url, alt_text, sort_order, is_tall) VALUES
('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=1200&q=80', 'Greenhouse aerial view', 0, 1),
('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80', 'Hands planting seedlings', 1, 0),
('https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=1200&q=80', 'Premium melon cultivation', 2, 0),
('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=1200&q=80', 'Young farmers in training', 3, 0),
('https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80', 'Greenhouse interior', 4, 1),
('https://images.unsplash.com/photo-1500597377353-f2f23f0d8c1e?w=1200&q=80', 'Livestock grazing', 5, 0);
