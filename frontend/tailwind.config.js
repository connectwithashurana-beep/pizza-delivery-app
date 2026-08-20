/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fffaf5',
          100: '#fbe8d9',
          200: '#f4c5a3',
          300: '#e6a06b',
          400: '#d77b3d',
          500: '#bf5f2b',
          600: '#9f4921',
          700: '#7d3519',
          800: '#5e2717',
          900: '#2b1710',
        },
        slate: {
          950: '#17181d',
        },
      },
      boxShadow: {
        soft: '0 18px 40px rgba(23, 24, 29, 0.08)',
        hover: '0 22px 45px rgba(191, 95, 43, 0.18)',
      },
      backgroundImage: {
        hero: 'linear-gradient(135deg, rgba(23,24,29,1) 0%, rgba(39,24,23,1) 45%, rgba(191,95,43,1) 100%)',
      },
    },
  },
  plugins: [],
}
