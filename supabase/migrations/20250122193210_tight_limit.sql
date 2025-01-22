/*
  # Initial Schema Setup for Fresh 2 Home

  1. New Tables
    - products
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - price (numeric)
      - category (text)
      - image_url (text)
      - stock (integer)
      - created_at (timestamp)
    
    - cart_items
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - product_id (uuid, references products)
      - quantity (integer)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image_url text,
  stock integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products policies
CREATE POLICY "Anyone can view products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Cart items policies
CREATE POLICY "Users can view their own cart"
  ON cart_items
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart"
  ON cart_items
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
  ON cart_items
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart"
  ON cart_items
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert sample products
INSERT INTO products (name, description, price, category, image_url, stock) VALUES
('Fresh Organic Bananas', 'Sweet and ripe organic bananas', 2.99, 'Fruits', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800', 100),
('Organic Avocados', 'Perfectly ripe Hass avocados', 3.99, 'Fruits', 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=800', 50),
('Fresh Spinach', 'Organic baby spinach leaves', 2.49, 'Vegetables', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800', 75),
('Whole Milk', 'Fresh organic whole milk', 4.99, 'Dairy', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800', 30),
('Organic Eggs', 'Farm fresh organic eggs', 5.99, 'Dairy', 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800', 40),
('Sourdough Bread', 'Freshly baked sourdough bread', 4.99, 'Bakery', 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?w=800', 25);