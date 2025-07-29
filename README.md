# @napolab/eslint-plugin

ESLint plugin for enforcing styling conventions in Next.js + Vanilla Extract projects.

## Installation

```bash
npm install --save-dev @napolab/eslint-plugin typescript
# or
pnpm add -D @napolab/eslint-plugin typescript
# or
yarn add -D @napolab/eslint-plugin typescript
```

### Requirements

- ESLint >= 8.0.0
- TypeScript >= 4.0.0

## Usage

Add the plugin to your ESLint configuration:

```js
// eslint.config.js
import napolabPlugin from "@napolab/eslint-plugin";

export default [
  {
    plugins: {
      "@napolab": napolabPlugin,
    },
    rules: {
      "@napolab/enforce-styling": "error",
      "@napolab/no-container-wrapper-names": "error",
      "@napolab/no-child-selectors": "error",
      "@napolab/max-style-name-words": "error",
      "@napolab/enforce-layout-component-name": "error",
      "@napolab/enforce-page-component-name": "error",
      "@napolab/prefer-array-at": "error",
    },
  },
];
```

## Rules

### Styling Rules

| Rule                                                                     | Description                                                                    | TDD |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | --- |
| [enforce-styling](./docs/rules/enforce-styling.md)                       | Enforce that component files import styles from their corresponding CSS files  | ✅  |
| [no-container-wrapper-names](./docs/rules/no-container-wrapper-names.md) | Forbid generic container/wrapper names in `*.css.ts` files                     | ✅  |
| [no-child-selectors](./docs/rules/no-child-selectors.md)                 | Forbid child selectors in Vanilla Extract style definitions                    | ✅  |
| [max-style-name-words](./docs/rules/max-style-name-words.md)             | Enforce maximum word count in style names to encourage component decomposition | ✅  |

### Code Quality Rules

| Rule                                               | Description                                                                         | TDD |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | --- |
| [prefer-array-at](./docs/rules/prefer-array-at.md) | Enforce using .at() method instead of array bracket notation for accessing elements | ✅  |

### Component Naming Rules

| Rule                                                                           | Description                                                       | TDD |
| ------------------------------------------------------------------------------ | ----------------------------------------------------------------- | --- |
| [enforce-layout-component-name](./docs/rules/enforce-layout-component-name.md) | Enforce that `layout.tsx` files export a component named `Layout` | ✅  |
| [enforce-page-component-name](./docs/rules/enforce-page-component-name.md)     | Enforce that `page.tsx` files export a component named `Page`     | ✅  |

## Philosophy

This plugin enforces consistent styling patterns for Next.js applications using Vanilla Extract:

1. **Flexible Configuration**: Use the `enforce-styling` rule to configure different style patterns for different file types
2. **Consistent Imports**: All style imports use namespace imports (`import * as styles`)
3. **Clear Naming**: Avoid generic names like `container` or `wrapper` in favor of more descriptive names
4. **Component Granularity**: Enforce component decomposition when style names become too complex (3+ words)
5. **Type Safety**: All rules use proper type guards for safe type narrowing

## Development Methodology

This plugin is developed using:

- **TDD (Test-Driven Development)**: All rules follow Red-Green-Refactor cycles
- **KISS Principle**: Keep implementations simple and focused
- **DRY Principle**: Abstracted `enforce-styling` rule to avoid code duplication
- **SOLID Principles**: Single responsibility, open/closed, and other design principles
- **YAGNI Principle**: Only implement what's actually needed

## Example Project Structure

```
src/
├── app/
│   ├── layout.tsx          # imports from ./layout.css
│   ├── layout.css.ts       # layout styles
│   ├── page.tsx           # imports from ./styles.css
│   ├── styles.css.ts      # page styles
│   └── dashboard/
│       ├── layout.tsx     # imports from ./layout.css
│       ├── layout.css.ts  # dashboard layout styles
│       ├── page.tsx       # imports from ./styles.css
│       └── styles.css.ts  # dashboard page styles
└── components/
    └── button/
        ├── index.tsx      # imports from ./styles.css
        └── styles.css.ts  # button component styles
```

## License

MIT

## Contributing

Issues and pull requests are welcome at [GitHub Repository](https://github.com/naporin0624/RISTILL_ANIVERSARY_2025).
