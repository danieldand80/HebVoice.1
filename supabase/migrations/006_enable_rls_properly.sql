-- Enable RLS properly for all tables
-- Created: 2026-01-05

-- 1. TTS Requests - users can only see their own requests
ALTER TABLE public.tts_requests ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view only their own TTS requests
DROP POLICY IF EXISTS "Users can view own requests" ON public.tts_requests;
CREATE POLICY "Users can view own requests"
  ON public.tts_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert only their own requests
DROP POLICY IF EXISTS "Users can create own requests" ON public.tts_requests;
CREATE POLICY "Users can create own requests"
  ON public.tts_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own requests
DROP POLICY IF EXISTS "Users can delete own requests" ON public.tts_requests;
CREATE POLICY "Users can delete own requests"
  ON public.tts_requests FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Analytics - readable by all authenticated users (aggregated data, no personal info)
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view analytics (it's aggregated, not personal)
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON public.analytics;
CREATE POLICY "Authenticated users can view analytics"
  ON public.analytics FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Service role can insert/update analytics (for triggers)
DROP POLICY IF EXISTS "Service role can manage analytics" ON public.analytics;
CREATE POLICY "Service role can manage analytics"
  ON public.analytics FOR ALL
  USING (auth.role() = 'service_role');

-- 3. Users table - users can only see their own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
CREATE POLICY "Users can view own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
CREATE POLICY "Users can update own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Grant necessary permissions
GRANT SELECT ON public.analytics TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.tts_requests TO authenticated;
GRANT SELECT, UPDATE ON public.users TO authenticated;

