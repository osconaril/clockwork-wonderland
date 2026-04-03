import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Steampunk Wonderland palette
        brass: {
          50: '#fdf8ed',
          100: '#f9edcc',
          200: '#f3d894',
          300: '#ecbe5c',
          400: '#e7a835',
          500: '#de8d1d',
          600: '#c46b16',
          700: '#a34c16',
          800: '#853c18',
          900: '#6e3217',
        },
        copper: {
          50: '#fdf4ef',
          100: '#fbe5d9',
          200: '#f6c8b2',
          300: '#f0a380',
          400: '#e9744d',
          500: '#e35028',
          600: '#d5381e',
          700: '#b1291b',
          800: '#8d231d',
          900: '#72201b',
        },
        parchment: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#faf1de',
          300: '#f5e4c3',
          400: '#edd2a0',
          500: '#e3bc7c',
          600: '#d4a05a',
          700: '#b68044',
          800: '#94673b',
          900: '#795533',
        },
        ink: {
          50: '#f4f3f2',
          100: '#e3e1de',
          200: '#c9c4bd',
          300: '#a9a295',
          400: '#8d8474',
          500: '#726a5c',
          600: '#5c5549',
          700: '#4a453c',
          800: '#3d3933',
          900: '#2e2b25',
          950: '#1a1815',
        },
        wonderland: {
          teal: '#2a7b7b',
          purple: '#6b3fa0',
          crimson: '#9e1b34',
          forest: '#2d5a3f',
          midnight: '#1a1a2e',
        },
        // Class colors (for the 5 explorer classes)
        guardian: '#2563eb',    // Blue - protectors
        seeker: '#d97706',     // Amber - knowledge
        mystic: '#7c3aed',     // Purple - arcane
        rogue: '#059669',      // Emerald - cunning
        survivor: '#dc2626',   // Red - resilience
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'serif'],
        body: ['system-ui', '-apple-system', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'monospace'],
      },
      backgroundImage: {
        'gear-pattern': "url('/assets/gear-pattern.svg')",
        'parchment-texture': "url('/assets/parchment-bg.png')",
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.3), 0 0 1px rgba(0,0,0,0.2)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.4), 0 0 2px rgba(222,141,29,0.5)',
        'card-glow': '0 0 12px rgba(222,141,29,0.6), 0 0 4px rgba(222,141,29,0.3)',
        'brass': 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.3)',
      },
      borderRadius: {
        'card': '8px',
      },
      animation: {
        'gear-spin': 'spin 8s linear infinite',
        'gear-spin-reverse': 'spin 8s linear infinite reverse',
        'card-draw': 'cardDraw 0.4s ease-out',
        'card-play': 'cardPlay 0.3s ease-in',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        cardDraw: {
          '0%': { transform: 'translateY(-20px) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        cardPlay: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.8) translateY(-20px)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(222,141,29,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(222,141,29,0.6)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
