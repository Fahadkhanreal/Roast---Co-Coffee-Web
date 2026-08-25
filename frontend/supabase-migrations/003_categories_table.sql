-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon VARCHAR(50),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ordering and active status
CREATE INDEX idx_categories_display_order ON categories(display_order);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Insert default categories from existing products
INSERT INTO categories (name, slug, display_order, is_active) VALUES
  ('Coffee', 'coffee', 1, true),
  ('Latte', 'latte', 2, true),
  ('Mocktails', 'mocktails', 3, true)
ON CONFLICT (name) DO NOTHING;

-- Add comment
COMMENT ON TABLE categories IS 'Product categories with custom ordering for display';
