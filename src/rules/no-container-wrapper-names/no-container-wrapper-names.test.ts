import { RuleTester } from "eslint";

import { rule } from "./index.js";

const ruleTester = new RuleTester({
	languageOptions: {
		ecmaVersion: 2022,
		sourceType: "module",
	},
});

describe("no-container-wrapper-names", () => {
	ruleTester.run("no-container-wrapper-names", rule, {
		valid: [
			// root is allowed
			{
				code: `export const root = style({});`,
				filename: "styles.css.ts",
			},
			// xxxRoot pattern is allowed
			{
				code: `export const headerRoot = style({});`,
				filename: "styles.css.ts",
			},
			{
				code: `export const contentRoot = style({});`,
				filename: "styles.css.ts",
			},
			{
				code: `export const sidebarRoot = style({});`,
				filename: "component.css.ts",
			},
			// Non-.css.ts files should be ignored
			{
				code: `export const container = style({});`,
				filename: "styles.ts",
			},
			{
				code: `export const wrapper = {};`,
				filename: "config.ts",
			},
			// Non-exported variables should be ignored
			{
				code: `const container = style({});`,
				filename: "styles.css.ts",
			},
			// createContainer usage should allow xxxContainer pattern
			{
				code: `
import { createContainer } from "@vanilla-extract/css";
export const headerContainer = createContainer();`,
				filename: "styles.css.ts",
			},
			{
				code: `
import { createContainer } from "@vanilla-extract/css";
export const modalContainer = createContainer();`,
				filename: "styles.css.ts",
			},
			// createContainer with different import styles
			{
				code: `
import { style, createContainer } from "@vanilla-extract/css";
export const sectionContainer = createContainer();`,
				filename: "styles.css.ts",
			},
		],
		invalid: [
			// Exact match: container
			{
				code: `export const container = style({});`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "bannedExactName",
						data: { name: "container", suggestion: "root" },
					},
				],
			},
			// Exact match: wrapper
			{
				code: `export const wrapper = style({});`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "bannedExactName",
						data: { name: "wrapper", suggestion: "root" },
					},
				],
			},
			// Pattern match: xxxContainer
			{
				code: `export const textContainer = style({});`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "bannedPattern",
						data: {
							name: "textContainer",
							pattern: "Container",
							suggestion: "textRoot",
						},
					},
				],
			},
			{
				code: `export const imageContainer = style({});`,
				filename: "component.css.ts",
				errors: [
					{
						messageId: "bannedPattern",
						data: {
							name: "imageContainer",
							pattern: "Container",
							suggestion: "imageRoot",
						},
					},
				],
			},
			// Pattern match: xxxWrapper
			{
				code: `export const contentWrapper = style({});`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "bannedPattern",
						data: {
							name: "contentWrapper",
							pattern: "Wrapper",
							suggestion: "contentRoot",
						},
					},
				],
			},
			{
				code: `export const modalWrapper = style({});`,
				filename: "modal.css.ts",
				errors: [
					{
						messageId: "bannedPattern",
						data: {
							name: "modalWrapper",
							pattern: "Wrapper",
							suggestion: "modalRoot",
						},
					},
				],
			},
			// Multiple violations in one file
			{
				code: `
export const container = style({});
export const headerWrapper = style({});
export const footerContainer = style({});
        `,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "bannedExactName",
						data: { name: "container", suggestion: "root" },
					},
					{
						messageId: "bannedPattern",
						data: {
							name: "headerWrapper",
							pattern: "Wrapper",
							suggestion: "headerRoot",
						},
					},
					{
						messageId: "bannedPattern",
						data: {
							name: "footerContainer",
							pattern: "Container",
							suggestion: "footerRoot",
						},
					},
				],
			},
			// createContainer usage should enforce xxxContainer pattern
			{
				code: `
import { createContainer } from "@vanilla-extract/css";
export const header = createContainer();`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "requireContainerSuffix",
						data: { name: "header", suggestion: "headerContainer" },
					},
				],
			},
			{
				code: `
import { createContainer } from "@vanilla-extract/css";
export const modalRoot = createContainer();`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "requireContainerSuffix",
						data: { name: "modalRoot", suggestion: "modalContainer" },
					},
				],
			},
			{
				code: `
import { style, createContainer } from "@vanilla-extract/css";
export const section = createContainer();
export const sectionStyles = style({});`,
				filename: "styles.css.ts",
				errors: [
					{
						messageId: "requireContainerSuffix",
						data: { name: "section", suggestion: "sectionContainer" },
					},
				],
			},
		],
	});
});
