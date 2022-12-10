module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['next/core-web-vitals'],
  globals: {
    JSX: true,
  },
  rules: {
    'link-passhref': 'off',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
}
