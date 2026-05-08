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
