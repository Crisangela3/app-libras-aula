/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ciano: "#00BCD4",
        gold: "#D4AF37",
        beige: "#F5F5DC",
        lavender: "#E6E6FA",
      }
    },
  },
  plugins: [],
}

