/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Strawberry Kiss Palette
        primary: {
          200: "#fad0d9",
          300: "#f7a8b8",
          400: "#f27591",
          500: "#e94d6f",
          600: "#d42d5d",
          700: "#b2204e",
          800: "#941d47",
          900: "#7e1c42",
        },
        neutral: {
          50: "#faf9f8",
          100: "#f5f3f1",
          200: "#e8e5e1",
          300: "#d2bdab",
          400: "#cfa195",
          500: "#a59383",
          600: "#87564b",
          700: "#6d3222",
          800: "#5a2a1d",
          900: "#4a2318",
        },
        // Semantic tokens used across the app
        background: {
          // maps to neutral.50
          primary: "#faf9f8",
        },
        text: {
          // maps to neutral.900 (dark text)
          primary: "#4a2318",
        },
        // generic border color token used with `border-border`
        border: "#e8e5e1",
        cream: "#E2B8AD",
        rose: "#CFA195",
        mauve: "#87564B",
        chocolate: "#6D3222",
        accent: "#A59383",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
