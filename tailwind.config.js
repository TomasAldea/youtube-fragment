/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

//https://colorhunt.co/palette/261c2c3e2c415c527f6e85b2

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        dark: {
          colors: {
            background: '#261C2C',
            primary: {
              DEFAULT: "#6E85B2",
              foreground: "#fff",
            },
            focus: "#BEF264",
          },
        },
      },
    }),
  ],
}