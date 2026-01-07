-- Create transactions table for barbershop payments
CREATE TABLE public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    barber_id TEXT NOT NULL,
    barber_name TEXT NOT NULL,
    service_id TEXT NOT NULL,
    service_name TEXT NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    extras JSONB DEFAULT '[]'::jsonb,
    extras_total DECIMAL(10,2) DEFAULT 0,
    discount_id TEXT,
    discount_name TEXT,
    discount_percentage INTEGER DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    subtotal DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (no auth required for this POS system)
CREATE POLICY "Allow public insert" 
ON public.transactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select" 
ON public.transactions 
FOR SELECT 
USING (true);

-- Enable realtime for transactions
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;