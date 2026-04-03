import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#0a0f19',
        slate: {
          900: '#0f172a'
        },
        accent: '#7c3aed'
      }
    }
  },
  plugins: []
};

export default config;
