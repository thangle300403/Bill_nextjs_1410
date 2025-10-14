// tailwind.config.js
/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        shine: "shine 1.5s ease-in-out infinite",
      },
      keyframes: {
        shine: {
          "0%, 100%": { transform: "scale(0.8)", opacity: "0.1" },
          "50%": { transform: "scale(1.2)", opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
};
