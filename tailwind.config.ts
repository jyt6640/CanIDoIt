import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'light-bg': '#f8f8f8',
        'dark-badge': '#0e1311',
        'green-accent': 'rgba(90, 225, 76, 0.89)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in-from-bottom': {
          from: { opacity: '0', transform: 'translateY(2rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'zoom-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-in-from-bottom 0.3s ease-out',
        'zoom-in': 'zoom-in 0.2s ease-out',
        'results-in': 'slide-in-from-bottom 0.7s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
