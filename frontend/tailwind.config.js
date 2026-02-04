/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/homepage/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#7f0df2',
        'primary-glow': '#9d4bf6',
        'background-light': '#f7f5f8',
        'background-dark': '#0a0e14',
        'surface-dark': '#131620',
        'surface-dark-transparent': 'rgba(19, 22, 32, 0.6)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(to right, rgba(127, 13, 242, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(127, 13, 242, 0.05) 1px, transparent 1px)",
      },
      boxShadow: {
        'neon': '0 0 10px rgba(127, 13, 242, 0.4), 0 0 20px rgba(127, 13, 242, 0.2)',
        'neon-sm': '0 0 5px rgba(127, 13, 242, 0.4)',
      },
    },
  },
  plugins: [],
}
