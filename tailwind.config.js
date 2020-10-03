/* eslint @typescript-eslint/no-var-requires:0 */
/* eslint-env node */

const colors = require('./src/colors.json');

module.exports = {
  purge: [],
  theme: {
    colors,
    extend: {},
  },
  variants: {},
  plugins: [],
};
