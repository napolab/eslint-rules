# require-useeffect-comment

Require comment for useEffect usage to explain why the side effect is necessary.

## Rule Details

This rule enforces that all `useEffect` hooks must have a meaningful comment explaining why the side effect is necessary. This helps maintain code quality and ensures that side effects are used appropriately.

### Why This Rule Exists

Based on the project's coding conventions, `useEffect` should only be used for actual side effects, not for state initialization or derived state. This rule ensures that developers document their reasoning for using `useEffect`.

## Examples

### ✅ Valid

```typescript
// useEffect with required comment
useEffect(() => {
	// REQUIRED COMMENT: Setting up WebSocket connection for real-time updates
	const socket = new WebSocket(url);
	return () => socket.close();
}, []);

// useEffect with proper comment explaining necessity
useEffect(() => {
	// This is needed for DOM manipulation that cannot be achieved through React patterns
	document.title = "New Title";
}, []);
```

### ❌ Invalid

```typescript
// useEffect without comment
useEffect(() => {
	const socket = new WebSocket(url);
	return () => socket.close();
}, []);

// useEffect with empty comment
useEffect(() => {
	//
	const socket = new WebSocket(url);
	return () => socket.close();
}, []);

// useEffect with insufficient comment
useEffect(() => {
	// setup
	const socket = new WebSocket(url);
	return () => socket.close();
}, []);
```

## When to Use useEffect (According to Project Conventions)

- DOM manipulation that cannot be achieved through React patterns
- Setting up external subscriptions (WebSocket, EventSource, etc.)
- Cleanup of external resources
- Integration with non-React libraries that require imperative APIs

## When NOT to Use useEffect

- State initialization (use `useState` with lazy initialization instead)
- Derived state (use `useMemo` or direct calculation instead)

## Alternative Patterns

```typescript
// ❌ Don't use useEffect for state initialization
useEffect(() => {
	setData(calculateInitialData());
}, []);

// ✅ Use useState with lazy initialization
const [data] = useState(() => calculateInitialData());

// ❌ Don't use useEffect for derived state
useEffect(() => {
	setFilteredItems(items.filter((item) => item.active));
}, [items]);

// ✅ Use useMemo or direct calculation
const filteredItems = useMemo(() => items.filter((item) => item.active), [items]);
```

## Configuration

This rule has no configuration options.

## Version

This rule was introduced in version 1.0.0 of the ESLint rules package.
