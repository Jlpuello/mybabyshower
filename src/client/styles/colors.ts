export const colors = {
  // Neutros base
  ivory: '#FFFFF0',
  cream: '#FFFDD0',
  warmBeige: '#F5F5DC',
  offWhite: '#FAF9F6',
  
  // Acentos elegantes
  sageGreen: '#9CAF88',
  dustyRose: '#D8A090',
  softBlue: '#A8C8DC',
  
  // Dorado (solo acentos)
  goldAccent: '#C9A962',
  goldLight: '#E5D4A1',
  
  // Texto
  textPrimary: '#2D2D2D',
  textSecondary: '#5A5A5A',
  textLight: '#8A8A8A',
  
  // Estados
  success: '#7BA05B',
  error: '#C1666B',
  warning: '#D4A574',
  
  // Admin (diferenciado)
  adminPrimary: '#4A5568',
  adminSecondary: '#718096',
  adminBackground: '#F7FAFC',
} as const;

export type Color = keyof typeof colors;
