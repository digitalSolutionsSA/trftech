-- ================================================================
-- TRF Tech Products Database Migration
-- Paste this into: Supabase Dashboard > SQL Editor > Run
-- ================================================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id          UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT    NOT NULL,
  slug        TEXT    UNIQUE NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id               UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
  name             TEXT           NOT NULL,
  slug             TEXT           UNIQUE NOT NULL,
  description      TEXT,
  price            NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2)  CHECK (compare_at_price >= 0),
  category_id      UUID           REFERENCES categories(id) ON DELETE SET NULL,
  icon             TEXT           DEFAULT '📦',
  image_url        TEXT,
  gradient         TEXT           DEFAULT 'linear-gradient(135deg,rgba(0,212,255,0.14),rgba(0,100,200,0.14))',
  rating           NUMERIC(3,2)   DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count     INTEGER        DEFAULT 0 CHECK (review_count >= 0),
  badge            TEXT,
  badge_class      TEXT,
  stock            INTEGER        DEFAULT 0 CHECK (stock >= 0),
  is_active        BOOLEAN        DEFAULT true,
  is_featured      BOOLEAN        DEFAULT false,
  tags             TEXT[]         DEFAULT '{}',
  created_at       TIMESTAMPTZ    DEFAULT now(),
  updated_at       TIMESTAMPTZ    DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;

-- Anyone can read active categories and products
CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active products"
  ON products FOR SELECT USING (is_active = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Auth manage categories"
  ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Auth manage products"
  ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ── Storage bucket for product images ────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

CREATE POLICY "Auth upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Auth update product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Auth delete product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

-- ── Seed categories ───────────────────────────────────────────────
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Gate Motors',       'gate-motors',     1),
  ('Cameras',           'cameras',         2),
  ('Electric Fencing',  'electric-fencing',3),
  ('Alarm Systems',     'alarm-systems',   4),
  ('Networking',        'networking',      5),
  ('Construction',      'construction',    6)
ON CONFLICT (slug) DO NOTHING;
