# prefer-array-at

Enforce using .at() method instead of array bracket notation for accessing array elements.

## Rule Details

This rule enforces using the modern `.at()` method instead of traditional bracket notation for array element access. The `.at()` method is more readable and provides consistent behavior for both positive and negative indices.

**TypeScript Support**: This rule uses TypeScript type information when available to accurately distinguish between arrays and objects, preventing false positives on object property access with numeric keys.

## Examples

### Valid

```typescript
// Using .at() method
const first = arr.at(0);
const last = arr.at(-1);
const item = arr.at(index);
const item = arr.at(i + 1);
const item = arr.at(getValue());

// Object property access (not array index)
const prop = obj.prop;
const prop = obj["prop"];
const prop = obj["key"];

// TypeScript: Object with numeric keys (NOT flagged)
interface User {
  [id: number]: string;
}
const user: User = { 0: "John", 1: "Jane" };
const name = user[0]; // Valid - object property access

const obj: Record<number, string> = { 0: "value" };
const value = obj[0]; // Valid - object property access

type Config = { [key: number]: string };
const config: Config = {};
const item = config[1]; // Valid - object property access
```

### Invalid

```typescript
// TypeScript: Array types (FLAGGED)
const arr: number[] = [1, 2, 3];
const first = arr[0];
// → const first = arr.at(0);

const strings: string[] = ["a", "b", "c"];
const last = strings[-1];
// → const last = strings.at(-1);

// Array<T> syntax
const arr2: Array<string> = ["a", "b"];
const item = arr2[index];
// → const item = arr2.at(index);

// ReadonlyArray<T>
const arr3: ReadonlyArray<number> = [1, 2, 3];
const item2 = arr3[0];
// → const item2 = arr3.at(0);

// Tuple types
const tuple: [string, number] = ["hello", 42];
const first = tuple[0];
// → const first = tuple.at(0);

// Array method chains
const filtered = [1, 2, 3].filter((x) => x > 1);
const item3 = filtered[0];
// → const item3 = filtered.at(0);

// Traditional JavaScript arrays (when TypeScript not available)
const second = arr[1];
// → const second = arr.at(1);

// Negative index
const last2 = arr[-1];
// → const last2 = arr.at(-1);

// Variable index
const item4 = arr[index];
// → const item4 = arr.at(index);

// Expression index
const item5 = arr[i + 1];
// → const item5 = arr.at(i + 1);

// Function call index
const item6 = arr[getValue()];
// → const item6 = arr.at(getValue());

// Complex expressions
const item7 = someObject.array[0];
// → const item7 = someObject.array.at(0);

const item8 = getArray()[index];
// → const item8 = getArray().at(index);

// Nested bracket access
const item9 = matrix[0][1];
// → const item9 = matrix.at(0).at(1);
```

## Configuration

```javascript
// eslint.config.js
{
  rules: {
    "@napolab/prefer-array-at": "error", // cspell:disable-line
  },
}
```

## TypeScript Integration

When used with TypeScript projects (using `@typescript-eslint/parser`), this rule leverages type information to provide more accurate detection:

- **Arrays**: `T[]`, `Array<T>`, `ReadonlyArray<T>`, tuple types `[T, U]` are flagged
- **Objects**: `Record<number, T>`, `{[key: number]: T}`, interface with numeric index signatures are **NOT** flagged
- **Fallback**: When TypeScript is not available, uses heuristic detection based on variable names and method chains

## Parser Configuration

For TypeScript support, ensure you're using `@typescript-eslint/parser`:

```javascript
// eslint.config.js
import typescriptEslint from "typescript-eslint";

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: typescriptEslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "@napolab/prefer-array-at": "error", // cspell:disable-line
    },
  },
];
```

## When Not To Use

This rule is helpful for modern JavaScript environments that support the `.at()` method (ES2022+). If you're targeting older environments without `.at()` support, you may want to disable this rule.

## Benefits

- **Consistent syntax**: `.at()` works consistently for both positive and negative indices
- **Improved readability**: More explicit than bracket notation
- **Better semantics**: Clearly indicates array element access vs. object property access
- **Negative index support**: `.at(-1)` is clearer than `arr[arr.length - 1]`
- **Type-aware detection**: When using TypeScript, accurately distinguishes arrays from objects with numeric keys
- **No false positives**: Object property access with numeric keys is correctly ignored

## Related Rules

- [no-child-selectors](./no-child-selectors.md)
- [max-style-name-words](./max-style-name-words.md)
