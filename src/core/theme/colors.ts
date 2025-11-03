export const colors = {
  // Colores principales
  primary: {
    light: "#E2B8AD",
    main: "#CFA195",
    dark: "#87564B",
  },

  // Colores neutros
  neutral: {
    lightest: "#FAF9F8",
    light: "#F5F3F1",
    medium: "#D2BDAB",
    dark: "#6D3222",
  },

  // Colores de acento
  accent: {
    chocolate: "#6D3222",
    mauve: "#87564B",
    rose: "#CFA195",
    cream: "#E2B8AD",
    beige: "#A59383",
  },

  // Estados
  success: "#60a67aff",
  warning: "#d3b34aff",
  error: "#ab5151ff",
  info: "#53759cff",

  // Texto
  text: {
    primary: "#1F1F1F",
    secondary: "#6D3222",
    muted: "#A59383",
    light: "#D2BDAB",
  },

  // Fondos
  background: {
    primary: "#FAF9F8",
    secondary: "#F5F3F1",
    card: "#FFFFFF",
    overlay: "rgba(109, 50, 34, 0.1)",
  },
} as const;

export type ColorTheme = typeof colors;
