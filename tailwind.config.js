/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./client/*.html"],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}