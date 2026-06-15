/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        fb: {
          blue:         '#1877F2',
          'blue-hover': '#166FE5',
          'blue-active':'#0C5DBF',
          'blue-light': '#E7F3FF',
          bg:           '#F0F2F5',
          text:         '#050505',
          secondary:    '#65676B',
          border:       '#CED0D4',
          divider:      '#E4E6EB',
          hover:        '#E4E6EB',
          red:          '#ED4956',
          'red-hover':  '#C41929',
          green:        '#31A24C',
          'green-hover':'#2D8F44',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"',
          'Roboto', 'Helvetica', 'Arial', 'sans-serif',
        ],
      },
      animation: {
        'slide-in':  'slideInRight 0.35s ease-out',
        'slide-out': 'slideOutRight 0.35s ease-in forwards',
      },
      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(110%)', opacity: '0' },
          to:   { transform: 'translateX(0)',    opacity: '1' },
        },
        slideOutRight: {
          from: { transform: 'translateX(0)',    opacity: '1' },
          to:   { transform: 'translateX(110%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
