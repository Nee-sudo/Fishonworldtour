/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-navy': 'rgb(var(--deep-navy) / <alpha-value>)',
        'teal-blue': 'rgb(var(--teal-blue) / <alpha-value>)',
        'soft-white': 'rgb(var(--soft-white) / <alpha-value>)',
        'muted-gray': 'rgb(var(--muted-gray) / <alpha-value>)',
        'accent-orange': 'rgb(var(--accent-orange) / <alpha-value>)',
        'cyan-blue': 'rgb(var(--cyan-blue) / <alpha-value>)',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'fadeInUp': 'fadeInUp 1s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
