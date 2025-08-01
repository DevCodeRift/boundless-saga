/** @type {import('tailwindcss').Config} */
// Tailwind CSS configuration for Murim Game
// This file sets up the custom murim-inspired color palette, fonts, and animations for the project theme.
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Murim-inspired color palette
        'void': '#0a0a0a',
        'shadow': '#1a1a1a',
        'obsidian': '#2d2d2d',
        'steel': '#4a5568',
        'mist': '#718096',
        'jade': '#38a169',
        'emerald': '#00d084',
        'gold': '#f6e05e',
        'crimson': '#e53e3e',
        'azure': '#3182ce',
        'silver': '#e2e8f0'
      },
      fontFamily: {
        'cultivation': ['Inter', 'system-ui', 'sans-serif'],
        'ancient': ['Cinzel', 'serif']
      },
      animation: {
        'qi-flow': 'qi-flow 3s ease-in-out infinite',
        'blade-shine': 'blade-shine 2s linear infinite',
        'cultivation-pulse': 'cultivation-pulse 4s ease-in-out infinite'
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}

