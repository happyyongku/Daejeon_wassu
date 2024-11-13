module.exports = {
  root: true,
  extends: ['@react-native', 'eslint:recommended', 'prettier'],
  rules: {
    'no-var': 'error',
    'no-multiple-empty-lines': 'error',
    'no-console': 'off',
    'no-unused-vars': ['warn', {args: 'none', argsIgnorePattern: '^_', varsIgnorePattern: '^_'}],
    eqeqeq: 'error',
    'dot-notation': 'error',
  },
};
