module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    extends: ["plugin:vue/vue3-recommended", "plugin:prettier/recommended"],
    parserOptions: {
      ecmaVersion: "latest",
      parser: "@typescript-eslint/parser",
      sourceType: "module",
    },
    plugins: ["vue", "@typescript-eslint", "prettier"],
    rules: {
      semi: [2],
      complexity: ["error", 10],
      "prettier/prettier": "error",
    },
  };
  