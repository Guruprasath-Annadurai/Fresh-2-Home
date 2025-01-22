import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Search, Leaf } from 'lucide-react';
import { useThemeStore } from '../lib/store';

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useThemeStore();

  return (
    <nav className="bg-yellow-500 dark:bg-yellow-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-white" />
            <span className="text-white font-bold text-xl">Fresh 2 Home</span>
          </Link>

          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-full bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-yellow-600 dark:hover:bg-yellow-700"
            >
              {isDarkMode ? (
                <Sun className="h-6 w-6 text-white" />
              ) : (
                <Moon className="h-6 w-6 text-white" />
              )}
            </button>
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-white" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
            
            <Link
              to="/login"
              className="text-white hover:bg-yellow-600 dark:hover:bg-yellow-700 px-4 py-2 rounded-md"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}