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

describe("enforce-layout-component-name", () => {
  it("should pass when layout.tsx exports Layout component", () => {
    ruleTester.run("enforce-layout-component-name", rule, {
      valid: [
        {
          code: `
            export default function Layout({ children }) {
              return <div>{children}</div>;
            }
          `,
          filename: "/app/layout.tsx",
        },
        {
          code: `
            export function Layout({ children }) {
              return <div>{children}</div>;
            }
          `,
          filename: "/app/layout.tsx",
        },
        {
          code: `
            const Layout = ({ children }) => {
              return <div>{children}</div>;
            };
            export default Layout;
          `,
          filename: "/app/layout.tsx",
        },
        {
          code: `
            export const Layout = ({ children }) => {
              return <div>{children}</div>;
            };
          `,
          filename: "/app/layout.tsx",
        },
        {
          code: `
            function Layout({ children }) {
              return <div>{children}</div>;
            }
            export { Layout };
          `,
          filename: "/app/(marketing)/layout.tsx",
        },
        {
          code: `
            export { Layout } from "./shared-layout";
          `,
          filename: "/app/layout.tsx",
        },
        {
          code: `
            export { Layout as default } from "./shared-layout";
          `,
          filename: "/app/layout.tsx",
        },
        // Non-layout files should not be checked
        {
          code: `
            export default function Page() {
              return <div>Page</div>;
            }
          `,
          filename: "/app/page.tsx",
        },
      ],
      invalid: [
        {
          code: `
            export default function RootLayout({ children }) {
              return <div>{children}</div>;
            }
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout' (found 'RootLayout')",
            },
          ],
        },
        {
          code: `
            export function MyLayout({ children }) {
              return <div>{children}</div>;
            }
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout' (found 'MyLayout')",
            },
          ],
        },
        {
          code: `
            const AppLayout = ({ children }) => {
              return <div>{children}</div>;
            };
            export default AppLayout;
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout' (found 'AppLayout')",
            },
          ],
        },
        {
          code: `
            export const Container = ({ children }) => {
              return <div>{children}</div>;
            };
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout' (found 'Container')",
            },
          ],
        },
        {
          code: `
            export { RootLayout } from "./shared-layout";
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout' (found 'RootLayout')",
            },
          ],
        },
        {
          code: `
            export { RootLayout as default } from "./shared-layout";
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout' (found 'RootLayout')",
            },
          ],
        },
        {
          code: `
            const someUtility = () => {};
            export { someUtility };
          `,
          filename: "/app/layout.tsx",
          errors: [
            {
              message: "layout.tsx must export a component named 'Layout'",
            },
          ],
        },
      ],
    });
  });
});
