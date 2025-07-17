import { describe, it, expect } from "vitest";

import {
	isIdentifierNode,
	isFunctionDeclarationWithId,
	isVariableDeclaratorWithId,
	isExportSpecifierWithLocal,
	hasParent,
} from "./type-guards";

import type { Rule } from "eslint";

describe("type-guards", () => {
	describe("isIdentifierNode", () => {
		it("should return true for Identifier nodes with name", () => {
			const node = {
				type: "Identifier",
				name: "test",
			} as Rule.Node;

			expect(isIdentifierNode(node)).toBe(true);
		});

		it("should return false for non-Identifier nodes", () => {
			const node = {
				type: "FunctionDeclaration",
				name: "test",
			} as Rule.Node;

			expect(isIdentifierNode(node)).toBe(false);
		});

		it("should return false for Identifier nodes without name", () => {
			const node = {
				type: "Identifier",
			} as Rule.Node;

			expect(isIdentifierNode(node)).toBe(false);
		});
	});

	describe("isFunctionDeclarationWithId", () => {
		it("should return true for FunctionDeclaration with Identifier id", () => {
			const node = {
				type: "FunctionDeclaration",
				id: {
					type: "Identifier",
					name: "test",
				},
			} as Rule.Node;

			expect(isFunctionDeclarationWithId(node)).toBe(true);
		});

		it("should return false for non-FunctionDeclaration nodes", () => {
			const node = {
				type: "VariableDeclarator",
				id: {
					type: "Identifier",
					name: "test",
				},
			} as Rule.Node;

			expect(isFunctionDeclarationWithId(node)).toBe(false);
		});

		it("should return false for FunctionDeclaration without id", () => {
			const node = {
				type: "FunctionDeclaration",
				id: null,
			} as Rule.Node;

			expect(isFunctionDeclarationWithId(node)).toBe(false);
		});
	});

	describe("isVariableDeclaratorWithId", () => {
		it("should return true for VariableDeclarator with Identifier id", () => {
			const node = {
				type: "VariableDeclarator",
				id: {
					type: "Identifier",
					name: "test",
				},
			} as Rule.Node;

			expect(isVariableDeclaratorWithId(node)).toBe(true);
		});

		it("should return false for non-VariableDeclarator nodes", () => {
			const node = {
				type: "FunctionDeclaration",
				id: {
					type: "Identifier",
					name: "test",
				},
			} as Rule.Node;

			expect(isVariableDeclaratorWithId(node)).toBe(false);
		});
	});

	describe("isExportSpecifierWithLocal", () => {
		it("should return true for ExportSpecifier with Identifier local", () => {
			const node = {
				type: "ExportSpecifier",
				local: {
					type: "Identifier",
					name: "test",
				},
			} as Rule.Node;

			expect(isExportSpecifierWithLocal(node)).toBe(true);
		});

		it("should return false for non-ExportSpecifier nodes", () => {
			const node = {
				type: "VariableDeclarator",
				local: {
					type: "Identifier",
					name: "test",
				},
			} as Rule.Node;

			expect(isExportSpecifierWithLocal(node)).toBe(false);
		});
	});

	describe("hasParent", () => {
		it("should return true for objects with parent property", () => {
			const node = {
				parent: { type: "Program" },
			};

			expect(hasParent(node)).toBe(true);
		});

		it("should return false for objects without parent property", () => {
			const node = {
				type: "Identifier",
			};

			expect(hasParent(node)).toBe(false);
		});

		it("should return false for null", () => {
			expect(hasParent(null)).toBe(false);
		});

		it("should return false for undefined", () => {
			expect(hasParent(undefined)).toBe(false);
		});
	});
});
