import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
  report(descriptor: Rule.ReportDescriptor): void;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce using .at() method instead of array bracket notation for accessing array elements",
      recommended: false,
    },
    fixable: "code",
    messages: {
      preferArrayAt: "Use .at({{index}}) instead of [{{index}}] for array access",
    },
    schema: [],
  },

  create(context: RuleContext): Rule.RuleListener {
    return {
      MemberExpression(node: Rule.Node): void {
        if (node.type !== "MemberExpression") return;

        // Check if this is bracket notation (computed property access)
        if (!node.computed) return;

        // Check if the property is a numeric literal or numeric expression
        if (node.property.type === "Literal" && typeof node.property.value === "number") {
          // Direct numeric index like arr[0]
          const index = node.property.value;

          context.report({
            node,
            messageId: "preferArrayAt",
            data: {
              index: index.toString(),
            },
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const objectText = sourceCode.getText(node.object);
              const indexText = String(index);

              return fixer.replaceText(node, `${objectText}.at(${indexText})`);
            },
          });
        } else if (
          node.property.type === "UnaryExpression" &&
          node.property.operator === "-" &&
          node.property.argument.type === "Literal" &&
          typeof node.property.argument.value === "number"
        ) {
          // Negative index like arr[-1]
          const index = -node.property.argument.value;

          context.report({
            node,
            messageId: "preferArrayAt",
            data: {
              index: index.toString(),
            },
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const objectText = sourceCode.getText(node.object);
              const indexText = index.toString();

              return fixer.replaceText(node, `${objectText}.at(${indexText})`);
            },
          });
        } else if (
          node.property.type === "Identifier" ||
          node.property.type === "BinaryExpression" ||
          node.property.type === "CallExpression"
        ) {
          // Variable or expression index like arr[i] or arr[i + 1]
          context.report({
            node,
            messageId: "preferArrayAt",
            data: {
              index: "{{expression}}",
            },
            fix(fixer) {
              const sourceCode = context.getSourceCode();
              const objectText = sourceCode.getText(node.object);
              const indexText = sourceCode.getText(node.property);

              return fixer.replaceText(node, `${objectText}.at(${indexText})`);
            },
          });
        }
      },
    };
  },
};

export { rule };
