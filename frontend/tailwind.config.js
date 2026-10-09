/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'nautical-black': '#000000',
        'nautical-surface': '#1A0000',
        'nautical-surface-light': '#260000',
        'nautical-red': '#FF1E1E',
        'nautical-red-light': '#FF4D4D',
      }
    },
  },
  plugins: [],
}
