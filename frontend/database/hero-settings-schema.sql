-- Hero Images Table
CREATE TABLE IF NOT EXISTS hero_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  subtitle TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('address', '{
  "name": "Roast & Co.",
  "street": "Shop 12, Seaview Plaza, Block 8,",
  "area": "Clifton, Karachi"
}'::jsonb),
('hours', '{
  "weekdays": "Monday – Friday: 8:00am – 11:00pm",
  "weekends": "Saturday – Sunday: 9:00am – 12:00am"
}'::jsonb),
('contact', '{
  "phone": "+92 21 3500 1122",
  "email": "hello@roastandco.pk",
  "whatsapp": "+92 300 1234567"
}'::jsonb),
('delivery', '{
  "minimum": "1,500",
  "time": "30–45 minutes",
  "areas": "Clifton, DHA and Boat Basin"
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Indexes
CREATE INDEX idx_hero_images_active ON hero_images(is_active, display_order);
CREATE INDEX idx_site_settings_key ON site_settings(setting_key);
