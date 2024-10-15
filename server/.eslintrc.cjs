module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'dist/'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: false,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  extends: [
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        paths: ['./src'],
        extensions: ['.js', '.ts'],
      },
    },
    'import/parsers': { '@typescript-eslint/parser': ['.ts'] },
  },
  rules: {
    'import/no-named-as-default': 'off',
  },
};
