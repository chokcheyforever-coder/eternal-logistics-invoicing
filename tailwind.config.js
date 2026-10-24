/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0B2545',
          navy: '#002B49',
          amber: '#F5A623',
          red: '#E30613',
          lightBlue: '#134B70',
          iceBlue: '#E8F1F5',
        }
      },
      fontFamily: {
        khmer: ['"Kantumruy Pro"', '"Battambang"', 'sans-serif'],
        sans: ['Inter', '"Kantumruy Pro"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
