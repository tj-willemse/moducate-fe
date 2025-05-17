/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shine': 'shine 1.5s ease-in-out infinite',
        'ripple': 'ripple 0.8s ease-out forwards',
      },
      keyframes: {
        shine: {
          '0%': { left: '-100%' },
          '100%': { left: '200%' },
        },
        ripple: {
          '0%': { transform: 'scale(0) translate(-50%, -50%)', opacity: '0.5' },
          '100%': { transform: 'scale(2) translate(-25%, -25%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
