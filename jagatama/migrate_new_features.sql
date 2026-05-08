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
