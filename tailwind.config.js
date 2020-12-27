const colors = require('./src/COLORS.json');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
    extend: {
      fontFamily: {
        mono: ['Roboto Mono', 'Monaco', 'monospace'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
