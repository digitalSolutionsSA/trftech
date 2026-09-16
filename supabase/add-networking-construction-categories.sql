-- ================================================================
-- Add "Networking" and "Construction" categories
-- Paste this into: Supabase Dashboard > SQL Editor > Run
-- ================================================================

INSERT INTO categories (name, slug, sort_order) VALUES
  ('Networking',   'networking',   5),
  ('Construction', 'construction', 6)
ON CONFLICT (slug) DO NOTHING;
