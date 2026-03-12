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
        primary: 'var(--color-primary)',
        'primary-strong': 'var(--color-primary-strong)',
        'primary-soft': 'var(--color-primary-soft)',
        'primary-ghost': 'var(--color-primary-ghost)',
        'background-light': 'var(--color-bg)',
        'background-dark': 'var(--color-bg-strong)',
        surface: 'var(--color-surface)',
        'surface-muted': 'var(--color-surface-muted)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-muted': 'var(--color-text-muted)',
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
