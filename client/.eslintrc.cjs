module.exports = {
  root: true,
  ignorePatterns: [
    'node_modules/',
    'build/',
    'public/',
    '.eslintrc.cjs',
    'next.config.mjs',
  ],
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
    createDefaultProgram: false, // tsconfig를 찾지못할경우 ts처리방법 자동설정
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
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: `${__dirname}/tsconfig.json`,
      },
      node: {
        extensions: ['.ts', '.tsx', '.js', 'jsx'],
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['warn', { extensions: ['.ts', '.tsx'] }],
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',
    'no-empty-pattern': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
