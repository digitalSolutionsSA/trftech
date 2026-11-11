-- ============================================================
-- Rename the "Construction" shop category to "TRF Science"
-- and add its four sub-section categories.
-- Run once in the Supabase SQL editor. Safe to run again.
-- ============================================================

-- 1. Rename the existing category (products already in it move along automatically)
UPDATE categories
SET name = 'TRF Science', slug = 'trf-science'
WHERE slug = 'construction';

-- If there was no Construction category, create TRF Science
INSERT INTO categories (name, slug, sort_order) VALUES
  ('TRF Science', 'trf-science', 6)
ON CONFLICT (slug) DO NOTHING;

-- 2. Sub-sections: pick these in the admin product form.
--    The shop's "TRF Science" filter shows products from all of them.
INSERT INTO categories (name, slug, sort_order) VALUES
  ('Lab Supplies',  'lab-supplies',  7),
  ('Lab Equipment', 'lab-equipment', 8),
  ('Chemicals',     'chemicals',     9),
  ('Glassware',     'glassware',     10)
ON CONFLICT (slug) DO NOTHING;
