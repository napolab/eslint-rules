# enforce-page-component-name

Enforce that page.tsx files export a component named 'Page'.

## Rule Details

This rule checks that `page.tsx` files used in Next.js App Router export a React component with the specific name `Page`. This ensures consistent naming conventions across the application.

## Examples

### ❌ Incorrect

```tsx
// Wrong component name
export default function HomePage() {
	return <div>Hello</div>;
}
```

```tsx
// Wrong component name in named export
export function MyPage() {
	return <div>Hello</div>;
}
```

```tsx
// Wrong component name with arrow function
const DashboardPage = () => {
	return <div>Hello</div>;
};
export default DashboardPage;
```

```tsx
// Wrong component name in export specifier
export { HomePage } from "./shared-page";
```

```tsx
// No component export
const someUtility = () => {};
export { someUtility };
```

### ✅ Correct

```tsx
// Default export with function declaration
export default function Page() {
	return <div>Hello</div>;
}
```

```tsx
// Named export
export function Page() {
	return <div>Hello</div>;
}
```

```tsx
// Arrow function with default export
const Page = () => {
	return <div>Hello</div>;
};
export default Page;
```

```tsx
// Arrow function with named export
export const Page = () => {
	return <div>Hello</div>;
};
```

```tsx
// Export specifier
function Page() {
	return <div>Hello</div>;
}
export { Page };
```

```tsx
// Re-export from another file
export { Page } from "./shared-page";
```

```tsx
// Re-export as default
export { Page as default } from "./shared-page";
```

## Options

This rule has no options.

## When To Use It

- You are using Next.js App Router
- You want to enforce consistent component naming across your application
- You want to make it clear which component is the page component

## Benefits

- **Consistency**: All page files have the same component name
- **Clarity**: Easy to identify the page component in any file
- **Refactoring**: Easier to move or rename page files without confusion
- **Convention**: Follows Next.js community conventions

## Related Rules

- [enforce-layout-component-name](./enforce-layout-component-name.md)
- [enforce-styling](./enforce-styling.md)
