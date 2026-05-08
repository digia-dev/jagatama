SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS article_extra_images;
DROP TABLE IF EXISTS article_paragraphs;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS product_variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS gallery_items;
DROP TABLE IF EXISTS hero_slides;
DROP TABLE IF EXISTS site_settings;
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
INSERT INTO admins (username, password_hash) VALUES ('jagatama', '$2y$10$gTpETiJD3UcxkhcMShT9Ae56bbYaoURrvy8WQk9ZClESMhGYE3h/S');

CREATE TABLE site_settings (
  id INT NOT NULL AUTO_INCREMENT,
  logo_url TEXT,
  brand_name VARCHAR(255) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Add address and maps_url to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS address TEXT AFTER tagline;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS maps_url TEXT AFTER address;

-- Update existing settings with default values
UPDATE site_settings SET 
  address = 'Dukuhwaru, Tegal, Jawa Tengah', 
  maps_url = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.43235338167!2d109.0838186173828!3d-6.9075746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6fb9b9a67448d3%3A0x7d6f556b6b778c1!2sDukuhwaru%2C%20Kec.%20Dukuhwaru%2C%20Kabupaten%20Tegal%2C%20Jawa%20Tengah!5e0!3m2!1sid!2sid!4v1715050000000!5m2!1sid!2sid'
WHERE id = 1;
-- Fix products table schema step by step
-- 1. Add columns without index first
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NOT NULL DEFAULT '' AFTER id;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_on_request TINYINT(1) NOT NULL DEFAULT 0 AFTER price_note;

-- 2. Update existing slugs with unique values based on ID
UPDATE products SET slug = CONCAT('product-', id) WHERE slug = '';

-- 3. Now add the unique index
ALTER TABLE products ADD UNIQUE INDEX IF NOT EXISTS idx_products_slug (slug);
-- Transform Gallery into a File Manager (Drive-like)
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS parent_id INT DEFAULT NULL;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS is_folder TINYINT(1) DEFAULT 0;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS file_type VARCHAR(50) DEFAULT 'image'; -- 'image', 'document', 'folder'
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS file_size INT DEFAULT 0;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS mime_type VARCHAR(100) DEFAULT NULL;

-- Index for folder structure
CREATE INDEX idx_gallery_parent ON gallery_items(parent_id);

-- Update existing items to be images
UPDATE gallery_items SET file_type = 'image' WHERE file_type IS NULL OR file_type = '';
SET NAMES utf8mb4;

ALTER TABLE hero_slides
  ADD COLUMN eyebrow VARCHAR(512) NOT NULL DEFAULT '' AFTER sort_order,
  ADD COLUMN headline_part1 VARCHAR(512) NOT NULL DEFAULT '' AFTER eyebrow,
  ADD COLUMN headline_highlight VARCHAR(256) NOT NULL DEFAULT '' AFTER headline_part1,
  ADD COLUMN headline_part2 VARCHAR(512) NOT NULL DEFAULT '' AFTER headline_highlight,
  ADD COLUMN description_text TEXT NULL AFTER headline_part2,
  ADD COLUMN primary_cta_label VARCHAR(128) NOT NULL DEFAULT '' AFTER description_text,
  ADD COLUMN primary_cta_hash VARCHAR(128) NOT NULL DEFAULT '' AFTER primary_cta_label,
  ADD COLUMN secondary_cta_label VARCHAR(128) NOT NULL DEFAULT '' AFTER primary_cta_hash,
  ADD COLUMN secondary_cta_hash VARCHAR(128) NOT NULL DEFAULT '' AFTER secondary_cta_label,
  ADD COLUMN footer_left VARCHAR(128) NOT NULL DEFAULT '' AFTER secondary_cta_hash,
  ADD COLUMN footer_right VARCHAR(128) NOT NULL DEFAULT '' AFTER footer_left,
  ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

UPDATE hero_slides s
INNER JOIN hero_content h ON h.id = 1
SET
  s.eyebrow = h.eyebrow,
  s.headline_part1 = h.headline_part1,
  s.headline_highlight = h.headline_highlight,
  s.headline_part2 = h.headline_part2,
  s.description_text = h.description_text,
  s.primary_cta_label = h.primary_cta_label,
  s.primary_cta_hash = h.primary_cta_hash,
  s.secondary_cta_label = h.secondary_cta_label,
  s.secondary_cta_hash = h.secondary_cta_hash,
  s.footer_left = h.footer_left,
  s.footer_right = h.footer_right;

DROP TABLE IF EXISTS hero_content;
SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS hero_slides (
  id INT NOT NULL AUTO_INCREMENT,
  image_url VARCHAR(1024) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_hero_slides_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO hero_slides (image_url, sort_order)
SELECT hc.image_url, 0
FROM hero_content hc
WHERE hc.id = 1 AND TRIM(COALESCE(hc.image_url, '')) <> ''
  AND NOT EXISTS (SELECT 1 FROM hero_slides LIMIT 1);

ALTER TABLE hero_content DROP COLUMN IF EXISTS image_url;
-- =====================================================
-- MIGRATION: New Features for Jagasura CMS
-- Run this script ONCE on your production database
-- =====================================================

-- 1. Add price column to product_variants
ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS price INT NOT NULL DEFAULT 0 AFTER label;

-- 2. Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  avatar_url VARCHAR(1024) NOT NULL DEFAULT '',
  rating INT NOT NULL DEFAULT 5,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed testimonials
INSERT IGNORE INTO testimonials (name, role, content, rating, sort_order, is_active) VALUES
('Budi Santoso', 'Petani Mitra, Tegal', 'Bergabung dengan program kemitraan Jagasura membuka wawasan saya tentang pertanian modern. Hasil panen meningkat signifikan setelah menggunakan teknik yang diajarkan.', 5, 1, 1),
('Siti Rahayu', 'Peserta Diklat', 'Program magang di Jagasura sangat intensif dan aplikatif. Saya mendapat pengalaman langsung mengelola greenhouse skala komersial.', 5, 2, 1),
('Ahmad Fauzi', 'Distributor Mitra', 'Kualitas melon premium konsisten dan rantai pasok terjaga baik. Pelanggan selalu puas dengan produk dari Jagasura Farm.', 5, 3, 1);

-- 3. Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL DEFAULT '',
  department VARCHAR(255) NOT NULL DEFAULT '',
  bio TEXT,
  avatar_url VARCHAR(1024) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_team_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed team members
INSERT IGNORE INTO team_members (name, position, department, bio, sort_order, is_active) VALUES
('Direktur Utama', 'Direktur Utama', 'Manajemen', 'Memimpin visi dan strategi PT Jagasura Agrotama Indonesia menuju pertanian terpadu berkelanjutan.', 1, 1),
('Manajer Produksi', 'Manajer Produksi', 'Produksi', 'Bertanggung jawab atas operasional greenhouse dan budidaya hortikultura premium.', 2, 1),
('Manajer Kemitraan', 'Manajer Kemitraan', 'Bisnis', 'Mengelola jaringan mitra petani dan program pemberdayaan agropreneurship.', 3, 1),
('Kepala Riset', 'Kepala Riset & Inovasi', 'Riset', 'Mengembangkan teknologi pertanian presisi dan varietasi tanaman unggul.', 4, 1);

-- 4. Create whatsapp_contacts table
CREATE TABLE IF NOT EXISTS whatsapp_contacts (
  id INT NOT NULL AUTO_INCREMENT,
  label VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(255) NOT NULL DEFAULT '',
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed whatsapp contacts
INSERT IGNORE INTO whatsapp_contacts (label, phone, department, is_primary, is_active, sort_order) VALUES
('CS Utama', '6285743855637', 'Customer Service', 1, 1, 1),
('Tim Produksi', '6285743855637', 'Produksi', 0, 1, 2),
('Kemitraan', '6285743855637', 'Bisnis', 0, 1, 3);

-- =====================================================
-- NOTE: To run this on existing DB:
-- mysql -u root -p your_database_name < migrate_new_features.sql
-- =====================================================
ALTER TABLE products
  ADD COLUMN category VARCHAR(128) NOT NULL DEFAULT '' AFTER title;
-- Add tags to gallery_items for media library functionality
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS tags VARCHAR(255) DEFAULT '' AFTER is_tall;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT '' AFTER tags;

-- Index for searching tags
CREATE INDEX idx_gallery_tags ON gallery_items(tags);
