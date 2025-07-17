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

describe("enforce-page-component-name", () => {
  it("should pass when page.tsx exports Page component", () => {
    ruleTester.run("enforce-page-component-name", rule, {
      valid: [
        {
          code: `
            export default function Page() {
              return <div>Hello</div>;
            }
          `,
          filename: "/app/page.tsx",
        },
        {
          code: `
            export function Page() {
              return <div>Hello</div>;
            }
          `,
          filename: "/app/page.tsx",
        },
        {
          code: `
            const Page = () => {
              return <div>Hello</div>;
            };
            export default Page;
          `,
          filename: "/app/page.tsx",
        },
        {
          code: `
            export const Page = () => {
              return <div>Hello</div>;
            };
          `,
          filename: "/app/page.tsx",
        },
        {
          code: `
            function Page() {
              return <div>Hello</div>;
            }
            export { Page };
          `,
          filename: "/app/(marketing)/page.tsx",
        },
        {
          code: `
            export { Page } from "./shared-page";
          `,
          filename: "/app/page.tsx",
        },
        {
          code: `
            export { Page as default } from "./shared-page";
          `,
          filename: "/app/page.tsx",
        },
        // Non-page files should not be checked
        {
          code: `
            export default function Layout({ children }) {
              return <div>{children}</div>;
            }
          `,
          filename: "/app/layout.tsx",
        },
      ],
      invalid: [
        {
          code: `
            export default function HomePage() {
              return <div>Hello</div>;
            }
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page' (found 'HomePage')",
            },
          ],
        },
        {
          code: `
            export function MyPage() {
              return <div>Hello</div>;
            }
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page' (found 'MyPage')",
            },
          ],
        },
        {
          code: `
            const DashboardPage = () => {
              return <div>Hello</div>;
            };
            export default DashboardPage;
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page' (found 'DashboardPage')",
            },
          ],
        },
        {
          code: `
            export const Home = () => {
              return <div>Hello</div>;
            };
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page' (found 'Home')",
            },
          ],
        },
        {
          code: `
            export { HomePage } from "./shared-page";
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page' (found 'HomePage')",
            },
          ],
        },
        {
          code: `
            export { HomePage as default } from "./shared-page";
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page' (found 'HomePage')",
            },
          ],
        },
        {
          code: `
            const someUtility = () => {};
            export { someUtility };
          `,
          filename: "/app/page.tsx",
          errors: [
            {
              message: "page.tsx must export a component named 'Page'",
            },
          ],
        },
      ],
    });
  });
});
