/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg':   '#0f172a',
        'secondary-bg': '#111827',
        'card-bg':      '#1e293b',
        'accent':       '#38bdf8',
        'accent-hover': '#0ea5e9',
        'success':      '#22c55e',
        'danger':       '#ef4444',
        'warning':      '#f59e0b',
        'text-primary': '#e5e7eb',
        'text-secondary':'#9ca3af',
        'border':       '#374151',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.4)',
        'glow': '0 0 20px rgba(56, 189, 248, 0.15)',
      },
    },
  },
  plugins: [],
}
