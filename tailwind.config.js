import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E9F8FF',
          100: '#D1F1FC',
          200: '#A6E3F8',
          300: '#7BD4F4',
          400: '#4FC6F0',
          500: '#24B8EB',
          600: '#00AEE0',
          700: '#008AB3',
          800: '#006685',
          900: '#004357'
        },
        indigo: {
          950: '#1E0F3A'
        },
        slate: {
          950: '#25212E'
        },
        accent: '#0FC153',
        border: {
          DEFAULT: '#E2E8EA',
          strong: '#40394D'
        }
      },
      fontFamily: {
        poppins: ['Poppins', ...defaultTheme.fontFamily.sans]
      },
      boxShadow: {
        card: '0px 10px 30px rgba(0, 174, 236, 0.17)',
        deep: '0px 10px 70px rgba(0, 174, 236, 0.18)',
        soft: '0px 4px 50px rgba(0, 174, 236, 0.19)'
      }
    }
  },
  plugins: []
};
