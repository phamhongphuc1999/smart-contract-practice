module.exports = {
  root: true,
  env: {
    node: true,
    mocha: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['import', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    quotes: ['error', 'single'],
    semi: ['warn', 'always'],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-named-as-default': 'error',
    'import/no-unresolved': 'warn',
    'no-console': ['warn', { allow: ['debug', 'warn', 'error'] }],
    'no-debugger': 'warn',
  },
  settings: {
    'import/ignore': ['node_modules'],
    'import/resolver': {
      alias: {
        map: [
          ['src', './src/'],
          ['public', './public/'],
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
