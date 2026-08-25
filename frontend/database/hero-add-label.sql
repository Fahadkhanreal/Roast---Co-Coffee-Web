-- Add label field to hero_images table
ALTER TABLE hero_images ADD COLUMN IF NOT EXISTS label VARCHAR(100);
