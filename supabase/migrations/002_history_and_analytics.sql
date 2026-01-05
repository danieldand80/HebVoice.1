-- Migration: Add 7-day history cleanup and analytics
-- Created: 2026-01-05

-- Add column to store audio data as base64 (for 7-day history)
ALTER TABLE public.tts_requests 
ADD COLUMN IF NOT EXISTS audio_data TEXT;

-- Function to clean up old records (older than 7 days)
CREATE OR REPLACE FUNCTION public.cleanup_old_tts_requests()
RETURNS void AS $$
BEGIN
  DELETE FROM public.tts_requests 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Analytics table for global stats (admin only)
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_requests INTEGER DEFAULT 0,
  total_characters INTEGER DEFAULT 0,
  unique_users INTEGER DEFAULT 0,
  popular_voice TEXT,
  avg_text_length DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Index for analytics
CREATE INDEX IF NOT EXISTS idx_analytics_date ON public.analytics(date DESC);

-- Function to update daily analytics
CREATE OR REPLACE FUNCTION public.update_daily_analytics()
RETURNS void AS $$
BEGIN
  INSERT INTO public.analytics (
    date,
    total_requests,
    total_characters,
    unique_users,
    popular_voice,
    avg_text_length
  )
  SELECT
    CURRENT_DATE,
    COUNT(*) as total_requests,
    COALESCE(SUM(character_count), 0) as total_characters,
    COUNT(DISTINCT user_id) as unique_users,
    MODE() WITHIN GROUP (ORDER BY voice) as popular_voice,
    COALESCE(AVG(character_count), 0) as avg_text_length
  FROM public.tts_requests
  WHERE DATE(created_at) = CURRENT_DATE
  ON CONFLICT (date) 
  DO UPDATE SET
    total_requests = EXCLUDED.total_requests,
    total_characters = EXCLUDED.total_characters,
    unique_users = EXCLUDED.unique_users,
    popular_voice = EXCLUDED.popular_voice,
    avg_text_length = EXCLUDED.avg_text_length;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update analytics after each TTS request
CREATE OR REPLACE FUNCTION public.trigger_update_analytics()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.update_daily_analytics();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_tts_request_insert
  AFTER INSERT ON public.tts_requests
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_update_analytics();

-- RLS for analytics (only accessible by specific admin users)
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Admin view policy (you can add specific admin user IDs later)
CREATE POLICY "Admin can view analytics"
  ON public.analytics FOR SELECT
  USING (true); -- For now allow all authenticated users, you can restrict later

-- Create a view for easy analytics access
CREATE OR REPLACE VIEW public.analytics_dashboard AS
SELECT 
  a.date,
  a.total_requests,
  a.total_characters,
  a.unique_users,
  a.popular_voice,
  ROUND(a.avg_text_length, 2) as avg_text_length
FROM public.analytics a
ORDER BY a.date DESC
LIMIT 30;

