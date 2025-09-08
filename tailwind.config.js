/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f6f5ff', 100: '#efebff', 200: '#ddd6fe', 300: '#c4b5fd',
          400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9',
          800: '#5b21b6', 900: '#4c1d95'
        },
        ink: {
          900: '#0b0b0f', 800: '#12121a', 700: '#1b1b26',
          600: '#232333', 500: '#2c2c40', 400: '#3a3a55'
        },
        silver: {
          50: '#f8f9fb', 100: '#f1f3f8', 200: '#e2e6f0', 300: '#cdd3e0',
          400: '#b7bece', 500: '#9ca4b8', 600: '#7a8395', 700: '#5f697a'
        }
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      boxShadow: {
        halo: '0 0 32px rgba(139, 92, 246, 0.35)',
        soft: '0 10px 30px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: [],
}
