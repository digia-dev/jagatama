-- Add tags to gallery_items for media library functionality
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS tags VARCHAR(255) DEFAULT '' AFTER is_tall;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS title VARCHAR(255) DEFAULT '' AFTER tags;

-- Index for searching tags
CREATE INDEX idx_gallery_tags ON gallery_items(tags);
