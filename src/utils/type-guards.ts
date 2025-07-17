import type { Rule } from "eslint";

/**
 * Type guard for checking if a node is an Identifier with a name property
 */
export function isIdentifierNode(node: Rule.Node): node is Rule.Node & { type: "Identifier"; name: string } {
	return node.type === "Identifier" && "name" in node;
}

/**
 * Type guard for checking if a node is a FunctionDeclaration with an Identifier id
 */
export function isFunctionDeclarationWithId(node: Rule.Node): node is Rule.Node & {
	type: "FunctionDeclaration";
	id: Rule.Node & { type: "Identifier"; name: string };
} {
	return node.type === "FunctionDeclaration" && Boolean(node.id) && isIdentifierNode(node.id);
}

/**
 * Type guard for checking if a node is a VariableDeclarator with an Identifier id
 */
export function isVariableDeclaratorWithId(node: Rule.Node): node is Rule.Node & {
	type: "VariableDeclarator";
	id: Rule.Node & { type: "Identifier"; name: string };
} {
	return node.type === "VariableDeclarator" && Boolean(node.id) && isIdentifierNode(node.id);
}

/**
 * Type guard for checking if a node is an ExportSpecifier with an Identifier local
 */
export function isExportSpecifierWithLocal(node: Rule.Node): node is Rule.Node & {
	type: "ExportSpecifier";
	local: Rule.Node & { type: "Identifier"; name: string };
} {
	return node.type === "ExportSpecifier" && Boolean(node.local) && isIdentifierNode(node.local);
}

/**
 * Type guard for checking if a node has a parent property
 */
export function hasParent(node: unknown): node is { parent?: Rule.Node } {
	return typeof node === "object" && node !== null && "parent" in node;
}
