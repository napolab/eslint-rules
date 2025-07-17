# no-container-wrapper-names

Forbid `container`, `wrapper`, `xxxContainer`, `xxxWrapper` patterns in \*.css.ts files. Suggest using `root` or `xxxRoot` naming instead.

## Rule Details

This rule enforces naming conventions for Vanilla Extract styles to maintain consistency and clarity in CSS module exports. It specifically targets `.css.ts` files and promotes the use of `root` naming pattern over generic container/wrapper names.

### Special Case: createContainer

When using `createContainer` from `@vanilla-extract/css`, the variable name MUST end with `Container`. This is the only exception where `Container` suffix is required.

## Examples

### ❌ Incorrect

```ts
// Exact banned names
export const container = style({ ... });
export const wrapper = style({ ... });

// Banned patterns
export const headerContainer = style({ ... });
export const contentWrapper = style({ ... });
export const mainContainer = style({ ... });

// createContainer without Container suffix
import { createContainer } from "@vanilla-extract/css";
export const theme = createContainer();
export const appRoot = createContainer();
```

### ✅ Correct

```ts
// Root element naming
export const root = style({ ... });

// Sub-container naming with Root suffix
export const headerRoot = style({ ... });
export const contentRoot = style({ ... });
export const sidebarRoot = style({ ... });

// Other descriptive names
export const header = style({ ... });
export const content = style({ ... });
export const sidebar = style({ ... });

// createContainer with required Container suffix
import { createContainer } from "@vanilla-extract/css";
export const themeContainer = createContainer();
export const appContainer = createContainer();
```

## Options

This rule has no options.

## When To Use It

- You are using Vanilla Extract for CSS-in-JS
- You want to maintain consistent naming conventions
- You want to avoid generic container/wrapper names that don't convey meaning
- You want to enforce specific patterns for `createContainer` usage

## Rationale

Generic names like `container` and `wrapper` don't provide meaningful context about what they contain or wrap. Using `root` for the main element and `xxxRoot` for sub-containers creates a clearer hierarchy and makes the code more self-documenting.

The exception for `createContainer` exists because it's a Vanilla Extract API that specifically creates container contexts for CSS variables, where the `Container` suffix clearly indicates its special purpose.

## Related Rules

- [enforce-styling](./enforce-styling.md)
