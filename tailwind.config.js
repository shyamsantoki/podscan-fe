/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#D4AF37',
          darkGold: '#B8941F',
          navy: '#0A1128',
          lightNavy: '#1C2541',
          platinum: '#E5E5E5',
          silver: '#C0C0C0',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0A1128 0%, #1C2541 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)',
      },
      boxShadow: {
        'luxury': '0 10px 40px rgba(212, 175, 55, 0.3)',
        'luxury-lg': '0 20px 60px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}