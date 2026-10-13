/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aegis: {
          bg: '#070A14',
          bgSubtle: '#0A1020',
          panel: '#0D1425',
          elevated: '#111B30',
          hover: '#17223B',
          border: '#24324D',
          violet: '#8050FF',
          brightViolet: '#A17AFF',
          cyan: '#42DDF5',
          text: '#F5F7FF',
          textMuted: '#A6B3CD',
          success: '#43D9B0',
          warning: '#FFBD69',
          critical: '#FF5878',
        },
        navy: {
          950: '#070A14',
          900: '#0A1020',
          850: '#0D1425',
          800: '#111B30',
          750: '#17223B',
          700: '#24324D',
          600: '#334155',
          500: '#64748B',
        },
        brand: {
          cyan: '#42DDF5',
          blue: '#3B82F6',
          accent: '#8050FF',
          verified: '#43D9B0',
          danger: '#FF5878',
          warning: '#FFBD69',
          purple: '#8050FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.3)',
        'glow-verified': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
