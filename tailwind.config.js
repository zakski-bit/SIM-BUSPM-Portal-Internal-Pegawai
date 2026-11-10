/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bpp: {
          marine: '#0066B3',
          'marine-dark': '#004C85',
          'marine-light': '#EBF5FB',
          amber: '#F37023',
          'amber-hover': '#E45D10',
          'amber-light': '#FEF3EB',
          cyan: '#00AEEF',
          navy: '#0B2545',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}
