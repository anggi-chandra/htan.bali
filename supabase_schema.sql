-- ==========================================
-- Supabase PostgreSQL Schema for HTan Bali
-- ==========================================

-- 1. Create Products Table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('HT', 'Intercom', 'Jasa Broadcasting', 'Paket')),
    price DECIMAL(12, 2) NOT NULL DEFAULT 0,
    description TEXT,
    image TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{}'::jsonb,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE orders (
    id TEXT PRIMARY KEY, -- Using TEXT to keep the 'ORD-xxx' format
    customer_name TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL,
    customer_address TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Active', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Order Items Table (One-to-Many relationship with Orders)
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_booking DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- Optional: Trigger to update "updated_at" 
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Supabase Storage for Product Images
-- ==========================================

-- Insert the product-images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Grant public read access to images
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Grant public insert access (since we are not using Supabase Auth yet)
CREATE POLICY "Public Insert Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'product-images');

-- Grant public delete access
CREATE POLICY "Public Delete Access" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'product-images');
