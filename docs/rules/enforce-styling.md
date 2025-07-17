# enforce-styling

Enforce that component files import styles from their corresponding CSS files.

## Rule Details

This rule enforces that component files (page.tsx, layout.tsx, component index.tsx) import styles from their corresponding CSS files using namespace import with the alias 'styles'.

## Options

```typescript
interface StylePattern {
	componentDescription: string;
	expectedImport: string;
	styleFileExtension: string;
	requireRelativeImports?: boolean;
}

interface RuleOptions {
	patterns: StylePattern[];
	requireWhenStylesExist?: boolean;
}
```

- `patterns`: Array of style patterns to check
- `requireWhenStylesExist`: Whether to require import only when style files exist (default: true)

## Examples

### Valid

```typescript
// page.tsx
import * as styles from "./styles.css";

export default function Page() {
  return <div className={styles.root}>Page</div>;
}
```

```typescript
// layout.tsx
import * as styles from "./layout.css";

export default function Layout({ children }) {
  return <div className={styles.root}>{children}</div>;
}
```

```typescript
// components/button/index.tsx
import * as styles from "./styles.css";

export const Button = () => {
  return <button className={styles.button}>Click me</button>;
};
```

### Invalid

```typescript
// Missing import
export default function Page() {
  return <div>Page</div>;
}
```

```typescript
// Incorrect import source
import * as styles from "./other.css";

export default function Page() {
  return <div className={styles.root}>Page</div>;
}
```

```typescript
// Incorrect import type
import styles from "./styles.css";

export default function Page() {
  return <div className={styles.root}>Page</div>;
}
```

```typescript
// Incorrect alias
import * as pageStyles from "./styles.css";

export default function Page() {
  return <div className={pageStyles.root}>Page</div>;
}
```

## Configuration

```javascript
// eslint.config.js
{
  files: ["**/page.tsx"],
  rules: {
    "napo/enforce-styling": [
      "error",
      {
        patterns: [
          {
            componentDescription: "page.tsx",
            expectedImport: "./styles.css",
            styleFileExtension: "styles.css.ts",
          },
        ],
      },
    ],
  },
}
```

## When Not To Use

This rule is specifically designed for projects using Vanilla Extract CSS with a specific file structure. If you're not using this setup, you may want to disable this rule.

## Related Rules

- [no-container-wrapper-names](./no-container-wrapper-names.md)
- [no-child-selectors](./no-child-selectors.md)
- [max-style-name-words](./max-style-name-words.md)
- [enforce-layout-component-name](./enforce-layout-component-name.md)
- [enforce-page-component-name](./enforce-page-component-name.md)
