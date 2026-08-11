export const typography = {
  // Sans-serif principal (Inter)
  sans: {
    family: "'Inter', system-ui, -apple-system, sans-serif",
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  // Serif elegante (Playfair Display)
  serif: {
    family: "'Playfair Display', Georgia, serif",
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  
  // Escala tipográfica
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;
