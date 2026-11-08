-- ============================================================
-- BTH Coaching: Enrollment table + storage bucket
-- Apply via Supabase SQL editor or `supabase db push`
-- ============================================================

CREATE TABLE IF NOT EXISTS public.enrollments (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  program           text NOT NULL CHECK (program IN ('executive-coaching', '8-pillars')),
  payment_option    text NOT NULL CHECK (payment_option IN ('full', 'installment')),
  first_name        text NOT NULL,
  last_name         text NOT NULL,
  email             text NOT NULL,
  phone             text,
  organization      text,
  role              text,
  signature_data    text NOT NULL,
  signature_type    text NOT NULL CHECK (signature_type IN ('drawn', 'typed')),
  signed_at         timestamptz NOT NULL,
  agreement_version text NOT NULL,
  agreement_hash    text NOT NULL,
  pdf_path          text,
  status            text NOT NULL DEFAULT 'pending_payment'
                      CHECK (status IN ('pending_payment', 'paid', 'abandoned'))
);

-- RLS: enabled, no public access — all writes go through service role key in API route
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- No policies intentionally. Only the service role (server-side API) can read/write.
-- If you want the admin dashboard to read enrollments using the anon key,
-- add a policy gated on a custom JWT claim or admin password check.

-- ============================================================
-- Storage bucket for signed agreement PDFs
-- Run this in Supabase Dashboard > Storage, or via the CLI:
--   supabase storage create signed-agreements --no-public
-- Then add a bucket policy allowing only the service role to read.
-- ============================================================
-- NOTE: Storage buckets cannot be created via SQL migration.
-- Create the bucket manually in the Supabase Dashboard:
--   1. Go to Storage > New bucket
--   2. Name: signed-agreements
--   3. Public: OFF
--   4. No additional policies needed (service role bypasses RLS)
