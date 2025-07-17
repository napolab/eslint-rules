import { RuleTester } from "eslint";
import { describe, it } from "vitest";

import { rule } from "./index";

const ruleTester = new RuleTester({
	languageOptions: {
		parserOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
});

describe("no-child-selectors", () => {
	it("should allow complex pseudo-selectors", () => {
		ruleTester.run("no-child-selectors", rule, {
			valid: [
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const complexPseudos = style({
              selectors: {
                "&:first-child, &:nth-child(2), &:nth-child(2n + 1)": {
                  marginTop: "0",
                },
                "&:not(&:first-child):not(&:nth-child(2)):not(&:nth-child(3))::before": { 
                  content: "''",
                  display: "block",
                },
                "&:nth-child(2n + 1):not(&:first-child):not(&:nth-child(2)):not(&:nth-child(3))::before": {
                  backgroundColor: "#5EC9FF",
                },
                "&:nth-child(2n + 2):not(&:first-child):not(&:nth-child(2)):not(&:nth-child(3))::before": {
                  backgroundColor: "#ffffff",
                },
                "&:nth-child(3)::before": {
                  animation: "waveFlow 240s linear infinite",
                },
                "&:hover::after": {
                  width: "100%",
                },
                "&::before, &::after": {
                  content: "''",
                  position: "absolute",
                },
                "&:hover::before, &:focus::after": {
                  opacity: "1",
                },
                "&:nth-of-type(odd):not(:last-child)": {
                  borderBottom: "1px solid #ccc",
                },
                "&:is(:hover, :focus):not(:disabled)": {
                  backgroundColor: "#f0f0f0",
                },
                "&:where(:enabled, :checked)[type='checkbox']": {
                  accent: "#blue",
                },
              },
            });
          `,
					filename: "/components/test/styles.css.ts",
				},
			],
			invalid: [
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const shouldFail = style({
              selectors: {
                "& h3": { fontSize: "1.5rem" },
                "& .child-class": { margin: "1rem" },
              },
            });
          `,
					filename: "/components/test/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& h3' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
						{
							message:
								"Child selector '& .child-class' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
			],
		});
	});

	it("should forbid child selectors in Vanilla Extract style definitions", () => {
		ruleTester.run("no-child-selectors", rule, {
			valid: [
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const button = style({
              selectors: {
                "&:hover": { backgroundColor: "#blue" },
                "&:focus": { outline: "2px solid #blue" },
                "&[disabled]": { opacity: 0.5 },
              },
            });
          `,
					filename: "/components/button/styles.css.ts",
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const card = style({
              padding: "1rem",
              background: "white",
            });
            
            export const cardTitle = style({
              fontSize: "1.5rem",
              color: "#333",
              marginBottom: "1rem",
            });
            
            export const cardText = style({
              color: "#666",
              lineHeight: 1.6,
            });
          `,
					filename: "/components/card/styles.css.ts",
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const input = style({
              selectors: {
                "&:invalid": { borderColor: "red" },
                "&:valid": { borderColor: "green" },
                "&::placeholder": { color: "#999" },
                "&:nth-child(2)": { marginTop: "1rem" },
              },
            });
          `,
					filename: "/components/form/styles.css.ts",
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const listItem = style({
              selectors: {
                "&:not(&:first-child):not(&:nth-child(2)):not(&:nth-child(3))::before": { 
                  content: "''",
                  display: "block",
                  height: "1px",
                  background: "#ccc",
                },
                "&:hover:not(:disabled)": { backgroundColor: "#f0f0f0" },
                "&:focus:not(:disabled)::after": { outline: "2px solid blue" },
              },
            });
          `,
					filename: "/components/list/styles.css.ts",
				},
				// Non-css.ts files should not be checked
				{
					code: `
            const styles = {
              selectors: {
                "& h3": { fontSize: "1.5rem" },
              }
            };
          `,
					filename: "/components/card/index.tsx",
				},
			],
			invalid: [
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const card = style({
              selectors: {
                "& h3": { fontSize: "1.5rem" },
              },
            });
          `,
					filename: "/components/card/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& h3' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const container = style({
              selectors: {
                "& p": { color: "#333" },
                "&:hover": { background: "#f0f0f0" },
              },
            });
          `,
					filename: "/components/container/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& p' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const list = style({
              selectors: {
                "& .child-class": { margin: "1rem" },
              },
            });
          `,
					filename: "/components/list/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& .child-class' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const nav = style({
              selectors: {
                "& > li": { display: "inline-block" },
                "& a": { textDecoration: "none" },
                "&:hover": { background: "#eee" },
              },
            });
          `,
					filename: "/components/nav/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& > li' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
						{
							message:
								"Child selector '& a' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const article = style({
              selectors: {
                "& h1, & h2": { fontWeight: "bold" },
                "& p + p": { marginTop: "1rem" },
              },
            });
          `,
					filename: "/components/article/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& h1, & h2' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
						{
							message:
								"Child selector '& p + p' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
				{
					code: `
            import { style } from "@vanilla-extract/css";
            
            export const form = style({
              selectors: {
                "& input[type='text']": { border: "1px solid #ccc" },
                "& *": { boxSizing: "border-box" },
              },
            });
          `,
					filename: "/components/form/styles.css.ts",
					errors: [
						{
							message:
								"Child selector '& input[type='text']' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
						{
							message:
								"Child selector '& *' is not allowed in Vanilla Extract. Create a separate style export instead.",
						},
					],
				},
			],
		});
	});
});
