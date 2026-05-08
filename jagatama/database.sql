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

INSERT INTO site_settings (logo_url, brand_name, tagline) VALUES ('/logotp.png', 'Jagasura Agrotama', 'Sustainable Agriculture');

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
