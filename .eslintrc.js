module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/standard'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': 'off',
    'no-useless-escape': 0,
    'no-undef': 'off',
    'no-useless-return': 0,
    'vue/require-prop-type-constructor': 0,
    camelcase: 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
