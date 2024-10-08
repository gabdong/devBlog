module.exports = {
  root: true,
  ignorePatterns: ['node_modules/', 'build/', 'public/'],
  parser: '@typescript-eslint/parser', // ts 구문분석
  env: {
    // 전역객체를 eslint가 인식하는 구간
    browser: true, // document나 window 인식되게 함
    node: true,
    es6: true,
  },
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  plugins: ['@typescript-eslint', 'prettier', 'import', 'react'],
  extends: [
    'next/core-web-vitals',
    'next/typescript',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
    'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.ts', '.tsx'] }],
  },
};
