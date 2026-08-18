import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Mimir brand tokens
        mimir: {
          bg: '#F7F6F2',
          ink: '#181818',
          blue: '#3046C5',
          orange: '#FF5A1F',
        },
        // Existing prototype tokens (kept for the Noted-style app screens)
        cream: {
          50: '#FBF7EE',
          100: '#F6EFE2',
          200: '#EFE5D1',
          300: '#E5D8BD',
          400: '#D9CFBE',
        },
        ink: {
          900: '#1B1A17',
          700: '#3A352E',
          500: '#5C544A',
          300: '#8A8174',
        },
        accent: {
          DEFAULT: '#2E4A6B',
          soft: '#5A7A9C',
        },
        ember: '#A14F2F',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Instrument Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        paper: '0 1px 0 rgba(27,26,23,0.04), 0 6px 18px -10px rgba(27,26,23,0.18)',
        bezel: '0 30px 60px -20px rgba(0,0,0,0.45), 0 10px 30px -10px rgba(0,0,0,0.35)',
      },
      borderColor: {
        DEFAULT: '#D9CFBE',
      },
    },
  },
  plugins: [],
} satisfies Config;
