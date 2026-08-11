/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#FFFFF0',
        cream: '#FFFDD0',
        warmBeige: '#F5F5DC',
        offWhite: '#FAF9F6',
        sageGreen: '#9CAF88',
        dustyRose: '#D8A090',
        softBlue: '#A8C8DC',
        goldAccent: '#C9A962',
        goldLight: '#E5D4A1',
        textPrimary: '#2D2D2D',
        textSecondary: '#5A5A5A',
        textLight: '#8A8A8A',
        success: '#7BA05B',
        error: '#C1666B',
        warning: '#D4A574',
        adminPrimary: '#4A5568',
        adminSecondary: '#718096',
        adminBackground: '#F7FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        script: ['"Great Vibes"', '"Alex Brush"', '"Dancing Script"', 'cursive'],
      },
      keyframes: {
        'fade-right': {
          '0%': { opacity: '0', transform: 'translateX(-2.5rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-left': {
          '0%': { opacity: '0', transform: 'translateX(2.5rem)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-right': 'fade-right 1.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-left': 'fade-left 1.6s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}
