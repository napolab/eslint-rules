import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
	report(descriptor: Rule.ReportDescriptor): void;
}

const rule: Rule.RuleModule = {
	meta: {
		type: "problem",
		docs: {
			description: "Forbid child selectors in Vanilla Extract style definitions",
			recommended: false,
		},
		messages: {
			noChildSelector:
				"Child selector '{{ selector }}' is not allowed in Vanilla Extract. Create a separate style export instead.",
		},
		schema: [],
	},

	create(context: RuleContext): Rule.RuleListener {
		const filename = context.filename;

		// Only check *.css.ts files
		if (!filename.endsWith(".css.ts")) {
			return {};
		}

		// Check if selector contains child elements
		function isChildSelector(selector: string): boolean {
			// Remove the initial & if present
			const cleanSelector = selector.startsWith("&") ? selector.slice(1).trim() : selector.trim();

			// If empty after removing &, it's just & which is fine
			if (!cleanSelector) {
				return false;
			}

			// Check if selector contains only pseudo-elements and pseudo-classes (these are allowed)
			// This includes complex combinations like `:first-child, :nth-child(2), :nth-child(2n + 1)`
			// or `:not(:first-child):not(:nth-child(2))::before`
			if (isPseudoSelectorOnly(cleanSelector)) {
				return false;
			}

			// Check for obvious child selectors that have spaces, combinators, or element names
			if (hasChildSelectorIndicators(cleanSelector)) {
				return true;
			}

			return false;
		}

		// Helper function to check for obvious child selector indicators
		function hasChildSelectorIndicators(selector: string): boolean {
			// If it contains spaces, >, +, ~, it's definitely a child selector
			if (/[\s+>~]/.test(selector)) {
				return true;
			}

			// If it starts with a tag name (letters), class (.), or ID (#), it's a child selector
			// But we need to exclude pseudo-selectors that start with :
			if (/^[A-Za-z]/.test(selector) || /^[#.]/.test(selector)) {
				return true;
			}

			return false;
		}

		// Helper function to check if a selector contains only pseudo-elements and pseudo-classes
		function isPseudoSelectorOnly(selector: string): boolean {
			// Check if selector contains actual element names, class names, or other non-pseudo content
			// This is a more direct approach - if it contains letters/numbers that are not part of pseudo-selectors, it's invalid

			// First, remove all valid pseudo-selector patterns
			let remaining = selector;

			// Remove pseudo-elements (::before, ::after, ::placeholder, etc.)
			remaining = remaining.replace(/::[\w-]+/g, "");

			// Remove pseudo-classes with parameters (including nested ones)
			// This needs to handle nested parentheses like :not(:first-child)
			remaining = removePseudoClassesWithParams(remaining);

			// Remove simple pseudo-classes (:hover, :focus, :disabled, etc.)
			remaining = remaining.replace(/:[\w-]+/g, "");

			// Remove attribute selectors ([disabled], [type="text"], etc.)
			remaining = remaining.replace(/\[[\w-]+[^\]]*]/g, "");

			// Remove whitespace, commas, and ampersands
			remaining = remaining.replace(/[\s&,]/g, "");

			// If nothing remains, it's a pure pseudo-selector
			return remaining === "";
		}

		// Helper function to remove pseudo-classes with parameters, handling nested parentheses
		function removePseudoClassesWithParams(selector: string): string {
			// Use a more robust approach to handle nested parentheses
			// We need to remove complex patterns like :not(&:first-child) entirely
			let result = selector;
			let hasChanges = true;

			while (hasChanges) {
				const beforeProcessing = result;
				// Match pseudo-class functions and their balanced parentheses
				// This handles nested content including & symbols and nested pseudo-classes
				result = result.replace(/:[\w-]+\([^()]*\)/g, "");
				hasChanges = beforeProcessing !== result;
			}

			return result;
		}

		return {
			// Look for selectors object in style() calls
			"CallExpression[callee.name='style'] > ObjectExpression > Property[key.name='selectors'] > ObjectExpression > Property"(
				node: Rule.Node,
			): void {
				if (node.type === "Property" && node.key.type === "Literal" && typeof node.key.value === "string") {
					const selector = node.key.value;

					if (isChildSelector(selector)) {
						context.report({
							node: node.key,
							messageId: "noChildSelector",
							data: { selector },
						});
					}
				}
			},
		};
	},
};

export { rule };
