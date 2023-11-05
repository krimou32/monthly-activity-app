/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#025582",

          secondary: "#ff849d",

          accent: "#bcdd25",

          neutral: "#211d2a",

          "base-100": "#284153",

          info: "#6591d2",

          success: "#159989",

          warning: "#f29b21",

          error: "#f0816a",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
