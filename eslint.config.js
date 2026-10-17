// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'android/*', 'docs/*', 'scripts/*'],
  },
  {
    files: ['jest.setup.js', '**/__tests__/**'],
    languageOptions: { globals: { jest: 'readonly' } },
  },
]);
