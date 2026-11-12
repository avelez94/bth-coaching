-- Add test_mode flag to enrollments table.
-- Records created during enrollment test mode (ENROLLMENT_TEST_MODE=true)
-- are marked with test_mode = true so they can be filtered in the admin dashboard.
-- Also add 'test' as a valid status value.
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS test_mode boolean NOT NULL DEFAULT false;

-- Update the status CHECK constraint to allow 'test' status for test records.
ALTER TABLE public.enrollments
  DROP CONSTRAINT IF EXISTS enrollments_status_check;

ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_status_check
  CHECK (status IN ('pending_payment', 'paid', 'abandoned', 'test'));
