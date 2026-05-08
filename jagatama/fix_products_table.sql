-- Fix products table schema step by step
-- 1. Add columns without index first
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255) NOT NULL DEFAULT '' AFTER id;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_on_request TINYINT(1) NOT NULL DEFAULT 0 AFTER price_note;

-- 2. Update existing slugs with unique values based on ID
UPDATE products SET slug = CONCAT('product-', id) WHERE slug = '';

-- 3. Now add the unique index
ALTER TABLE products ADD UNIQUE INDEX IF NOT EXISTS idx_products_slug (slug);
