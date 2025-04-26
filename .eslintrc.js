module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['express'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // ESLint rules
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }], // Ignore 'next' in Express middleware
    'no-console': 'off', // You might want to enable this in production

    // Node.js rules
    'node/no-unpublished-require': 'off', // Useful during development

    // Express plugin rules
    'express/no-deprecated': 'error',
    'express/no-unsupported-version': 'error',
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: {
        mocha: true,
      },
    },
  ],
};
