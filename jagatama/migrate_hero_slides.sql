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
