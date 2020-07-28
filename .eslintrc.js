module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'jsx-a11y',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'eqeqeq': ['warn', 'smart'],
    'semi': ['warn', 'always'],
    'max-len': ['error', { code: 120 }],
    'object-curly-spacing': ['warn', 'always'],
  },
};
