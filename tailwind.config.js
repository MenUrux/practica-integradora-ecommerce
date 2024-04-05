/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/**/*.handlebars",

  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Oswald', 'sans-serif'],

      },
      colors: {
        'custom-pink': '#990066',
      },
      backgroundImage: {
        'custom-gradient': 'linear-gradient(0deg, rgba(153,0,102,1) 0%, rgba(0,0,0,0) 100%)',
      }
    }
  },
  plugins: [require('tailwind-scrollbar')({ nocompatible: true }), 'prettier-plugin-tailwindcss'],
}

