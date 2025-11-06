/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores principales (tonos rosados/crema)
        primary: {
          light: "#E2B8AD",
          main: "#CFA195",
          dark: "#87564B",
          darker: "#6D322A",
          DEFAULT: "#CFA195",
        },
        
        // Colores neutros
        neutral: {
          lightest: "#FAF9F8",
          light: "#F5F3F1",
          medium: "#D2BDAB",
          dark: "#A59383",
          darker: "#6D3222",
          text: "#333333",
          DEFAULT: "#333333",
        },
        
        // Colores de acento
        accent: {
          chocolate: "#6D3222",
          chocolateHover: "#6D322A",
          mauve: "#87564B",
          rose: "#CFA195",
          cream: "#E2B8AD",
          beige: "#A59383",
          DEFAULT: "#87564B",
        },
        
        // Estados (feedback visual)
        success: "#60a67a",
        warning: "#d3b34a",
        error: "#ab5151",
        info: "#53759c",
        
        // Texto (jerarquía de contenido)
        text: {
          primary: "#333333",
          important: "#6D322A",
          secondary: "#6D3222",
          muted: "#A59383",
          light: "#D2BDAB",
          DEFAULT: "#333333",
        },
        
        // Fondos y superficies
        background: {
          main: "#D2BDAB",
          card: "#A59383",
          header: "#E2B8AD",
          light: "#FAF9F8",
          DEFAULT: "#D2BDAB",
        },
        
        // Bordes
        border: {
          light: "#E2B8AD",
          main: "#D2BDAB",
          dark: "#A59383",
          DEFAULT: "#D2BDAB",
        },
      },
      fontFamily: {
        sans: ['"Source Serif 4"', 'Georgia', 'serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'serif'],
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
