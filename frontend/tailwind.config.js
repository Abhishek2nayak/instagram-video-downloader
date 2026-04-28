/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0a0a0a",
          card: "rgba(255,255,255,0.04)",
          border: "rgba(255,255,255,0.08)",
        },
      },
    },
  },
  plugins: [],
};

