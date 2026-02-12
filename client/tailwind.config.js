/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        glow: "glow 2s ease-in-out infinite",
        "glow-intense": "glow-intense 1.5s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 5px rgba(249, 115, 22, 0.5), 0 0 10px rgba(249, 115, 22, 0.3)",
          },
          "50%": {
            boxShadow: "0 0 20px rgba(249, 115, 22, 0.8), 0 0 30px rgba(249, 115, 22, 0.6)",
          },
        },
        "glow-intense": {
          "0%, 100%": {
            boxShadow: "0 0 10px rgba(249, 115, 22, 0.8), 0 0 20px rgba(249, 115, 22, 0.6)",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(249, 115, 22, 1), 0 0 40px rgba(249, 115, 22, 0.8)",
          },
        },
      },
    },
  },
  plugins: [],
}
