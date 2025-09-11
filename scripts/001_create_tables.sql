-- Create checkpoints table
CREATE TABLE IF NOT EXISTS public.checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  location TEXT NOT NULL,
  school TEXT NOT NULL,
  city TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  qr_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scans table
CREATE TABLE IF NOT EXISTS public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  checkpoint_id UUID NOT NULL REFERENCES public.checkpoints(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('جاهز', 'غير جاهز', 'يحتاج صيانة')),
  notes TEXT,
  photo_url TEXT,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checkpoints_token ON public.checkpoints(token);
CREATE INDEX IF NOT EXISTS idx_checkpoints_school ON public.checkpoints(school);
CREATE INDEX IF NOT EXISTS idx_checkpoints_city ON public.checkpoints(city);
CREATE INDEX IF NOT EXISTS idx_scans_checkpoint_id ON public.scans(checkpoint_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON public.scans(scanned_at);

-- Enable Row Level Security
ALTER TABLE public.checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an internal school system)
-- In a production environment, you might want more restrictive policies
CREATE POLICY "Allow public read access to checkpoints" ON public.checkpoints FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to checkpoints" ON public.checkpoints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to checkpoints" ON public.checkpoints FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to checkpoints" ON public.checkpoints FOR DELETE USING (true);

CREATE POLICY "Allow public read access to scans" ON public.scans FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to scans" ON public.scans FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to scans" ON public.scans FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to scans" ON public.scans FOR DELETE USING (true);
