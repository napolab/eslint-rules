import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import eslintConfigPrettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import-x";
import unicornPlugin from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

import customRules from "./dist/index.js";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  eslint.configs.recommended,
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/*.d.ts",
      "tsup.config.ts",
      "vitest.config.ts",
      "eslint.config.js",
    ],
  },
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-void": "off",
      "no-unreachable": "error",
      "lines-between-class-members": "off",
      "no-array-constructor": "off",
      "no-console": "error",
      "newline-before-return": "error",
      "no-unused-vars": "off",
      "dot-notation": "off",
      camelcase: [
        "error",
        {
          ignoreImports: true,
          properties: "never",
          allow: [],
        },
      ],
      "no-restricted-imports": ["error"],
    },
  },
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parser: tseslint.parser,
      parserOptions: {
        project: true,
      },
      globals: {
        ...globals.es2022,
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      "import-x": importPlugin,
      "unused-imports": unusedImports,
      unicorn: unicornPlugin,
      "custom-rules": customRules,
    },
    rules: {
      ...importPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/consistent-generic-constructors": ["error", "constructor"],
      "@typescript-eslint/array-type": ["error", { default: "array" }],
      "@typescript-eslint/strict-boolean-expressions": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/consistent-type-exports": [
        "error",
        {
          fixMixedExportsWithInlineTypeSpecifier: false,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
        },
      ],
      "import-x/default": "off",
      "import-x/no-named-as-default-member": "off",
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
          "newlines-between": "always",
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [{ pattern: "./types/**", group: "internal", position: "before" }],
        },
      ],
      "unused-imports/no-unused-imports": "warn",
      "unicorn/prefer-node-protocol": "error",
      "unicorn/filename-case": ["error", { case: "kebabCase" }],
      "unicorn/better-regex": "error",
      "custom-rules/require-useeffect-comment": "error", // cspell:disable-line
      "custom-rules/max-style-name-words": ["error", { maxWords: 4 }],
    },
    settings: {
      "import-x/resolver": {
        typescript: true,
        node: true,
      },
      "import-x/parsers": {
        "@typescript-eslint/parser": [".js", ".ts"],
      },
    },
  },
  {
    files: ["**/*.test.{ts,tsx}"],
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": "off",
      "no-console": "off",
      "vitest/max-nested-describe": ["error", { max: 3 }],
      "vitest/expect-expect": ["error", { assertFunctionNames: ["expect", "ruleTester.run"] }],
    },
  },
  eslintConfigPrettier,
];

export default config;
