-- ================================================================
-- Add product variants (e.g. one "PVC Trunking" product with
-- 25x16 / 25x25 / ... size options, each with its own price/image/stock)
-- Paste this into: Supabase Dashboard > SQL Editor > Run
-- ================================================================

CREATE TABLE IF NOT EXISTS product_variants (
  id               UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id       UUID           NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label            TEXT           NOT NULL,
  price            NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
  compare_at_price NUMERIC(10,2)  CHECK (compare_at_price >= 0),
  image_url        TEXT,
  stock            INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
  sort_order       INTEGER        NOT NULL DEFAULT 0,
  is_active        BOOLEAN        NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ    DEFAULT now(),
  updated_at       TIMESTAMPTZ    DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);

DROP TRIGGER IF EXISTS product_variants_updated_at ON product_variants;
CREATE TRIGGER product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Row Level Security ────────────────────────────────────────────
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active variants"
  ON product_variants FOR SELECT USING (is_active = true);

CREATE POLICY "Auth manage variants"
  ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
