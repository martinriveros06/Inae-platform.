/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        inacap: {
          red: '#CC0000',
          'red-dark': '#A00000',
          'red-light': '#FF1A1A',
          black: '#1a1a1a',
          gray: '#f4f4f4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
