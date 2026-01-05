-- Migration: Populate analytics from existing data
-- Created: 2026-01-05

-- Function to populate analytics for all existing dates
CREATE OR REPLACE FUNCTION public.populate_historical_analytics()
RETURNS void AS $$
BEGIN
  -- Insert analytics for each day that has TTS requests
  INSERT INTO public.analytics (
    date,
    total_requests,
    total_characters,
    unique_users,
    popular_voice,
    avg_text_length
  )
  SELECT
    DATE(created_at) as date,
    COUNT(*) as total_requests,
    COALESCE(SUM(character_count), 0) as total_characters,
    COUNT(DISTINCT user_id) as unique_users,
    MODE() WITHIN GROUP (ORDER BY voice) as popular_voice,
    COALESCE(AVG(character_count), 0) as avg_text_length
  FROM public.tts_requests
  GROUP BY DATE(created_at)
  ON CONFLICT (date) 
  DO UPDATE SET
    total_requests = EXCLUDED.total_requests,
    total_characters = EXCLUDED.total_characters,
    unique_users = EXCLUDED.unique_users,
    popular_voice = EXCLUDED.popular_voice,
    avg_text_length = EXCLUDED.avg_text_length;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Run the function to populate analytics from existing data
SELECT public.populate_historical_analytics();

