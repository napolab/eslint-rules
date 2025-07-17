import type { Rule } from "eslint";
import type { Identifier } from "estree";

interface RuleContext extends Rule.RuleContext {
	report(descriptor: Rule.ReportDescriptor): void;
}

const rule: Rule.RuleModule = {
	meta: {
		type: "suggestion",
		docs: {
			description:
				"Forbid `container`, `wrapper`, `xxxContainer`, `xxxWrapper` patterns in *.css.ts files. Suggest using `root` or `xxxRoot` naming instead. For createContainer usage, enforce xxxContainer naming.",
			recommended: false,
		},
		schema: [],
		messages: {
			bannedExactName: 'Variable name "{{name}}" is banned in *.css.ts files. Use "root" or "{{suggestion}}".',
			bannedPattern:
				'Variable name "{{name}}" contains banned pattern "{{pattern}}" in *.css.ts files. Use "{{suggestion}}" instead.',
			requireContainerSuffix:
				'Variable name "{{name}}" using createContainer must end with "Container". Use "{{suggestion}}" instead.',
		},
	},

	create(context: RuleContext): Rule.RuleListener {
		const filename = context.filename;

		// Only apply to *.css.ts files
		if (!filename.endsWith(".css.ts")) {
			return {};
		}

		const BANNED_EXACT = new Set(["container", "wrapper"]);
		const BANNED_PATTERNS = [
			{ pattern: /Container$/, name: "Container" },
			{ pattern: /Wrapper$/, name: "Wrapper" },
		];

		// Track whether createContainer is imported
		let hasCreateContainerImport = false;
		// Track variables that use createContainer
		const createContainerVariables = new Set<string>();

		function getSuggestion(name: string): string {
			// If it's exactly container or wrapper, suggest root
			if (BANNED_EXACT.has(name)) {
				return "root";
			}

			// If it ends with Container or Wrapper, suggest replacing with Root
			if (name.endsWith("Container")) {
				return name.replace(/Container$/, "Root");
			}
			if (name.endsWith("Wrapper")) {
				return name.replace(/Wrapper$/, "Root");
			}

			// For other cases, suggest adding Root suffix
			return `${name}Root`;
		}

		function getContainerSuggestion(name: string): string {
			// If name already ends with Container, return as is
			if (name.endsWith("Container")) {
				return name;
			}
			// If name ends with Root, replace with Container
			if (name.endsWith("Root")) {
				return name.replace(/Root$/, "Container");
			}
			// Otherwise, add Container suffix

			return `${name}Container`;
		}

		function checkIdentifier(node: Identifier, isCreateContainer: boolean): void {
			const { name } = node;

			// If this is a createContainer usage
			if (isCreateContainer) {
				// Must end with Container
				if (!name.endsWith("Container")) {
					context.report({
						node,
						messageId: "requireContainerSuffix",
						data: {
							name,
							suggestion: getContainerSuggestion(name),
						},
					});
				}

				return;
			}

			// Check for exact banned names
			if (BANNED_EXACT.has(name)) {
				context.report({
					node,
					messageId: "bannedExactName",
					data: {
						name,
						suggestion: getSuggestion(name),
					},
				});

				return;
			}

			// Check for banned patterns (xxxContainer, xxxWrapper)
			for (const { pattern, name: patternName } of BANNED_PATTERNS) {
				if (pattern.test(name)) {
					context.report({
						node,
						messageId: "bannedPattern",
						data: {
							name,
							pattern: patternName,
							suggestion: getSuggestion(name),
						},
					});

					return;
				}
			}
		}

		return {
			// Track createContainer imports
			ImportDeclaration(node: Rule.Node): void {
				if (node.type === "ImportDeclaration" && node.source.value === "@vanilla-extract/css") {
					const specifiers = node.specifiers;
					for (const specifier of specifiers) {
						if (
							specifier.type === "ImportSpecifier" &&
							specifier.imported.type === "Identifier" &&
							specifier.imported.name === "createContainer"
						) {
							hasCreateContainerImport = true;
							break;
						}
					}
				}
			},

			// Only check exported const declarations
			"ExportNamedDeclaration > VariableDeclaration > VariableDeclarator"(node: Rule.Node): void {
				if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
					// Check if this is a createContainer call
					let isCreateContainer = false;
					if (
						hasCreateContainerImport &&
						node.init &&
						node.init.type === "CallExpression" &&
						node.init.callee.type === "Identifier" &&
						node.init.callee.name === "createContainer"
					) {
						isCreateContainer = true;
						createContainerVariables.add(node.id.name);
					}

					checkIdentifier(node.id, isCreateContainer);
				}
			},
		};
	},
};

export { rule };
