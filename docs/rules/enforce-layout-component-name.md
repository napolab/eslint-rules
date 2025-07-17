# enforce-layout-component-name

Enforce that layout.tsx files export a component named 'Layout'.

## Rule Details

This rule checks that `layout.tsx` files used in Next.js App Router export a React component with the specific name `Layout`. This ensures consistent naming conventions across the application.

## Examples

### ❌ Incorrect

```tsx
// Wrong component name
export default function RootLayout({ children }) {
	return <div>{children}</div>;
}
```

```tsx
// Wrong component name in named export
export function MyLayout({ children }) {
	return <div>{children}</div>;
}
```

```tsx
// Wrong component name with arrow function
const AppLayout = ({ children }) => {
	return <div>{children}</div>;
};
export default AppLayout;
```

```tsx
// Wrong component name in export specifier
export { RootLayout } from "./shared-layout";
```

```tsx
// No component export
const someUtility = () => {};
export { someUtility };
```

### ✅ Correct

```tsx
// Default export with function declaration
export default function Layout({ children }) {
	return <div>{children}</div>;
}
```

```tsx
// Named export
export function Layout({ children }) {
	return <div>{children}</div>;
}
```

```tsx
// Arrow function with default export
const Layout = ({ children }) => {
	return <div>{children}</div>;
};
export default Layout;
```

```tsx
// Arrow function with named export
export const Layout = ({ children }) => {
	return <div>{children}</div>;
};
```

```tsx
// Export specifier
function Layout({ children }) {
	return <div>{children}</div>;
}
export { Layout };
```

```tsx
// Re-export from another file
export { Layout } from "./shared-layout";
```

```tsx
// Re-export as default
export { Layout as default } from "./shared-layout";
```

## Options

This rule has no options.

## When To Use It

- You are using Next.js App Router
- You want to enforce consistent component naming across your application
- You want to make it clear which component is the layout component

## Benefits

- **Consistency**: All layout files have the same component name
- **Clarity**: Easy to identify the layout component in any file
- **Refactoring**: Easier to move or rename layout files without confusion
- **Convention**: Follows Next.js community conventions

## Related Rules

- [enforce-page-component-name](./enforce-page-component-name.md)
- [enforce-styling](./enforce-styling.md)
