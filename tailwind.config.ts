import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // XQube Design System
        'xq-bg':      '#000000',
        'xq-card':    '#0E0E0E',
        'xq-accent':  '#14CB72',
        'xq-muted':   '#8D95A8',
        'xq-light':   '#C4CAD8',
        'xq-border':  '#1A1A1A',
        'xq-surface': '#111111',
      },
      fontFamily: {
        sans: ['Urbanist', 'sans-serif'],
        display: ['Urbanist', 'sans-serif'],
      },
      fontSize: {
        'hero':    ['72px', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1':      ['48px', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'h2':      ['36px', { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
        'h3':      ['24px', { lineHeight: '1.3' }],
        'label':   ['13px', { lineHeight: '1.4',  letterSpacing: '0.08em' }],
        'body':    ['16px', { lineHeight: '1.6' }],
        'small':   ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'xq': '4px',
        'xq-lg': '8px',
        'xq-xl': '12px',
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(20,203,114,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,203,114,0.03) 1px, transparent 1px)",
        'hero-gradient': "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(20,203,114,0.15), transparent)",
        'card-gradient': "linear-gradient(135deg, #0E0E0E 0%, #111111 100%)",
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
    },
  },
  plugins: [],
}

export default config
