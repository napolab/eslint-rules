import { checkStyleFileExists } from "../../utils/file-system";

import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
  report(descriptor: Rule.ReportDescriptor): void;
}

interface StylePattern {
  componentDescription: string;
  expectedImport: string;
  styleFileExtension: string;
  requireRelativeImports?: boolean;
}

interface RuleOptions {
  patterns: StylePattern[];
  requireWhenStylesExist?: boolean;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that component files import styles from their corresponding CSS files",
      recommended: false,
    },
    messages: {
      missingImport:
        "{{ componentDescription }} must import styles from '{{ expectedImport }}' using 'import * as styles from \"{{ expectedImport }}\"'",
      incorrectImportType:
        "{{ componentDescription }} must use namespace import: 'import * as styles from \"{{ expectedImport }}\"'",
      incorrectAlias: "{{ componentDescription }} must import styles with alias 'styles', not '{{ alias }}'",
      incorrectSource: "{{ componentDescription }} must import from '{{ expectedImport }}', not '{{ source }}'",
    },
    schema: [
      {
        type: "object",
        properties: {
          patterns: {
            type: "array",
            items: {
              type: "object",
              properties: {
                componentDescription: {
                  type: "string",
                  description: "Description of the component type (e.g., 'page.tsx', 'layout.tsx')",
                },
                expectedImport: {
                  type: "string",
                  description: "Expected CSS import path (e.g., './styles.css', './layout.css')",
                },
                styleFileExtension: {
                  type: "string",
                  description: "Style file extension to check for existence (e.g., 'styles.css.ts', 'layout.css.ts')",
                },
                requireRelativeImports: {
                  type: "boolean",
                  description: "Whether to require relative imports only (default: false)",
                },
              },
              required: ["componentDescription", "expectedImport", "styleFileExtension"],
              additionalProperties: false,
            },
          },
          requireWhenStylesExist: {
            type: "boolean",
            description: "Whether to require import only when style files exist (default: true)",
          },
        },
        required: ["patterns"],
        additionalProperties: false,
      },
    ],
  },

  create(context: RuleContext): Rule.RuleListener {
    const filename = context.filename;
    const options = context.options[0] as RuleOptions | undefined;
    const patterns = options?.patterns ?? [];
    const requireWhenStylesExist = options?.requireWhenStylesExist ?? true;

    if (patterns.length === 0) {
      return {};
    }

    // Use the first pattern (since files are already filtered by eslint.config.js)
    const pattern = patterns[0];

    let hasCorrectImport = false;
    let hasIncorrectImport = false;

    return {
      ImportDeclaration(node: Rule.Node): void {
        if (node.type !== "ImportDeclaration") return;

        const source = node.source.value;

        // Check if it's importing from a CSS file
        const isCssImport = typeof source === "string" && source.endsWith(".css");
        const isRelativeImport = typeof source === "string" && source.startsWith("./");

        if (isCssImport) {
          // If requireRelativeImports is true, only check relative imports
          if (pattern.requireRelativeImports === true && !isRelativeImport) {
            return;
          }

          // Check if it's the correct source
          if (source !== pattern.expectedImport) {
            context.report({
              node,
              messageId: "incorrectSource",
              data: {
                componentDescription: pattern.componentDescription,
                expectedImport: pattern.expectedImport,
                source,
              },
            });
            hasIncorrectImport = true;

            return;
          }

          // Check import type
          if (node.specifiers.length === 0) {
            // Side effect import
            hasIncorrectImport = true;

            return;
          }

          const specifier = node.specifiers[0];

          // Must be namespace import
          if (specifier.type !== "ImportNamespaceSpecifier") {
            context.report({
              node,
              messageId: "incorrectImportType",
              data: {
                componentDescription: pattern.componentDescription,
                expectedImport: pattern.expectedImport,
              },
            });
            hasIncorrectImport = true;

            return;
          }

          // Check alias name
          if (specifier.local.name !== "styles") {
            context.report({
              node,
              messageId: "incorrectAlias",
              data: {
                componentDescription: pattern.componentDescription,
                alias: specifier.local.name,
              },
            });
            hasIncorrectImport = true;

            return;
          }

          hasCorrectImport = true;
        }
      },
      "Program:exit"(): void {
        if (!hasCorrectImport && !hasIncorrectImport) {
          // If requireWhenStylesExist is true, only require import when style file exists
          if (requireWhenStylesExist) {
            const styleFileExists = checkStyleFileExists(filename, pattern.styleFileExtension);
            if (!styleFileExists) {
              // Skip requiring import if style file doesn't exist
              return;
            }
          }

          context.report({
            loc: { line: 1, column: 0 },
            messageId: "missingImport",
            data: {
              componentDescription: pattern.componentDescription,
              expectedImport: pattern.expectedImport,
            },
          });
        }
      },
    };
  },
};

export { rule };
