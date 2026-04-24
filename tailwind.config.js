/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        merz: {
          brand: '#32411e',
          'brand-dark': '#243015',
          teal: '#0097A9',
          'teal-dark': '#007A8A',
          'teal-light': '#E0F5F7',
          slate: '#2D3748',
          'slate-mid': '#4A5568',
          'slate-light': '#718096',
          'bg-base': '#F7F9FC',
          'bg-card': '#FFFFFF',
          border: '#E2E8F0',
        },
        product: {
          xeomin: '#3B82F6',
          'xeomin-light': '#EFF6FF',
          belotero: '#8B5CF6',
          'belotero-light': '#F5F3FF',
          radiesse: '#F97316',
          'radiesse-light': '#FFF7ED',
          ultherapy: '#0097A9',
          'ultherapy-light': '#E0F5F7',
        },
        compliance: {
          'off-label': '#DC2626',
          'off-label-bg': '#FEF2F2',
          'pv-flag': '#D97706',
          'pv-flag-bg': '#FFFBEB',
          'compliant': '#16A34A',
          'compliant-bg': '#F0FDF4',
          'low-confidence': '#9333EA',
          'low-confidence-bg': '#FAF5FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'sidebar': '2px 0 8px 0 rgb(0 0 0 / 0.06)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
}
