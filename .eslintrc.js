// .eslintrc.js
module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "prettier/prettier": "error",
  },
  globals: {
    document: false,
  },
  env: {
    browser: true,
  },
};
