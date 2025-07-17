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

describe("require-useeffect-comment", () => {
	it("should require comment for useEffect usage", () => {
		ruleTester.run("require-useeffect-comment", rule, {
			valid: [
				// useEffect with required comment
				{
					code: `
            import { useEffect } from 'react';
            
            function Component() {
              useEffect(() => {
                // REQUIRED COMMENT: Setting up WebSocket connection for real-time updates
                const socket = new WebSocket(url);
                return () => socket.close();
              }, []);
            }
          `,
					filename: "/components/test.tsx",
				},
				// useEffect with proper comment - different format
				{
					code: `
            import { useEffect } from 'react';
            
            function Component() {
              useEffect(() => {
                // This is needed for DOM manipulation that cannot be achieved through React patterns
                document.title = "New Title";
              }, []);
            }
          `,
					filename: "/components/test.tsx",
				},
				// Component without useEffect
				{
					code: `
            import { useState } from 'react';
            
            function Component() {
              const [count, setCount] = useState(0);
              return <div>{count}</div>;
            }
          `,
					filename: "/components/test.tsx",
				},
			],
			invalid: [
				// useEffect without comment
				{
					code: `
            import { useEffect } from 'react';
            
            function Component() {
              useEffect(() => {
                const socket = new WebSocket(url);
                return () => socket.close();
              }, []);
            }
          `,
					filename: "/components/test.tsx",
					errors: [
						{
							message: "useEffect must have a comment explaining why this side effect is necessary",
						},
					],
				},
				// useEffect with only empty comment
				{
					code: `
            import { useEffect } from 'react';
            
            function Component() {
              useEffect(() => {
                // 
                const socket = new WebSocket(url);
                return () => socket.close();
              }, []);
            }
          `,
					filename: "/components/test.tsx",
					errors: [
						{
							message: "useEffect must have a comment explaining why this side effect is necessary",
						},
					],
				},
				// useEffect with insufficient comment
				{
					code: `
            import { useEffect } from 'react';
            
            function Component() {
              useEffect(() => {
                // setup
                const socket = new WebSocket(url);
                return () => socket.close();
              }, []);
            }
          `,
					filename: "/components/test.tsx",
					errors: [
						{
							message: "useEffect must have a comment explaining why this side effect is necessary",
						},
					],
				},
			],
		});
	});
});
