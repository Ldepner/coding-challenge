/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./views/*.{html,js,pug}'],
  theme: {
    extend: {},
    colors: {
      gray: "#d1d5db",
    },
  },
  plugins: [
    {
      tailwindcss: {},
      autoprefixer: {}
    }
  ],
}
