import { RuleTester } from "eslint";
import { describe, it } from "vitest";

import { rule } from "./index";

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
});

describe("prefer-array-at", () => {
  it("should enforce using .at() method instead of bracket notation", () => {
    ruleTester.run("prefer-array-at", rule, {
      valid: [
        // Valid: Using .at() method
        {
          code: "const first = arr.at(0);",
        },
        {
          code: "const last = arr.at(-1);",
        },
        {
          code: "const item = arr.at(index);",
        },
        {
          code: "const item = arr.at(i + 1);",
        },
        {
          code: "const item = arr.at(getValue());",
        },
        // Valid: Object property access (not array index)
        {
          code: "const prop = obj.prop;",
        },
        {
          code: "const prop = obj['prop'];",
        },
        // Valid: String index access (not numeric)
        {
          code: "const prop = obj['key'];",
        },
      ],
      invalid: [
        // Invalid: Numeric literal index
        {
          code: "const first = arr[0];",
          errors: [
            {
              message: "Use .at(0) instead of [0] for array access",
            },
          ],
          output: "const first = arr.at(0);",
        },
        {
          code: "const second = arr[1];",
          errors: [
            {
              message: "Use .at(1) instead of [1] for array access",
            },
          ],
          output: "const second = arr.at(1);",
        },
        // Invalid: Negative index
        {
          code: "const last = arr[-1];",
          errors: [
            {
              message: "Use .at(-1) instead of [-1] for array access",
            },
          ],
          output: "const last = arr.at(-1);",
        },
        {
          code: "const secondLast = arr[-2];",
          errors: [
            {
              message: "Use .at(-2) instead of [-2] for array access",
            },
          ],
          output: "const secondLast = arr.at(-2);",
        },
        // Invalid: Variable index
        {
          code: "const item = arr[index];",
          errors: [
            {
              message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
            },
          ],
          output: "const item = arr.at(index);",
        },
        {
          code: "const item = arr[i];",
          errors: [
            {
              message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
            },
          ],
          output: "const item = arr.at(i);",
        },
        // Invalid: Expression index
        {
          code: "const item = arr[i + 1];",
          errors: [
            {
              message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
            },
          ],
          output: "const item = arr.at(i + 1);",
        },
        {
          code: "const item = arr[index - 1];",
          errors: [
            {
              message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
            },
          ],
          output: "const item = arr.at(index - 1);",
        },
        // Invalid: Function call index
        {
          code: "const item = arr[getValue()];",
          errors: [
            {
              message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
            },
          ],
          output: "const item = arr.at(getValue());",
        },
        // Invalid: Complex object expressions
        {
          code: "const item = someObject.array[0];",
          errors: [
            {
              message: "Use .at(0) instead of [0] for array access",
            },
          ],
          output: "const item = someObject.array.at(0);",
        },
        {
          code: "const item = getArray()[index];",
          errors: [
            {
              message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
            },
          ],
          output: "const item = getArray().at(index);",
        },
        // Invalid: Nested bracket access
        {
          code: "const item = matrix[0][1];",
          errors: [
            {
              message: "Use .at(0) instead of [0] for array access",
            },
            {
              message: "Use .at(1) instead of [1] for array access",
            },
          ],
          output: "const item = matrix.at(0).at(1);",
        },
      ],
    });
  });
});
