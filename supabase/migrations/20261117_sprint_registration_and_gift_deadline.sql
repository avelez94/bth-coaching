-- ============================================================
-- BTH Coaching: 8 Pillar Sprint self registration and the gift
-- redemption deadline. Additive only.
-- ============================================================

-- 1. Gift redemption deadline, editable in Admin > Pricing (Sprint card).
--    John: gift recipients may register on or before January 10, 2027,
--    enforced as 11:59 PM Eastern that day.
ALTER TABLE public.program_pricing ADD COLUMN IF NOT EXISTS gift_redeem_by timestamptz;
UPDATE public.program_pricing
   SET gift_redeem_by = '2027-01-10T23:59:59-05:00'
 WHERE program_key = 'sprint' AND gift_redeem_by IS NULL;

-- 2. Someone joining the Sprint themselves registers before paying.
--    The row is Awaiting payment until the verified Stripe webhook
--    confirms the payment for this registration.
CREATE TABLE IF NOT EXISTS public.sprint_registrations (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  name               text NOT NULL CHECK (length(name) BETWEEN 2 AND 120),
  email              text NOT NULL CHECK (length(email) BETWEEN 3 AND 254),
  phone              text CHECK (phone IS NULL OR length(phone) <= 40),
  status             text NOT NULL DEFAULT 'pending_payment'
                     CHECK (status IN ('pending_payment', 'paid', 'payment_failed')),
  -- Sprint participant terms, once John approves them (version and time accepted)
  terms_version      text,
  terms_accepted_at  timestamptz,
  stripe_session_id  text UNIQUE,
  stripe_payment_id  uuid REFERENCES public.stripe_payments(id) ON DELETE SET NULL,
  amount_paid_cents  integer,
  paid_at            timestamptz,
  livemode           boolean,
  CONSTRAINT sprint_registrations_paid_complete CHECK (status <> 'paid' OR paid_at IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS sprint_registrations_created_idx ON public.sprint_registrations (created_at DESC);
-- Server only (service role). No policies: the public API key cannot read or write it.
ALTER TABLE public.sprint_registrations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.sprint_registrations FROM anon, authenticated;
