-- Add promo bar settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
('promo_bar', '{
  "messages": [
    "RATED 4.9 BY 2,000+ COFFEE LOVERS ✦",
    "FLAT 20% OFF ON YOUR FIRST ORDER",
    "ORDER NOW"
  ]
}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
