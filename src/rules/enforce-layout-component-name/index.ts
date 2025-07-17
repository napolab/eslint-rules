import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
	report(descriptor: Rule.ReportDescriptor): void;
}

interface IdentifierNode extends Rule.Node {
	type: "Identifier";
	name: string;
}

interface FunctionDeclarationNode extends Rule.Node {
	type: "FunctionDeclaration";
	id: IdentifierNode;
}

const rule: Rule.RuleModule = {
	meta: {
		type: "problem",
		docs: {
			description: "Enforce that layout.tsx files export a component named 'Layout'",
			recommended: false,
		},
		messages: {
			incorrectName: "layout.tsx must export a component named 'Layout' (found '{{ name }}')",
			missingExport: "layout.tsx must export a component named 'Layout'",
		},
		schema: [],
	},

	create(context: RuleContext): Rule.RuleListener {
		const filename = context.filename;

		// Type guard functions
		function isIdentifierNode(node: Rule.Node): node is IdentifierNode {
			return node.type === "Identifier" && "name" in node;
		}

		function isFunctionDeclarationNode(node: Rule.Node): node is FunctionDeclarationNode {
			return node.type === "FunctionDeclaration" && Boolean(node.id) && isIdentifierNode(node.id);
		}

		let hasLayoutExport = false;
		const exportedNames: string[] = [];

		return {
			// Check default export function declarations
			"ExportDefaultDeclaration > FunctionDeclaration[id.name]"(node: Rule.Node): void {
				if (isFunctionDeclarationNode(node)) {
					const name = node.id.name;
					exportedNames.push(name);
					if (name === "Layout") {
						hasLayoutExport = true;
					}
				}
			},

			// Check default export identifiers
			"ExportDefaultDeclaration > Identifier"(node: Rule.Node): void {
				if (isIdentifierNode(node)) {
					const name = node.name;
					exportedNames.push(name);
					if (name === "Layout") {
						hasLayoutExport = true;
					}
				}
			},

			// Check named export function declarations
			"ExportNamedDeclaration > FunctionDeclaration[id.name]"(node: Rule.Node): void {
				if (isFunctionDeclarationNode(node)) {
					const name = node.id.name;
					exportedNames.push(name);
					if (name === "Layout") {
						hasLayoutExport = true;
					}
				}
			},

			// Check named export variable declarations
			"ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name]"(node: Rule.Node): void {
				if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
					const name = node.id.name;
					exportedNames.push(name);
					if (name === "Layout") {
						hasLayoutExport = true;
					}
				}
			},

			// Check export specifiers (export { Layout })
			"ExportNamedDeclaration > ExportSpecifier"(node: Rule.Node): void {
				if (node.type === "ExportSpecifier") {
					const exportedName = node.exported.type === "Identifier" ? node.exported.name : null;
					const localName = node.local.type === "Identifier" ? node.local.name : null;

					// Check if exporting as Layout (export { Something as Layout })
					if (exportedName === "Layout") {
						hasLayoutExport = true;
					}
					// Check if exporting Layout with same name (export { Layout })
					else if (localName === "Layout" && exportedName === localName) {
						hasLayoutExport = true;
					}
					// Check if exporting as default (export { Something as default })
					else if (exportedName === "default" && localName !== null) {
						exportedNames.push(localName);
						if (localName === "Layout") {
							hasLayoutExport = true;
						}
					}
					// Regular named export
					else if (localName !== null) {
						exportedNames.push(localName);
						if (localName === "Layout") {
							hasLayoutExport = true;
						}
					}
				}
			},

			"Program:exit"(): void {
				if (!hasLayoutExport) {
					// Find the first exported name that looks like a component (starts with uppercase)
					const componentName = exportedNames.find((name) => /^[A-Z]/.test(name));

					if (componentName !== undefined && componentName !== "Layout") {
						context.report({
							loc: { line: 1, column: 0 },
							messageId: "incorrectName",
							data: { name: componentName },
						});
					} else {
						context.report({
							loc: { line: 1, column: 0 },
							messageId: "missingExport",
						});
					}
				}
			},
		};
	},
};

export { rule };
