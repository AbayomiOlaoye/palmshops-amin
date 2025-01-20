/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ek-green': '#5D9D53',
        'ek-light': '#A9D99F',
        'ek-black': '#272525',
        'ek-white': '#F1F5F2',
        'ek-gray': '#64676a',
        'ek-nav': '#262626',
        'ek-lime': '#C3EE00',
        'ek-red': '#FB471D',
        'ek-highlight': '#E9E5C4',
      },
    },
  },
  plugins: [],
}

