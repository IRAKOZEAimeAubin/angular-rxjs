import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [ "'Montserrat', sans-serif", ...defaultTheme.fontFamily.sans ],
      }
    },
  },
  plugins: [],
};