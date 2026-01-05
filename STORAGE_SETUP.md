# Supabase Storage Setup for HebVoice

## 1. Create Storage Bucket

In Supabase Dashboard:

1. Go to **Storage** → **Buckets**
2. Click **New Bucket**
3. Name: `audio-files`
4. **Public bucket**: ✅ Enable (for easy access)
5. Click **Create Bucket**

## 2. Set Bucket Policies (Optional - for more control)

If you want more control, you can set custom policies:

```sql
-- Allow authenticated users to upload their own files
CREATE POLICY "Users can upload own audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow anyone to read audio files (public bucket)
CREATE POLICY "Anyone can download audio"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-files');

-- Allow users to delete own files
CREATE POLICY "Users can delete own audio"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

## 3. Configure CORS (if needed)

If you have CORS issues:

```sql
-- In Supabase SQL Editor
UPDATE storage.buckets
SET public = true,
    file_size_limit = 52428800, -- 50MB limit
    allowed_mime_types = ARRAY['audio/mp3', 'audio/mpeg']
WHERE name = 'audio-files';
```

## Storage Limits

**Supabase Free Tier:**
- 1 GB Storage
- Unlimited bandwidth (with fair use)
- ~3,300 audio files (20 sec each ≈ 300 KB)

**Paid Tier (Pro - $25/month):**
- 100 GB Storage
- ~330,000 audio files

## File Structure

Files are organized by user:
```
audio-files/
  ├── user-id-1/
  │   ├── 1234567890.mp3
  │   └── 1234567891.mp3
  └── user-id-2/
      └── 1234567892.mp3
```

This makes it easy to:
- Track usage per user
- Delete all files when user deletes account
- Implement quotas per user

