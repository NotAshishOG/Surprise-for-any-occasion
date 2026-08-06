-- ==========================================
-- 1. Create the `leads` table
-- ==========================================
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    card_id UUID REFERENCES public.cards(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Allow inserting leads (assuming you don't require auth)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts on leads"
ON public.leads FOR INSERT
TO anon
WITH CHECK (true);

-- ==========================================
-- 2. Automatic Image Cleanup System
-- ==========================================
-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the cleanup job to run every hour
-- It deletes cards older than 24 hours from the database
-- Note: '0 * * * *' means "Run at minute 0 past every hour"
SELECT cron.schedule(
    'cleanup-old-card-media',
    '0 * * * *',
    $$
        -- Step A: Set the URLs in the cards table to NULL to avoid broken image icons
        UPDATE public.cards
        SET 
            "photo1Url" = NULL,
            "photo2Url" = NULL,
            "audioFileUrl" = NULL,
            "extraPhotoUrls" = NULL,
            "balloonPhotoUrls" = NULL
        WHERE "createdAt"::timestamptz < NOW() - INTERVAL '24 hours';

        -- Step B: Physically delete the files from the storage bucket
        DELETE FROM storage.objects 
        WHERE bucket_id = 'uploads' 
        AND created_at < NOW() - INTERVAL '24 hours';
    $$
);

-- Note: If you ever need to stop this job, you can run:
-- SELECT cron.unschedule('cleanup-old-card-media');
