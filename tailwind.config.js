/* eslint @typescript-eslint/no-var-requires:0 */
/* eslint-env node */

const colors = require('./src/colors.json');

module.exports = {
  purge: [],
  theme: {
    colors,
    fontFamily: {
      'sans': 'Roboto, Helvetica Neue, -apply-system, Arial, sans-serif',
    },
    extend: {
      backgroundImage: () => ({
        'savings-wallet': 'url(/assets/images/wallets/savings.png)',
      }),
      minHeight: {
        'content': 'calc(100vh - 5rem - 4rem)',
      },
    },
  },
  variants: {},
  plugins: [],
};
