import prettier from 'eslint-config-prettier'
import { defineFlatConfig } from 'eslint-define-config'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import ts from 'typescript-eslint'

export default defineFlatConfig([
  // TypeScript 配置
  ...ts.configs.recommended,

  // Prettier 集成
  prettier,

  // 全局变量配置
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
    },
  },

  // 共享规则配置
  {
    plugins: {
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      // TypeScript 规则
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'semi': ['error', 'never'],
    },
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      '**/*.d.ts',
    ]
  },

  // 针对测试文件的特殊配置
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
])