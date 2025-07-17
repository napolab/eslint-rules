# prefer-array-at

Enforce using .at() method instead of array bracket notation for accessing array elements.

## Rule Details

This rule enforces using the modern `.at()` method instead of traditional bracket notation for array element access. The `.at()` method is more readable and provides consistent behavior for both positive and negative indices.

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
```

### Invalid

```typescript
// Numeric literal index
const first = arr[0];
// → const first = arr.at(0);

const second = arr[1];
// → const second = arr.at(1);

// Negative index
const last = arr[-1];
// → const last = arr.at(-1);

const secondLast = arr[-2];
// → const secondLast = arr.at(-2);

// Variable index
const item = arr[index];
// → const item = arr.at(index);

const item = arr[i];
// → const item = arr.at(i);

// Expression index
const item = arr[i + 1];
// → const item = arr.at(i + 1);

const item = arr[index - 1];
// → const item = arr.at(index - 1);

// Function call index
const item = arr[getValue()];
// → const item = arr.at(getValue());

// Complex object expressions
const item = someObject.array[0];
// → const item = someObject.array.at(0);

const item = getArray()[index];
// → const item = getArray().at(index);

// Nested bracket access
const item = matrix[0][1];
// → const item = matrix.at(0).at(1);
```

## Configuration

```javascript
// eslint.config.js
{
  rules: {
    "@napolab/prefer-array-at": "error",
  },
}
```

## When Not To Use

This rule is helpful for modern JavaScript environments that support the `.at()` method (ES2022+). If you're targeting older environments without `.at()` support, you may want to disable this rule.

## Benefits

- **Consistent syntax**: `.at()` works consistently for both positive and negative indices
- **Improved readability**: More explicit than bracket notation
- **Better semantics**: Clearly indicates array element access vs. object property access
- **Negative index support**: `.at(-1)` is clearer than `arr[arr.length - 1]`

## Related Rules

- [no-child-selectors](./no-child-selectors.md)
- [max-style-name-words](./max-style-name-words.md)
