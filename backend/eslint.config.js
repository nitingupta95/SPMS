// eslint.config.js
const js = require("@eslint/js");
const ts = require("typescript-eslint");

module.exports = [
  {
    ignores: ["dist/**",
      "node_modules/**",
      "eslint.config.js",
      "prismaScript.js"], // ✅ applied globally
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"], // ✅ only lint TS files
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];
