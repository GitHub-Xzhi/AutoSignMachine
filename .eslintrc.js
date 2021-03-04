module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    es6: true,
    sourceType: "module",
    ecmaVersion: 12,
  },
  // parser: "@babel/eslint-parser",
  rules: {},
};
