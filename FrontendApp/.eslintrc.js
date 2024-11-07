module.exports = {
  root: true,
  extends: [
    '@react-native', // React Native에 대한 기본 설정
    'eslint:recommended', // 기본 ESLint 규칙
    'plugin:@typescript-eslint/recommended', // TypeScript ESLint 플러그인 규칙
    'plugin:react/recommended', // React에 대한 권장 규칙
    'prettier', // Prettier와의 통합
  ],
  parser: '@typescript-eslint/parser', // TypeScript 파서 사용
  parserOptions: {
    ecmaFeatures: {
      jsx: true, // JSX 지원
    },
    ecmaVersion: 2020, // ECMAScript 2020 지원
    sourceType: 'module', // 모듈 형식으로 코드 해석
  },
  settings: {
    react: {
      version: 'detect', // React 버전 자동 감지
    },
  },
  rules: {
    'no-var': 'error',
    'no-multiple-empty-lines': 'error',
    'no-console': 'off',
    eqeqeq: 'error',
    'dot-notation': 'error',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error', // TypeScript의 사용되지 않는 변수 규칙
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
