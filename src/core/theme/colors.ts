export const colors = {
  // Colores principales (tonos rosados/crema)
  primary: {
    light: "#E2B8AD",     // Crema claro
    main: "#CFA195",      // Rosa principal
    dark: "#87564B",      // Mauve oscuro
    darker: "#6D322A",    // Chocolate oscuro
  },

  // Colores neutros
  neutral: {
    lightest: "#FAF9F8",  // Casi blanco
    light: "#F5F3F1",     // Beige muy claro
    medium: "#D2BDAB",    // Beige medio (fondo principal)
    dark: "#A59383",      // Beige oscuro
    darker: "#6D3222",    // Marrón chocolate
    text: "#333333",      // Texto normal
  },

  // Colores de acento para botones y elementos interactivos
  accent: {
    chocolate: "#6D3222",  // Botón principal
    chocolateHover: "#6D322A", // Hover de botones
    mauve: "#87564B",      // Botón secundario
    rose: "#CFA195",       // Detalles rosados
    cream: "#E2B8AD",      // Fondos suaves
    beige: "#A59383",      // Elementos neutros
  },

  // Estados (feedback visual)
  success: "#60a67a",
  warning: "#d3b34a",
  error: "#ab5151",
  info: "#53759c",

  // Texto (jerarquía de contenido)
  text: {
    primary: "#333333",    // Texto principal
    important: "#6D322A",  // Títulos importantes
    secondary: "#6D3222",  // Texto secundario
    muted: "#A59383",      // Texto deshabilitado
    light: "#D2BDAB",      // Texto sobre fondos oscuros
  },

  // Fondos y superficies
  background: {
    main: "#D2BDAB",       // Fondo principal de la página
    card: "#A59383",       // Fondo de tarjetas
    header: "#E2B8AD",     // Header y Footer
    overlay: "rgba(226, 183, 173, 0.69)", // Overlays y modales
    light: "#FAF9F8",      // Fondos alternativos claros
  },

  // Bordes
  border: {
    light: "#E2B8AD",
    main: "#D2BDAB",
    dark: "#A59383",
  },
} as const;

export type ColorTheme = typeof colors;

// Exportar también como variables CSS custom properties
export const cssVariables = `
  --color-primary-light: ${colors.primary.light};
  --color-primary-main: ${colors.primary.main};
  --color-primary-dark: ${colors.primary.dark};
  --color-primary-darker: ${colors.primary.darker};
  
  --color-neutral-lightest: ${colors.neutral.lightest};
  --color-neutral-light: ${colors.neutral.light};
  --color-neutral-medium: ${colors.neutral.medium};
  --color-neutral-dark: ${colors.neutral.dark};
  --color-neutral-darker: ${colors.neutral.darker};
  --color-neutral-text: ${colors.neutral.text};
  
  --color-accent-chocolate: ${colors.accent.chocolate};
  --color-accent-chocolate-hover: ${colors.accent.chocolateHover};
  --color-accent-mauve: ${colors.accent.mauve};
  --color-accent-rose: ${colors.accent.rose};
  --color-accent-cream: ${colors.accent.cream};
  
  --color-text-primary: ${colors.text.primary};
  --color-text-important: ${colors.text.important};
  --color-text-secondary: ${colors.text.secondary};
  --color-text-muted: ${colors.text.muted};
  
  --color-bg-main: ${colors.background.main};
  --color-bg-card: ${colors.background.card};
  --color-bg-header: ${colors.background.header};
  
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-error: ${colors.error};
  --color-info: ${colors.info};
`;
