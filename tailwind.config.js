/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores inspirada en CERO.AI
        'cero-primary': '#00C8F5',         // Azul/Cian vibrante para botones principales, énfasis
        'cero-primary-dark': '#00A5D8',    // Tono más oscuro para hover de primary

        'cero-dark-ui': '#2D3250',         // Azul oscuro/casi negro para títulos, texto principal, fondo de stepper
        'cero-light-bg': '#F5F8FA',        // Fondo general muy claro, casi blanco
        'cero-card-bg': '#FFFFFF',         // Blanco puro para fondos de tarjetas/módulos

        'cero-text-main': '#2D3250',       // Texto principal (igual que cero-dark-ui)
        'cero-text-secondary': '#546E7A',  // Texto secundario, descripciones (gris azulado medio)
        'cero-text-light': '#FFFFFF',      // Texto blanco (para fondos de colores)

        'cero-border': '#CFD8DC',          // Gris claro para bordes de inputs y divisores
        
        'cero-success': '#4CAF50',         // Verde estándar para éxito (buen contraste)
        'cero-error': '#F44336',           // Rojo estándar para error (buen contraste)
        'cero-warning': '#FFC107',         // Amarillo/naranja para advertencias (opcional)
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 4px rgba(0, 0, 0, 0.06)',
        'medium': '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        feedbackFadeIn: 'feedbackFadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          'from': { opacity: 0, transform: 'translateY(10px)' },
          'to': { opacity: 1, transform: 'translateY(0px)' },
        },
        feedbackFadeIn: {
          'from': { opacity: 0, transform: 'translateY(-10px)' },
          'to': { opacity: 1, transform: 'translateY(0px)' },
        }
      }
    },
  },
  plugins: [],
}