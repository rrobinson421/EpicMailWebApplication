import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from '@typescript-eslint/eslint-plugin';
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  ignores: ['dist'],
  extends: [
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked, // Type-aware linting
    ...tseslint.configs.strictTypeChecked, // Stricter TS rules
    ...tseslint.configs.stylisticTypeChecked, // Code style enforcement
  ],
  files: ['**/*.{ts,tsx}'],
  languageOptions: {
    ecmaVersion: 2020,
    globals: globals.browser,
    parserOptions: {
      project: ['./tsconfig.json'], // TypeScript project settings
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    'react-hooks': reactHooks,
    'react-refresh': reactRefresh,
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
});
// This ESLint configuration is tailored for TypeScript projects using React.