/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: '#102A6B',
        primary: '#2563EB',
        page: '#ECF3FD',
        field: '#F9F9F9',
        'field-border': '#D0D5DD',
      },
    },
  },
  plugins: [],
};
