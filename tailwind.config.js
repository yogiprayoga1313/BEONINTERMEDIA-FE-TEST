/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes:[
      {
        mytheme: {
          "primary": "#748DA6",
          "secondary": "#F000B8",
          "accent": "#37CDBE",
          "neutral": "#F5EBEB",
          "base-100": "#FFFFFF",
          "error": "#F87272",
          "white": "fffff",
        }
      }
    ]
  },
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['poppins'],
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
}

