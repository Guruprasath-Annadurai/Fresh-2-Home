import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', 'Fruits', 'Vegetables', 'Dairy', 'Bakery'];

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  async function loadProducts() {
    let query = supabase.from('products').select('*');
    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }
    
    const { data, error } = await query;
    if (error) {
      toast.error('Failed to load products');
      return;
    }
    setProducts(data || []);
  }

  async function addToCart(productId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('Please login to add items to cart');
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert(
        { 
          user_id: session.user.id,
          product_id: productId,
          quantity: 1
        },
        {
          onConflict: 'user_id,product_id',
          ignoreDuplicates: false
        }
      );

    if (error) {
      toast.error('Failed to add to cart');
      return;
    }

    toast.success('Added to cart');
  }

  return (
    <div>
      <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xl font-bold text-yellow-500">
                  ${product.price.toFixed(2)}
                </span>
                <button
                  onClick={() => addToCart(product.id)}
                  className="flex items-center space-x-1 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}