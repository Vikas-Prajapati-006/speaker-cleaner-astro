/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-ping': 'wavePing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        wavePing: {
          '75%, 100%': {
            transform: 'scale(1.8)',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};