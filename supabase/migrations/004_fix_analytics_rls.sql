-- Fix analytics RLS policy for authenticated users
-- Created: 2026-01-05

-- Drop old restrictive policy
DROP POLICY IF EXISTS "Admin can view analytics" ON public.analytics;

-- Create new policy allowing all authenticated users to view analytics
CREATE POLICY "Authenticated users can view analytics"
  ON public.analytics FOR SELECT
  USING (auth.role() = 'authenticated');

-- Ensure analytics_dashboard view exists and is accessible
DROP VIEW IF EXISTS public.analytics_dashboard;

CREATE OR REPLACE VIEW public.analytics_dashboard AS
SELECT 
  date,
  total_requests,
  total_characters,
  unique_users,
  popular_voice,
  ROUND(avg_text_length, 2) as avg_text_length
FROM public.analytics
ORDER BY date DESC
LIMIT 30;

