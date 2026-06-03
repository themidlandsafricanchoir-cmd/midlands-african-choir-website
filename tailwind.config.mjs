/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: '#C1440E',
        gold:       '#D4A017',
        forest:     '#2D6A4F',
        navy:       '#1A1A2E',
        cream:      '#FAF3E0',
        burgundy:   '#6B2737',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"Inter"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
