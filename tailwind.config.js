/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rage-yellow': '#feae11',
        'rage-black': '#000000',
        'rage-red': '#DC143C',
      },
      fontFamily: {
        'rage': ['Feast of Flesh BB', 'Impact', 'Arial Black', 'sans-serif'],
        'crashcourse': ['Crashcourse BB', 'Impact', 'Arial Black', 'sans-serif'],
      },
    },
  },
  plugins: [],
}



