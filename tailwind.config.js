/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hg: {
          red: '#C8102E',
          'red-dark': '#A00D24',
          'red-light': '#E8243F',
          black: '#0A0B0D',
          dark: '#111318',
          card: '#161A22',
          border: '#1E2330',
          muted: '#2A3042',
          text: '#8892A4',
          light: '#C4CDD8',
          white: '#F0F4FA',
        }
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hg-grid': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0M-10 10L10-10M30 50L50 30' stroke='%231E2330' stroke-width='0.5'/%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        pulseRed: { '0%,100%': { boxShadow: '0 0 0 0 rgba(200,16,46,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(200,16,46,0)' } },
      }
    },
  },
  plugins: [],
}
