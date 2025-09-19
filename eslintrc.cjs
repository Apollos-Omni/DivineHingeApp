/* eslint-env node */
module.exports = {
  root: true,
  env: { es2021: true, node: true, browser: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true }
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "react-native"],
  extends: [
    "expo",                               // <- sane defaults for RN/Expo
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react-native/all"
  ],
  settings: { react: { version: "detect" } },
  ignorePatterns: ["node_modules/", "dist/", "build/", ".expo/"],
  overrides: [
    {
      files: ["**/*.d.ts"],
      rules: {
        "@typescript-eslint/no-unused-vars": "off"
      }
    }
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off"
  }
};
