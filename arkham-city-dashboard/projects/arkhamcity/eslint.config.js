// @ts-check
const tseslint = require('typescript-eslint');
const rootConfig = require('../../eslint.config.js');

module.exports = tseslint.config(...rootConfig, {
  files: ['**/*.ts'], rules: {
    '@angular-eslint/directive-selector': ['error', {
      type: 'attribute', style: 'camelCase',
    }],
    '@angular-eslint/component-selector': ['error', {
      type: 'element', style: 'kebab-case',
    }],
    '@angular-eslint/component-class-suffix': ['error', {
      suffixes: [''],
    }],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@angular-eslint/no-output-on-prefix': ['off'],
    '@angular-eslint/no-empty-lifecycle-method': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-unused-vars': ['off'],
  },
}, {
  files: ['**/*.html'], rules: {},
});
