import type { Rule } from "eslint";

interface RuleContext extends Rule.RuleContext {
  report(descriptor: Rule.ReportDescriptor): void;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Require comment for useEffect usage to explain why the side effect is necessary",
      recommended: false,
    },
    messages: {
      missingComment: "useEffect must have a comment explaining why this side effect is necessary",
    },
    schema: [],
  },

  create(context: RuleContext): Rule.RuleListener {
    return {
      CallExpression(node: Rule.Node): void {
        if (node.type !== "CallExpression") return;

        // Check if this is a useEffect call
        const isUseEffect = node.callee.type === "Identifier" && node.callee.name === "useEffect";

        if (!isUseEffect) return;

        // Get the first argument (the effect function)
        const effectFunction = node.arguments[0];
        if (effectFunction.type !== "ArrowFunctionExpression" && effectFunction.type !== "FunctionExpression") return;

        // Check if the function body has a block statement
        const blockStatement = effectFunction.body;
        if (blockStatement.type !== "BlockStatement") return;

        // Check for comments in the block
        const sourceCode = context.sourceCode;
        const comments = sourceCode.getCommentsInside(blockStatement);

        // Check if there's a meaningful comment
        let hasValidComment = false;

        for (const comment of comments) {
          const commentText = comment.value.trim();
          // Check if comment is not empty and has reasonable length
          if (commentText.length > 10 && !commentText.match(/^\/?\s*$/)) {
            hasValidComment = true;
            break;
          }
        }

        if (!hasValidComment) {
          context.report({
            node,
            messageId: "missingComment",
          });
        }
      },
    };
  },
};

export { rule };
