import { RuleTester } from "eslint";
import { describe, it } from "vitest";

import { rule } from "./index";

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			ecmaFeatures: {
				jsx: true,
			},
		},
	},
});

describe("enforce-styling", () => {
	it("should pass when components import styles correctly", () => {
		ruleTester.run("enforce-styling", rule, {
			valid: [
				// Page component with styles.css
				{
					code: `
            import * as styles from "./styles.css";
            
            export default function Page() {
              return <div className={styles.root}>Page</div>;
            }
          `,
					filename: "/app/page.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "page.tsx",
									expectedImport: "./styles.css",
									styleFileExtension: "styles.css.ts",
								},
							],
						},
					],
				},
				// Layout component with layout.css
				{
					code: `
            import * as styles from "./layout.css";
            
            export default function Layout({ children }) {
              return <div className={styles.root}>{children}</div>;
            }
          `,
					filename: "/app/layout.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "layout.tsx",
									expectedImport: "./layout.css",
									styleFileExtension: "layout.css.ts",
									requireRelativeImports: true,
								},
							],
						},
					],
				},
				// Component with styles.css
				{
					code: `
            import * as styles from "./styles.css";
            
            export const Button = () => {
              return <button className={styles.button}>Click me</button>;
            }
          `,
					filename: "/components/button/index.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "Component index.tsx",
									expectedImport: "./styles.css",
									styleFileExtension: "styles.css.ts",
								},
							],
						},
					],
				},
				// Component without styles (when requireWhenStylesExist is true)
				{
					code: `
            export const Button = () => {
              return <button>Click me</button>;
            }
          `,
					filename: "/components/button/index.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "Component index.tsx",
									expectedImport: "./styles.css",
									styleFileExtension: "styles.css.ts",
								},
							],
							requireWhenStylesExist: true,
						},
					],
				},
			],
			invalid: [
				// Missing import
				{
					code: `
            export default function Page() {
              return <div>Page</div>;
            }
          `,
					filename: "/app/page.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "page.tsx",
									expectedImport: "./styles.css",
									styleFileExtension: "styles.css.ts",
								},
							],
							requireWhenStylesExist: false,
						},
					],
					errors: [
						{
							message:
								"page.tsx must import styles from './styles.css' using 'import * as styles from \"./styles.css\"'",
						},
					],
				},
				// Incorrect import source
				{
					code: `
            import * as styles from "./other.css";
            
            export default function Layout({ children }) {
              return <div className={styles.root}>{children}</div>;
            }
          `,
					filename: "/app/layout.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "layout.tsx",
									expectedImport: "./layout.css",
									styleFileExtension: "layout.css.ts",
								},
							],
						},
					],
					errors: [
						{
							message: "layout.tsx must import from './layout.css', not './other.css'",
						},
					],
				},
				// Incorrect import type
				{
					code: `
            import styles from "./styles.css";
            
            export const Button = () => {
              return <button className={styles.button}>Click me</button>;
            }
          `,
					filename: "/components/button/index.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "Component index.tsx",
									expectedImport: "./styles.css",
									styleFileExtension: "styles.css.ts",
								},
							],
						},
					],
					errors: [
						{
							message: "Component index.tsx must use namespace import: 'import * as styles from \"./styles.css\"'",
						},
					],
				},
				// Incorrect alias
				{
					code: `
            import * as buttonStyles from "./styles.css";
            
            export const Button = () => {
              return <button className={buttonStyles.button}>Click me</button>;
            }
          `,
					filename: "/components/button/index.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "Component index.tsx",
									expectedImport: "./styles.css",
									styleFileExtension: "styles.css.ts",
								},
							],
						},
					],
					errors: [
						{
							message: "Component index.tsx must import styles with alias 'styles', not 'buttonStyles'",
						},
					],
				},
			],
		});
	});

	it("should handle requireRelativeImports option", () => {
		ruleTester.run("enforce-styling with requireRelativeImports", rule, {
			valid: [
				// npm package import should be ignored when requireRelativeImports is true
				{
					code: `
            import "@acab/reset.css";
            import * as styles from "./layout.css";
            
            export default function Layout({ children }) {
              return <div className={styles.root}>{children}</div>;
            }
          `,
					filename: "/app/layout.tsx",
					options: [
						{
							patterns: [
								{
									componentDescription: "layout.tsx",
									expectedImport: "./layout.css",
									styleFileExtension: "layout.css.ts",
									requireRelativeImports: true,
								},
							],
						},
					],
				},
			],
			invalid: [],
		});
	});
});
