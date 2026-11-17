-- ============================================================
-- BTH Coaching: fixed length installment plans.
-- Additive only: new nullable columns on enrollments that record
-- whether the monthly plan was set in Stripe to stop on its own
-- after the last payment. Nothing existing is changed.
-- ============================================================

ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS stripe_schedule_id text;

-- 'scheduled': Stripe will stop billing after the last payment
-- 'failed':    could not be set yet; Stripe retries the webhook and the
--              admin shows the plan as needing attention
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS installment_plan_status text
  CHECK (installment_plan_status IS NULL OR installment_plan_status IN ('scheduled', 'failed'));
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS installment_plan_payments integer;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS installment_plan_ends_at timestamptz;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS installment_plan_error text;
ALTER TABLE public.enrollments ADD COLUMN IF NOT EXISTS installment_plan_checked_at timestamptz;
