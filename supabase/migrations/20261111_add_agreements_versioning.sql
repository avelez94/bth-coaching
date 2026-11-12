-- ============================================================
-- BTH Coaching: Agreement versioning support
-- Applied: 2026-11-11
-- ============================================================

-- Table: agreements
-- Stores each version of the Coaching Services Agreement.
-- John can upload a new version from the admin dashboard.
-- Only one version is "active" at a time for new enrollments.
-- Existing signed agreements always reference the version they accepted.
CREATE TABLE IF NOT EXISTS public.agreements (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      timestamptz NOT NULL DEFAULT now(),
  version         text NOT NULL,              -- e.g. "1.0", "1.1"
  effective_date  text NOT NULL,              -- human-readable date string
  title           text NOT NULL DEFAULT 'Coaching Services Agreement',
  content         text NOT NULL,              -- full verbatim agreement text
  content_hash    text NOT NULL,              -- SHA-256 of content for audit
  is_active       boolean NOT NULL DEFAULT false,  -- only one row should be true
  notes           text,                       -- optional admin notes about this version
  UNIQUE (version)
);

-- RLS: enabled, no public access
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Update: enrollments table now links to agreements table
-- ============================================================

-- Add agreement_id column to enrollments (nullable — existing rows won't have it)
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS agreement_id uuid REFERENCES public.agreements(id) ON DELETE SET NULL;

-- Add agreement_content_snapshot column so each enrollment stores
-- the full text at the moment of signing (immutable record)
ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS agreement_content_snapshot text;

-- ============================================================
-- Seed: insert the initial v1.0 agreement from lib/agreement.ts
-- This is a placeholder row — the actual content is managed via
-- the admin dashboard and seeded by the app on first run if the
-- table is empty.
-- ============================================================
-- NOTE: Do not insert here — the app will seed from AGREEMENT_TEXT
-- in lib/agreement.ts via the admin API on first use.
