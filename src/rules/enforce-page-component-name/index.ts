import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
  report(descriptor: Rule.ReportDescriptor): void;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce that page.tsx files export a component named 'Page'",
      recommended: false,
    },
    messages: {
      incorrectName: "page.tsx must export a component named 'Page' (found '{{ name }}')",
      missingExport: "page.tsx must export a component named 'Page'",
    },
    schema: [],
  },

  create(context: RuleContext): Rule.RuleListener {
    const _filename = context.filename;

    let hasPageExport = false;
    const exportedNames: string[] = [];

    return {
      // Check default export function declarations
      "ExportDefaultDeclaration > FunctionDeclaration[id.name]"(node: Rule.Node): void {
        if (node.type === "FunctionDeclaration" && node.id !== null) {
          const name = node.id.name;
          exportedNames.push(name);
          if (name === "Page") {
            hasPageExport = true;
          }
        }
      },

      // Check default export identifiers
      "ExportDefaultDeclaration > Identifier"(node: Rule.Node): void {
        if (node.type === "Identifier") {
          const name = node.name;
          exportedNames.push(name);
          if (name === "Page") {
            hasPageExport = true;
          }
        }
      },

      // Check named export function declarations
      "ExportNamedDeclaration > FunctionDeclaration[id.name]"(node: Rule.Node): void {
        if (node.type === "FunctionDeclaration" && node.id !== null) {
          const name = node.id.name;
          exportedNames.push(name);
          if (name === "Page") {
            hasPageExport = true;
          }
        }
      },

      // Check named export variable declarations
      "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[id.name]"(node: Rule.Node): void {
        if (node.type === "VariableDeclarator" && node.id.type === "Identifier") {
          const name = node.id.name;
          exportedNames.push(name);
          if (name === "Page") {
            hasPageExport = true;
          }
        }
      },

      // Check export specifiers (export { Page })
      "ExportNamedDeclaration > ExportSpecifier"(node: Rule.Node): void {
        if (node.type === "ExportSpecifier") {
          const exportedName = node.exported.type === "Identifier" ? node.exported.name : null;
          const localName = node.local.type === "Identifier" ? node.local.name : null;

          // Check if exporting as Page (export { Something as Page })
          if (exportedName === "Page") {
            hasPageExport = true;
          }
          // Check if exporting Page with same name (export { Page })
          else if (localName === "Page" && exportedName === localName) {
            hasPageExport = true;
          }
          // Check if exporting as default (export { Something as default })
          else if (exportedName === "default" && localName !== null) {
            exportedNames.push(localName);
            if (localName === "Page") {
              hasPageExport = true;
            }
          }
          // Regular named export
          else if (localName !== null) {
            exportedNames.push(localName);
            if (localName === "Page") {
              hasPageExport = true;
            }
          }
        }
      },

      "Program:exit"(): void {
        if (!hasPageExport) {
          // Find the first exported name that looks like a component (starts with uppercase)
          const componentName = exportedNames.find((name) => /^[A-Z]/.test(name));

          if (componentName !== undefined && componentName !== "Page") {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: "incorrectName",
              data: { name: componentName },
            });
          } else {
            context.report({
              loc: { line: 1, column: 0 },
              messageId: "missingExport",
            });
          }
        }
      },
    };
  },
};

export { rule };
