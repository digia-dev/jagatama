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
