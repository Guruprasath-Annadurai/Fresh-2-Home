/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        yellow: {
          500: '#FFD700', // Royal Yellow
          600: '#E6C200',
          700: '#CCB000',
        },
      },
    },
  },
  plugins: [],
};