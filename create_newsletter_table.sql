-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed'))
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so anyone can subscribe via the website)
CREATE POLICY "Allow anonymous inserts to newsletter" ON public.newsletter_subscribers
FOR INSERT TO anon
WITH CHECK (true);

-- Only authenticated admins can view subscribers
CREATE POLICY "Allow admins to read subscribers" ON public.newsletter_subscribers
FOR SELECT TO authenticated
USING (true);
