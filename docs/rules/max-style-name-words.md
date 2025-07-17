# max-style-name-words

Enforce maximum word count in style names to encourage component decomposition.

## Rule Details

When style names in `*.css.ts` files become too long (3 or more words by default), it's a strong indicator that the component is too large and should be broken down into smaller, more manageable subcomponents. This rule helps maintain component granularity by flagging overly complex style names.

The word count threshold is configurable via the `maxWords` option (default: 3).

**Implementation Notes:**

- Follows TDD (Test-Driven Development) methodology with Red-Green-Refactor cycles
- Adheres to KISS, DRY, SOLID, and YAGNI design principles
- Uses proper type guards instead of unsafe type assertions
- Implements Single Responsibility Principle with focused functions

## Examples

### ❌ Incorrect

```typescript
// styles.css.ts with complex naming indicates oversized component
export const messageWallTitle = style({
  fontSize: "1.5rem",
});

export const messageWallContainer = style({
  padding: "1rem",
});

export const messageWallItemIcon = style({
  width: "24px",
});

export const messageWallItemText = style({
  color: "#333",
});

export const messageWallItemTimestamp = style({
  fontSize: "0.8rem",
});

// Even more complex names
export const userProfileCardHeaderTitle = style({
  fontWeight: "bold",
});

export const navigationMenuItemIconWrapper = style({
  display: "inline-flex",
});
```

### ✅ Correct

```typescript
// Each component has simple, focused style names
export const root = style({
  padding: "1rem",
});

export const title = style({
  fontSize: "2rem",
});

// Two-word names are acceptable
export const submitButton = style({
  backgroundColor: "blue",
});

export const headerRoot = style({
  display: "flex",
});

export const darkTheme = style({
  background: "#000",
});
```

### Refactoring Example

Instead of having complex style names in a single file, break the component into subcomponents:

#### Before (Bad)

```
components/message-form/
├── index.tsx
└── styles.css.ts         # Contains messageWallTitle, messageWallItemIcon, etc.
```

#### After (Good)

```
components/message-form/
├── index.tsx                    # Main MessageForm component
├── styles.css.ts               # Main component styles only
├── message-form.test.tsx       # Main component tests
├── message-wall/               # Subcomponent directory
│   ├── index.tsx              # MessageWall component
│   ├── styles.css.ts          # MessageWall specific styles
│   └── message-wall.test.tsx  # MessageWall tests
└── message-item/              # Subcomponent directory
    ├── index.tsx              # MessageItem component
    ├── styles.css.ts          # MessageItem specific styles
    └── message-item.test.tsx  # MessageItem tests
```

#### Refactored Styles

```typescript
// components/message-form/styles.css.ts
export const root = style({
  /* ... */
});
export const form = style({
  /* ... */
});
export const input = style({
  /* ... */
});

// components/message-form/message-wall/styles.css.ts
export const root = style({
  /* ... */
});
export const title = style({
  /* ... */
});
export const list = style({
  /* ... */
});

// components/message-form/message-item/styles.css.ts
export const root = style({
  /* ... */
});
export const icon = style({
  /* ... */
});
export const text = style({
  /* ... */
});
export const timestamp = style({
  /* ... */
});
```

## Options

This rule accepts an options object with the following properties:

- `maxWords` (default: `3`) - Maximum number of words allowed in style names before triggering a warning

### Schema

```json
{
  "type": "object",
  "properties": {
    "maxWords": {
      "type": "integer",
      "minimum": 1,
      "default": 3
    }
  },
  "additionalProperties": false
}
```

### Configuration Examples

#### Default Configuration

```json
{
  "rules": {
    "@/max-style-name-words": "error"
  }
}
```

This will flag style names with 3 or more words.

#### Custom Configuration

```json
{
  "rules": {
    "@/max-style-name-words": ["error", { "maxWords": 4 }]
  }
}
```

This will flag style names with 4 or more words.

#### Strict Configuration

```json
{
  "rules": {
    "@/max-style-name-words": ["error", { "maxWords": 2 }]
  }
}
```

This will flag style names with 2 or more words, enforcing very strict component decomposition.

### Examples with Different Options

#### With `maxWords: 4`

```typescript
// ✅ Valid - 3 words are allowed
export const messageWallTitle = style({
  fontSize: "1.5rem",
});

export const messageWallContainer = style({
  padding: "1rem",
});

// ❌ Invalid - 4 words trigger warning
export const messageWallItemIcon = style({
  width: "24px",
});
```

#### With `maxWords: 2`

```typescript
// ✅ Valid - single word
export const root = style({
  padding: "1rem",
});

// ❌ Invalid - 2 words trigger warning
export const submitButton = style({
  backgroundColor: "blue",
});
```

## When To Use It

- You want to maintain small, focused components
- You want to enforce component decomposition best practices
- You want to prevent components from becoming too complex
- You're following TDD methodology and want to ensure code quality

## Benefits

- **Maintainability**: Smaller components are easier to understand and maintain
- **Reusability**: Well-decomposed components are more likely to be reusable
- **Testing**: Smaller components are easier to test in isolation
- **Performance**: Smaller components can lead to better code splitting
- **Clarity**: Simple style names make the component structure more obvious
- **Type Safety**: Uses proper type guards for safe type narrowing

## Component Structure Rules

1. **Too many words in style names** = Component needs breaking down (configurable threshold)
2. **Subcomponent directory structure**: `components/parent/child/`
3. **Required files in each subcomponent**:
   - `index.tsx` - Component implementation
   - `styles.css.ts` - Component-specific styles
   - `<component-name>.test.tsx` - Component tests
4. **Style naming**: Each subcomponent starts fresh with `root`, `title`, etc.
5. **Import pattern**: Parent imports subcomponents from their directories

## Related Rules

- [enforce-styling](./enforce-styling.md)
- [no-container-wrapper-names](./no-container-wrapper-names.md)
