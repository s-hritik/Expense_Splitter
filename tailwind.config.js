/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A192F',
          light: '#112240',
          lightest: '#233554',
        },
        slate: {
          DEFAULT: '#8892B0',
          light: '#A8B2D1',
          lightest: '#CCD6F6',
        },
        green: {
          DEFAULT: '#64FFDA',
        },
      },
      fontFamily: {
        mono: ['SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', 'monospace'],
        sans: ['Calibre', 'Inter', 'San Francisco', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};