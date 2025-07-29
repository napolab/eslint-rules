import { RuleTester } from "eslint";
import * as typescriptEslint from "typescript-eslint";
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

const ruleTesterTS = new RuleTester({
  languageOptions: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parser: typescriptEslint.parser as any,
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      project: "./tsconfig.json",
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

  it("should use TypeScript type information to distinguish arrays from objects", () => {
    expect(() => {
      ruleTesterTS.run("prefer-array-at with TypeScript", rule, {
        valid: [
          // Valid: Object with numeric key (should NOT be flagged)
          {
            code: `
            interface User {
              [id: number]: string;
            }
            const user: User = { 0: "John", 1: "Jane" };
            const name = user[0];
          `,
            filename: "test.ts",
          },
          {
            code: `
            const obj: Record<number, string> = { 0: "value" };
            const value = obj[0];
          `,
            filename: "test.ts",
          },
          {
            code: `
            type Config = { [key: number]: string };
            const config: Config = {};
            const item = config[1];
          `,
            filename: "test.ts",
          },
          // Valid: String key access should remain valid
          {
            code: `
            const obj: Record<string, number> = { key: 1 };
            const value = obj["key"];
          `,
            filename: "test.ts",
          },
          // Valid: Using .at() method on arrays
          {
            code: `
            const arr: number[] = [1, 2, 3];
            const first = arr.at(0);
          `,
            filename: "test.ts",
          },
        ],
        invalid: [
          // Invalid: Array access should be flagged
          {
            code: `
            const arr: number[] = [1, 2, 3];
            const item = arr[0];
          `,
            filename: "test.ts",
            errors: [
              {
                message: "Use .at(0) instead of [0] for array access",
              },
            ],
            output: `
            const arr: number[] = [1, 2, 3];
            const item = arr.at(0);
          `,
          },
          {
            code: `
            const strings: string[] = ["a", "b", "c"];
            const last = strings[-1];
          `,
            filename: "test.ts",
            errors: [
              {
                message: "Use .at(-1) instead of [-1] for array access",
              },
            ],
            output: `
            const strings: string[] = ["a", "b", "c"];
            const last = strings.at(-1);
          `,
          },
          // Invalid: Array-like types
          {
            code: `
            const arr: Array<string> = ["a", "b"];
            const item = arr[index];
          `,
            filename: "test.ts",
            errors: [
              {
                message: "Use .at({{expression}}) instead of [{{expression}}] for array access",
              },
            ],
            output: `
            const arr: Array<string> = ["a", "b"];
            const item = arr.at(index);
          `,
          },
          // Invalid: ReadonlyArray
          {
            code: `
            const arr: ReadonlyArray<number> = [1, 2, 3];
            const item = arr[0];
          `,
            filename: "test.ts",
            errors: [
              {
                message: "Use .at(0) instead of [0] for array access",
              },
            ],
            output: `
            const arr: ReadonlyArray<number> = [1, 2, 3];
            const item = arr.at(0);
          `,
          },
          // Invalid: Tuple types
          {
            code: `
            const tuple: [string, number] = ["hello", 42];
            const first = tuple[0];
          `,
            filename: "test.ts",
            errors: [
              {
                message: "Use .at(0) instead of [0] for array access",
              },
            ],
            output: `
            const tuple: [string, number] = ["hello", 42];
            const first = tuple.at(0);
          `,
          },
          // Invalid: Array methods that return arrays
          {
            code: `
            const arr = [1, 2, 3].filter(x => x > 1);
            const item = arr[0];
          `,
            filename: "test.ts",
            errors: [
              {
                message: "Use .at(0) instead of [0] for array access",
              },
            ],
            output: `
            const arr = [1, 2, 3].filter(x => x > 1);
            const item = arr.at(0);
          `,
          },
        ],
      });
    }).not.toThrow();
  });
});
