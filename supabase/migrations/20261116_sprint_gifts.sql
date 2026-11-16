-- ============================================================
-- BTH Coaching: 8 Pillar Sprint gift certificates and redemption.
-- Additive only: one new table and new nullable columns on two
-- existing tables. Nothing existing is dropped, renamed or rewritten.
-- ============================================================

-- 1. Stripe payments: what a refund needs to find the payment again
ALTER TABLE public.stripe_payments ADD COLUMN IF NOT EXISTS payment_intent text;
ALTER TABLE public.stripe_payments ADD COLUMN IF NOT EXISTS amount_refunded_cents integer;
ALTER TABLE public.stripe_payments ADD COLUMN IF NOT EXISTS refunded_at timestamptz;
CREATE INDEX IF NOT EXISTS stripe_payments_payment_intent_idx ON public.stripe_payments (payment_intent);

-- 2. One gift per paid gift checkout. Created only by the verified
--    Stripe webhook after Stripe confirms payment.
CREATE TABLE IF NOT EXISTS public.sprint_gifts (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now(),

  -- The payment it came from. UNIQUE: a repeated Stripe event can never
  -- create a second gift for the same checkout.
  stripe_payment_id     uuid NOT NULL UNIQUE REFERENCES public.stripe_payments(id) ON DELETE RESTRICT,
  stripe_session_id     text NOT NULL UNIQUE,

  -- token: 256 random bits, used in the redemption link.
  -- code:  the human-friendly code printed on the certificate.
  token                 text NOT NULL UNIQUE CHECK (length(token) >= 40),
  code                  text NOT NULL UNIQUE CHECK (code ~ '^SPRINT-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$'),

  purchaser_name        text,
  purchaser_email       text,
  amount_cents          integer,
  currency              text,
  livemode              boolean NOT NULL DEFAULT true,

  status                text NOT NULL DEFAULT 'purchased'
                        CHECK (status IN ('purchased', 'redeemed', 'refunded', 'cancelled')),

  -- Set once, when the certificate email is first claimed for sending,
  -- so a repeated Stripe event never sends it twice.
  certificate_claimed_at timestamptz,
  certificate_sent_at   timestamptz,

  -- The recipient's registration (one participant per gift)
  redeemed_at           timestamptz,
  recipient_name        text,
  recipient_email       text,
  recipient_phone       text,
  enrollment_id         uuid REFERENCES public.enrollments(id) ON DELETE SET NULL,

  -- Reserved for a Sprint participant terms step, if John adds one later
  terms_version         text,
  terms_accepted_at     timestamptz,

  refunded_at           timestamptz,
  cancelled_at          timestamptz,
  cancel_note           text,

  CONSTRAINT sprint_gifts_redeemed_complete CHECK (
    redeemed_at IS NULL OR (recipient_name IS NOT NULL AND recipient_email IS NOT NULL)
  ),
  CONSTRAINT sprint_gifts_redeemed_has_date CHECK (status <> 'redeemed' OR redeemed_at IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS sprint_gifts_created_idx ON public.sprint_gifts (created_at DESC);
-- Server only (service role). No policies: the public API key cannot read or write it.
ALTER TABLE public.sprint_gifts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sprint_gifts FROM anon, authenticated;

-- 3. Email log: link gift emails to their gift
ALTER TABLE public.email_log ADD COLUMN IF NOT EXISTS gift_id uuid REFERENCES public.sprint_gifts(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS email_log_gift_idx ON public.email_log (gift_id);
