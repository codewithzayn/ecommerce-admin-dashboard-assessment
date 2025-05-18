export default {
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  extends: ['plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // your rules
  },
}
