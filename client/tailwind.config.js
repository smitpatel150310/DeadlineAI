/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gh: {
          bg: '#030509',
          canvas: '#080b12',
          border: '#161d2e',
          text: '#ffffff',
          'text-secondary': '#94a3b8',
          'text-tertiary': '#475569',
          accent: {
            blue: '#00e5ff',
            green: '#10b981',
            red: '#f43f5e',
            orange: '#f59e0b',
            purple: '#7c3aed',
          },
          btn: {
            bg: '#0d1321',
            hover: '#161d2e',
            primary: '#00e5ff',
            'primary-hover': '#00b8cc',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
