import { isVariableDeclaratorWithId, isExportSpecifierWithLocal } from "../../utils/type-guards";

import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
  report(descriptor: Rule.ReportDescriptor): void;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce maximum word count in style names to encourage component decomposition",
      recommended: false,
    },
    messages: {
      tooManyWords: "Style name '{{ name }}' has {{ count }} words. Component is too large and needs refactoring.",
    },
    schema: [
      {
        type: "object",
        properties: {
          maxWords: {
            type: "integer",
            minimum: 1,
            default: 3,
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context: RuleContext): Rule.RuleListener {
    const filename = context.filename;
    const options = context.options[0] as { maxWords?: number } | undefined;
    const maxWords = typeof options?.maxWords === "number" ? options.maxWords : 3;

    // Only check *.css.ts files
    if (!filename.endsWith(".css.ts")) {
      return {};
    }

    // Single Responsibility Principle: Each function has one clear purpose

    // KISS: Keep it simple - pure function for counting words
    function countWords(name: string): number {
      const words = name.split(/(?=[A-Z])/).filter((word) => word.length > 0);

      return words.length;
    }

    // Single Responsibility: Only checks and reports style name violations
    function checkStyleName(name: string, node: Rule.Node): void {
      const wordCount = countWords(name);
      if (wordCount > maxWords) {
        context.report({
          node,
          messageId: "tooManyWords",
          data: {
            name,
            count: wordCount.toString(),
          },
        });
      }
    }

    // YAGNI: Simplified - only check what we need

    return {
      // YAGNI: Only check style() calls that are directly exported
      "ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type='CallExpression'][init.callee.name='style']"(
        node: Rule.Node,
      ): void {
        if (isVariableDeclaratorWithId(node)) {
          checkStyleName(node.id.name, node.id);
        }
      },

      // Check export specifiers for style() calls
      ExportSpecifier(node: Rule.Node): void {
        if (isExportSpecifierWithLocal(node)) {
          // Simple heuristic: if the name looks like a style variable, check it
          const name = node.local.name;
          if (name && typeof name === "string") {
            checkStyleName(name, node.local);
          }
        }
      },
    };
  },
};

export { rule };
