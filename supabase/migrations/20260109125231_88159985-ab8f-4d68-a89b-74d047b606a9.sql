-- Create service_lines table
CREATE TABLE public.service_lines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  line_id UUID REFERENCES public.service_lines(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.service_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- RLS policies for service_lines (public access for this internal POS system)
CREATE POLICY "Allow public read service_lines" ON public.service_lines
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert service_lines" ON public.service_lines
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update service_lines" ON public.service_lines
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete service_lines" ON public.service_lines
  FOR DELETE USING (true);

-- RLS policies for services
CREATE POLICY "Allow public read services" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert services" ON public.services
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update services" ON public.services
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete services" ON public.services
  FOR DELETE USING (true);