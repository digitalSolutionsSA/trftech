-- ================================================================
-- Add the "AJAX" category and move existing Ajax products into it
-- Paste this into: Supabase Dashboard > SQL Editor > Run
-- ================================================================

-- Sorts first in the admin category dropdown (the others start at 1)
INSERT INTO categories (name, slug, sort_order) VALUES
  ('AJAX', 'ajax', 0)
ON CONFLICT (slug) DO NOTHING;

-- Products named or tagged "Ajax" (whole word) move to the new category.
-- Review first with:  SELECT name, tags FROM products WHERE name ~* '\majax\M' OR tags::text ~* '\majax\M';
UPDATE products
SET category_id = (SELECT id FROM categories WHERE slug = 'ajax')
WHERE name ~* '\majax\M' OR tags::text ~* '\majax\M';
