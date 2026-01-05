-- Temporary: Disable RLS on analytics for debugging
-- This allows any authenticated user to read analytics

-- Drop all existing policies
DROP POLICY IF EXISTS "Admin can view analytics" ON public.analytics;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON public.analytics;

-- Temporarily disable RLS to test if this is the issue
ALTER TABLE public.analytics DISABLE ROW LEVEL SECURITY;

-- Grant read access to authenticated users
GRANT SELECT ON public.analytics TO authenticated;
GRANT SELECT ON public.analytics TO anon;

