const globals = require('globals');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn'],
      'no-console': 'off',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'brace-style': ['error', '1tbs'],
      'comma-dangle': ['error', 'never']
    }
  }
];
