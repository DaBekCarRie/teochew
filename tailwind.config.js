/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF6EE',
          100: '#F5EDD8',
          200: '#EDE0C4',
          300: '#D9C9A8',
        },
        gold: {
          200: '#E8D5A3',
          500: '#C9A84C',
          700: '#9A7A2E',
        },
        brick: {
          200: '#E8C4B8',
          600: '#B5451B',
          800: '#7A2E0F',
        },
        brown: {
          400: '#A08060',
          600: '#6B4C2A',
          900: '#2C1A0E',
        },
      },
    },
  },
  plugins: [],
};
