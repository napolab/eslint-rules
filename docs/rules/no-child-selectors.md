# no-child-selectors

Forbid child selectors in Vanilla Extract style definitions.

## Rule Details

Vanilla Extract has strict limitations on selectors usage. This rule enforces that you cannot use child selectors (like `& h3`, `& p`, `& .child-class`) within the `selectors` object of a style definition. Instead, you should create separate style exports for each element.

## Examples

### ❌ Incorrect

```typescript
import { style } from "@vanilla-extract/css";

// Don't use child selectors in selectors object
export const card = style({
	selectors: {
		"& h3": { fontSize: "1.5rem" }, // ERROR: Invalid selector
		"& p": { color: "#333" }, // ERROR: Invalid selector
		"& .child-class": { margin: "1rem" }, // ERROR: Invalid selector
	},
});

// Multiple child selectors
export const nav = style({
	selectors: {
		"& > li": { display: "inline-block" }, // ERROR: Direct child selector
		"& a": { textDecoration: "none" }, // ERROR: Descendant selector
		"&:hover": { background: "#eee" }, // OK: Pseudo-selector
	},
});

// Complex selectors
export const article = style({
	selectors: {
		"& h1, & h2": { fontWeight: "bold" }, // ERROR: Multiple element selectors
		"& p + p": { marginTop: "1rem" }, // ERROR: Adjacent sibling selector
	},
});

// Attribute selectors on child elements
export const form = style({
	selectors: {
		"& input[type='text']": { border: "1px solid #ccc" }, // ERROR: Child element with attribute
		"& *": { boxSizing: "border-box" }, // ERROR: Universal selector
	},
});
```

### ✅ Correct

```typescript
import { style } from "@vanilla-extract/css";

// Create separate styles for each element
export const card = style({
	padding: "1rem",
	background: "white",
});

export const cardTitle = style({
	fontSize: "1.5rem",
	color: "#333",
	marginBottom: "1rem",
});

export const cardText = style({
	color: "#666",
	lineHeight: 1.6,
});

// Allowed selectors (pseudo-selectors and attribute selectors on the element itself)
export const button = style({
	selectors: {
		"&:hover": { backgroundColor: "#blue" }, // ✅ Pseudo-selectors OK
		"&:focus": { outline: "2px solid #blue" }, // ✅ Pseudo-selectors OK
		"&[disabled]": { opacity: 0.5 }, // ✅ Attribute selectors OK
		"&:nth-child(2)": { marginTop: "1rem" }, // ✅ Structural pseudo-selectors OK
		"&::placeholder": { color: "#999" }, // ✅ Pseudo-elements OK
	},
});
```

### Using in Components

```tsx
// Instead of using child selectors, apply styles directly to elements
import * as styles from "./styles.css";

export const Card = ({ title, content }) => (
	<div className={styles.card}>
		<h3 className={styles.cardTitle}>{title}</h3>
		<p className={styles.cardText}>{content}</p>
	</div>
);
```

## Options

This rule has no options.

## When To Use It

- You are using Vanilla Extract for CSS-in-JS
- You want to enforce Vanilla Extract's best practices
- You want to avoid runtime errors from invalid selectors

## Benefits

- **Performance**: Individual style exports are more performant than complex selectors
- **Maintainability**: Explicit style application makes it easier to understand which styles apply to which elements
- **Type Safety**: Each style export can be properly typed
- **Refactoring**: Easier to move or rename styles when they're explicitly applied

## Related Rules

- [no-container-wrapper-names](./no-container-wrapper-names.md)
- [enforce-styling](./enforce-styling.md)
