/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './app/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        cream: {
          50: 'var(--color-cream-50)',
          100: 'var(--color-cream-100)',
          200: 'var(--color-cream-200)',
          300: 'var(--color-cream-300)',
        },
        gold: {
          200: 'var(--color-gold-200)',
          500: 'var(--color-gold-500)',
          700: 'var(--color-gold-700)',
        },
        brick: {
          200: 'var(--color-brick-200)',
          600: 'var(--color-brick-600)',
          800: 'var(--color-brick-800)',
        },
        brown: {
          400: 'var(--color-brown-400)',
          600: 'var(--color-brown-600)',
          900: 'var(--color-brown-900)',
        },
      },
    },
  },
  plugins: [],
};
