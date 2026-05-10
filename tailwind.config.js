/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#E8EEF7',
          100: '#C5D4EC',
          200: '#9FB8DF',
          300: '#6F94CC',
          400: '#3F6FBA',
          500: '#19376D',
          600: '#0B2447',
          700: '#081B36',
          800: '#051224',
          900: '#020912',
        },
        gold: {
          50:  '#FFFDE7',
          100: '#FFF8C5',
          200: '#FFF0A0',
          300: '#FFE566',
          400: '#FFD000',
          500: '#F5B800',
          600: '#CC9900',
          700: '#997300',
          800: '#664D00',
          900: '#332600',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
