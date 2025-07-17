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

describe("max-style-name-words", () => {
  it("should forbid style names with 3 or more words (default)", () => {
    ruleTester.run("max-style-name-words", rule, {
      valid: [
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const root = style({
              padding: "1rem",
            });
            
            export const title = style({
              fontSize: "2rem",
            });
            
            export const submitButton = style({
              backgroundColor: "blue",
            });
          `,
          filename: "/components/form/styles.css.ts",
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const headerRoot = style({
              display: "flex",
            });
            
            export const contentRoot = style({
              padding: "2rem",
            });
            
            export const sidebarRoot = style({
              width: "250px",
            });
          `,
          filename: "/components/layout/styles.css.ts",
        },
        {
          code: `
            import { style, createContainer } from "@vanilla-extract/css";
            
            export const themeContainer = createContainer();
            export const appContainer = createContainer();
            
            export const darkTheme = style({
              background: "#000",
            });
          `,
          filename: "/themes/styles.css.ts",
        },
        // Non-css.ts files should not be checked
        {
          code: `
            export const messageWallItemTimestamp = "some-class-name";
          `,
          filename: "/components/message/index.tsx",
        },
      ],
      invalid: [
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const messageWallTitle = style({
              fontSize: "1.5rem",
            });
          `,
          filename: "/components/message/styles.css.ts",
          errors: [
            {
              message: "Style name 'messageWallTitle' has 3 words. Component is too large and needs refactoring.",
            },
          ],
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const messageWallContainer = style({
              padding: "1rem",
            });
            
            export const messageWallItemIcon = style({
              width: "24px",
            });
            
            export const messageWallItemText = style({
              color: "#333",
            });
            
            export const messageWallItemTimestamp = style({
              fontSize: "0.8rem",
            });
          `,
          filename: "/components/message/styles.css.ts",
          errors: [
            {
              message: "Style name 'messageWallContainer' has 3 words. Component is too large and needs refactoring.",
            },
            {
              message: "Style name 'messageWallItemIcon' has 4 words. Component is too large and needs refactoring.",
            },
            {
              message: "Style name 'messageWallItemText' has 4 words. Component is too large and needs refactoring.",
            },
            {
              message:
                "Style name 'messageWallItemTimestamp' has 4 words. Component is too large and needs refactoring.",
            },
          ],
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const userProfileCardHeaderTitle = style({
              fontWeight: "bold",
            });
            
            export const userProfileCardBodyContent = style({
              lineHeight: 1.6,
            });
          `,
          filename: "/components/user/styles.css.ts",
          errors: [
            {
              message:
                "Style name 'userProfileCardHeaderTitle' has 5 words. Component is too large and needs refactoring.",
            },
            {
              message:
                "Style name 'userProfileCardBodyContent' has 5 words. Component is too large and needs refactoring.",
            },
          ],
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const navigationMenuItemActive = style({
              backgroundColor: "#f0f0f0",
            });
            
            export const navigationMenuItemIconWrapper = style({
              display: "inline-flex",
            });
          `,
          filename: "/components/nav/styles.css.ts",
          errors: [
            {
              message:
                "Style name 'navigationMenuItemActive' has 4 words. Component is too large and needs refactoring.",
            },
            {
              message:
                "Style name 'navigationMenuItemIconWrapper' has 5 words. Component is too large and needs refactoring.",
            },
          ],
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            const formFieldErrorMessage = style({
              color: "red",
            });
            
            export { formFieldErrorMessage };
          `,
          filename: "/components/form/styles.css.ts",
          errors: [
            {
              message: "Style name 'formFieldErrorMessage' has 3 words. Component is too large and needs refactoring.",
            },
          ],
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            const baseStyle = style({ padding: "1rem" });
            
            export const dashboardWidgetHeaderTitle = style([
              baseStyle,
              { fontSize: "1.2rem" }
            ]);
          `,
          filename: "/components/dashboard/styles.css.ts",
          errors: [
            {
              message:
                "Style name 'dashboardWidgetHeaderTitle' has 4 words. Component is too large and needs refactoring.",
            },
          ],
        },
      ],
    });
  });

  it("should support custom maxWords option", () => {
    ruleTester.run("max-style-name-words", rule, {
      valid: [
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const root = style({
              padding: "1rem",
            });
            
            export const title = style({
              fontSize: "2rem",
            });
            
            export const submitButton = style({
              backgroundColor: "blue",
            });
            
            export const messageWallTitle = style({
              fontSize: "1.5rem",
            });
            
            export const messageWallContainer = style({
              padding: "1rem",
            });
          `,
          filename: "/components/form/styles.css.ts",
          options: [{ maxWords: 4 }],
        },
      ],
      invalid: [
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const messageWallItemIconWrapper = style({
              width: "24px",
            });
          `,
          filename: "/components/message/styles.css.ts",
          options: [{ maxWords: 4 }],
          errors: [
            {
              message:
                "Style name 'messageWallItemIconWrapper' has 5 words. Component is too large and needs refactoring.",
            },
          ],
        },
        {
          code: `
            import { style } from "@vanilla-extract/css";
            
            export const submitButton = style({
              backgroundColor: "blue",
            });
          `,
          filename: "/components/form/styles.css.ts",
          options: [{ maxWords: 1 }],
          errors: [
            {
              message: "Style name 'submitButton' has 2 words. Component is too large and needs refactoring.",
            },
          ],
        },
      ],
    });
  });
});
