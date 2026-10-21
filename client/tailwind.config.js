/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7657E8',
          coral: '#FF6B6B',
          yellow: '#FFD166',
          mint: '#54D6B2',
          sky: '#61B8FF',
          cream: '#FFFDF8',
          ink: '#28243D',
        },
      },
      boxShadow: {
        soft: '0 12px 30px rgba(118, 87, 232, 0.12)',
      },
    },
  },
  plugins: [],
};
