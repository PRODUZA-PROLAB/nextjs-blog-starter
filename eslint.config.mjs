import js from "@eslint/js";
import globals from "globals";
import ts from "typescript-eslint";

export default [
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "dist/**", "package-lock.json", ".git/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node, ...globals.browser },
    },
  },
];
