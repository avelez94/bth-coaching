-- ============================================================
-- BTH Coaching: 8 Pillar Sprint pricing, Stripe payment
-- confirmation, and an email delivery log.
-- Additive only: nothing existing is dropped or rewritten.
-- ============================================================

-- 1. Pricing: allow the Sprint (one price, a self link and a gift link,
--    no installment plan) alongside the two coaching programs.
ALTER TABLE public.program_pricing DROP CONSTRAINT IF EXISTS program_pricing_program_key_check;
ALTER TABLE public.program_pricing ADD CONSTRAINT program_pricing_program_key_check
  CHECK (program_key IN ('executive-coaching', '8-pillars', 'sprint'));

ALTER TABLE public.program_pricing ALTER COLUMN installment_amount_cents DROP NOT NULL;
ALTER TABLE public.program_pricing ALTER COLUMN installment_count DROP NOT NULL;
ALTER TABLE public.program_pricing ALTER COLUMN stripe_installment_url DROP NOT NULL;

ALTER TABLE public.program_pricing DROP CONSTRAINT IF EXISTS program_pricing_installment_count_check;
ALTER TABLE public.program_pricing ADD CONSTRAINT program_pricing_installment_count_check
  CHECK (installment_count IS NULL OR (installment_count >= 2 AND installment_count <= 36));
ALTER TABLE public.program_pricing DROP CONSTRAINT IF EXISTS program_pricing_installment_amount_cents_check;
ALTER TABLE public.program_pricing ADD CONSTRAINT program_pricing_installment_amount_cents_check
  CHECK (installment_amount_cents IS NULL OR installment_amount_cents > 0);
ALTER TABLE public.program_pricing DROP CONSTRAINT IF EXISTS program_pricing_stripe_installment_url_check;
ALTER TABLE public.program_pricing ADD CONSTRAINT program_pricing_stripe_installment_url_check
  CHECK (stripe_installment_url IS NULL OR stripe_installment_url LIKE 'https://buy.stripe.com/%');

ALTER TABLE public.program_pricing ADD COLUMN IF NOT EXISTS stripe_gift_url text
  CHECK (stripe_gift_url IS NULL OR stripe_gift_url LIKE 'https://buy.stripe.com/%');

-- The coaching programs must keep a complete installment plan
ALTER TABLE public.program_pricing DROP CONSTRAINT IF EXISTS program_pricing_coaching_complete;
ALTER TABLE public.program_pricing ADD CONSTRAINT program_pricing_coaching_complete
  CHECK (program_key = 'sprint' OR (installment_amount_cents IS NOT NULL AND installment_count IS NOT NULL AND stripe_installment_url IS NOT NULL));

-- Sprint launch pricing and John's two Stripe links
INSERT INTO public.program_pricing (program_key, full_price_cents, stripe_full_url, stripe_gift_url, updated_at)
VALUES ('sprint', 45000, 'https://buy.stripe.com/eVq6oH9Pv3f70w784A3sI05', 'https://buy.stripe.com/4gM14n4vbaHz3Ij4So3sI04', now())
ON CONFLICT (program_key) DO NOTHING;

-- 2. Enrollments: payment is confirmed only by a verified Stripe webhook
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS stripe_checkout_session_id text UNIQUE;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS amount_paid_cents integer;

ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_status_check
  CHECK (status IN ('pending_payment', 'paid', 'payment_failed', 'abandoned', 'test'));

-- 3. Every completed Stripe Checkout the webhook receives, including
--    Sprint purchases that have no enrollment record.
CREATE TABLE IF NOT EXISTS public.stripe_payments (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  stripe_session_id    text NOT NULL UNIQUE,
  stripe_event_id      text,
  kind                 text NOT NULL CHECK (kind IN ('enrollment', 'sprint_self', 'sprint_gift', 'other')),
  enrollment_id        uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,
  client_reference_id  text,
  customer_email       text,
  customer_name        text,
  amount_total_cents   integer,
  currency             text,
  payment_status       text NOT NULL,   -- Stripe: paid | unpaid | no_payment_required | failed
  mode                 text,            -- payment | subscription
  livemode             boolean NOT NULL DEFAULT true
);
ALTER TABLE public.stripe_payments ENABLE ROW LEVEL SECURITY;

-- 4. Every email the site tries to send, with the outcome
CREATE TABLE IF NOT EXISTS public.email_log (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  kind           text NOT NULL,       -- enrollment_client, enrollment_admin, resend_copy, payment_received, sprint_purchase, contact_admin, contact_sender
  enrollment_id  uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,
  recipient      text,
  subject        text,
  status         text NOT NULL CHECK (status IN ('sent', 'failed', 'skipped')),
  provider_id    text,                -- Resend message id when sent
  error          text,
  test_mode      boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS email_log_enrollment_idx ON public.email_log (enrollment_id);
CREATE INDEX IF NOT EXISTS email_log_created_idx ON public.email_log (created_at DESC);
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
