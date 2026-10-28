-- ================================================================
-- Enquiries from the website's forms (homepage + Security Services)
-- Applied to the live project on 2026-10-28.
-- ================================================================

-- Who may read enquiries: only listed admin accounts, not every signed-in user,
-- because enquiries hold customers' names, phone numbers and emails.
CREATE TABLE IF NOT EXISTS admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read admin list"
  ON admin_users FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Every account that exists today is an admin (the two admin logins)
INSERT INTO admin_users (user_id) SELECT id FROM auth.users ON CONFLICT DO NOTHING;

-- Runs as the caller: the policy above lets each user see only their own admin row
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
  LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public
  AS $$ SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()) $$;
REVOKE EXECUTE ON FUNCTION is_admin() FROM anon, public;
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS enquiries (
  id            UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at    TIMESTAMPTZ DEFAULT now() NOT NULL,
  source        TEXT        NOT NULL CHECK (source IN ('home', 'security')),
  name          TEXT        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  phone         TEXT        NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  email         TEXT        CHECK (email IS NULL OR char_length(email) <= 200),
  service       TEXT        CHECK (service IS NULL OR char_length(service) <= 120),
  property_type TEXT        CHECK (property_type IS NULL OR char_length(property_type) <= 80),
  message       TEXT        CHECK (message IS NULL OR char_length(message) <= 2000),
  status        TEXT        NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Visitors can send an enquiry but never read any back
CREATE POLICY "Anyone can send an enquiry"
  ON enquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');

CREATE POLICY "Admins read enquiries"
  ON enquiries FOR SELECT TO authenticated USING (is_admin());
CREATE POLICY "Admins update enquiries"
  ON enquiries FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admins delete enquiries"
  ON enquiries FOR DELETE TO authenticated USING (is_admin());

-- ── Email alerts ──────────────────────────────────────────────────
-- Each new enquiry pings the notify-enquiry Edge Function (supabase/functions/notify-enquiry),
-- which emails it via Resend and stamps notified_at so it's only ever sent once.
-- pg_net calls are asynchronous, so a slow or failing email never blocks the form.
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS notified_at TIMESTAMPTZ;

CREATE OR REPLACE FUNCTION notify_enquiry() RETURNS trigger
  LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  PERFORM net.http_post(
    url     := 'https://nzhjztmkogbmbamrwtku.supabase.co/functions/v1/notify-enquiry',
    body    := jsonb_build_object('id', NEW.id),
    headers := '{"Content-Type": "application/json"}'::jsonb
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'notify_enquiry: %', SQLERRM;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION notify_enquiry() FROM anon, authenticated, public;

DROP TRIGGER IF EXISTS enquiries_notify ON enquiries;
CREATE TRIGGER enquiries_notify
  AFTER INSERT ON enquiries
  FOR EACH ROW EXECUTE FUNCTION notify_enquiry();
