import * as ts from "typescript";

import type { Rule } from "eslint";

// TypeScript ESLint のノード型（簡略化版）
interface TypeScriptESLintTreeNode {
  type: string;
  [key: string]: unknown;
}

interface ParserServices {
  program: ts.Program;
  esTreeNodeToTSNodeMap: WeakMap<TypeScriptESLintTreeNode, ts.Node>;
}

interface RuleContext extends Rule.RuleContext {
  report(descriptor: Rule.ReportDescriptor): void;
  parserServices?: ParserServices;
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
    // TypeScript parser services が利用可能かチェック
    const parserServices = context.parserServices;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
    if (!parserServices?.program || !parserServices?.esTreeNodeToTSNodeMap) {
      // TypeScript が利用できない場合は従来のヒューリスティック判定にフォールバック
      return createFallbackListener(context);
    }

    const checker = parserServices.program.getTypeChecker();
    const esTreeNodeToTSNodeMap = parserServices.esTreeNodeToTSNodeMap;

    /**
     * TypeScript の型情報を使って配列かどうかを判定
     */
    function isArrayType(node: Rule.Node): boolean {
      try {
        const tsNode = esTreeNodeToTSNodeMap.get(node as unknown as TypeScriptESLintTreeNode);
        if (!tsNode) return false;

        const type = checker.getTypeAtLocation(tsNode);
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (!type) return false;

        // 配列型かチェック
        if (checker.isArrayType(type)) {
          return true;
        }

        // ReadonlyArray<T> 型かチェック
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions, @typescript-eslint/no-unnecessary-condition
        if (type.symbol && type.symbol.name === "ReadonlyArray") {
          return true;
        }

        // Array-like types (NodeList, HTMLCollection, etc.)
        const typeString = checker.typeToString(type);
        if (typeString.includes("Array") || typeString.includes("List") || typeString.includes("Collection")) {
          return true;
        }

        // tuple types [string, number] など
        if (type.flags & ts.TypeFlags.Object) {
          const objectType = type as ts.ObjectType;
          if (objectType.objectFlags & ts.ObjectFlags.Tuple) {
            return true;
          }
        }

        // Array method chains の結果をチェック
        if (node.type === "CallExpression") {
          const callNode = node as Rule.Node & { callee: Rule.Node };
          if (callNode.callee.type === "MemberExpression") {
            const memberNode = callNode.callee as Rule.Node & { property: Rule.Node };
            if (memberNode.property.type === "Identifier") {
              const arrayMethods = ["filter", "map", "slice", "concat", "sort", "reverse", "flat", "flatMap", "splice"];
              if (arrayMethods.includes(memberNode.property.name)) {
                return true;
              }
            }
          }
        }

        return false;
      } catch {
        // 型チェックでエラーが発生した場合はフォールバック
        return false;
      }
    }

    /**
     * 文字列キーかどうかをチェック（オブジェクトプロパティの可能性が高い）
     */
    function isStringKey(property: Rule.Node): boolean {
      return property.type === "Literal" && typeof property.value === "string";
    }

    return {
      MemberExpression(node: Rule.Node): void {
        if (node.type !== "MemberExpression") return;

        // Check if this is bracket notation (computed property access)
        if (!node.computed) return;

        // 文字列リテラルキーの場合は除外（オブジェクトプロパティアクセス）
        if (isStringKey(node.property as Rule.Node)) {
          return;
        }

        // TypeScript の型情報を使って配列かどうかチェック
        if (!isArrayType(node.object as Rule.Node)) {
          return;
        }

        // 報告とフィックスの処理
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
              const sourceCode = context.sourceCode;
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
              const sourceCode = context.sourceCode;
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
              const sourceCode = context.sourceCode;
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

/**
 * TypeScript が利用できない場合のフォールバック（従来のヒューリスティック判定）
 */
function createFallbackListener(context: RuleContext): Rule.RuleListener {
  function isLikelyArray(node: Rule.Node): boolean {
    if (node.type === "Identifier") {
      const name = node.name.toLowerCase();
      const arrayPatterns = [
        /^(arr|array|list|items|elements|data|rows|cols|values|entries)$/,
        /^(arr|array|list|items|elements|data|rows|cols|values|entries)[\d_]*/,
        /.*s$/, // 複数形で終わる
      ];

      const objectPatterns = [
        /^(obj|object|config|settings|options|props|attrs|style|styles|class|this)$/,
        /^(window|document|global|process|console)$/,
      ];

      if (objectPatterns.some((pattern) => pattern.test(name))) {
        return false;
      }

      return arrayPatterns.some((pattern) => pattern.test(name));
    }

    if (node.type === "MemberExpression") {
      if (node.property.type === "Identifier") {
        const arrayMethods = [
          "filter",
          "map",
          "reduce",
          "sort",
          "slice",
          "splice",
          "concat",
          "reverse",
          "join",
          "push",
          "pop",
          "shift",
          "unshift",
          "indexOf",
          "lastIndexOf",
          "find",
          "findIndex",
          "some",
          "every",
          "forEach",
          "includes",
          "flat",
          "flatMap",
        ];

        if (arrayMethods.includes(node.property.name)) {
          return true;
        }
      }

      return isLikelyArray(node.object as Rule.Node);
    }

    if (node.type === "CallExpression") {
      if (node.callee.type === "MemberExpression" && node.callee.property.type === "Identifier") {
        const arrayReturningMethods = [
          "filter",
          "map",
          "slice",
          "concat",
          "sort",
          "reverse",
          "flat",
          "flatMap",
          "splice",
          "split",
        ];

        if (arrayReturningMethods.includes(node.callee.property.name)) {
          return true;
        }
      }

      if (
        node.callee.type === "MemberExpression" &&
        node.callee.object.type === "Identifier" &&
        node.callee.object.name === "Array"
      ) {
        return true;
      }
    }

    return false;
  }

  function isStringKey(property: Rule.Node): boolean {
    return property.type === "Literal" && typeof property.value === "string";
  }

  function isNumericIndex(property: Rule.Node): boolean {
    if (property.type === "Literal" && typeof property.value === "number") {
      return true;
    }

    if (
      property.type === "UnaryExpression" &&
      property.operator === "-" &&
      property.argument.type === "Literal" &&
      typeof property.argument.value === "number"
    ) {
      return true;
    }

    return false;
  }

  return {
    MemberExpression(node: Rule.Node): void {
      if (node.type !== "MemberExpression") return;
      if (!node.computed) return;

      if (isStringKey(node.property as Rule.Node)) {
        return;
      }

      const isNumeric = isNumericIndex(node.property as Rule.Node);
      if (!isNumeric && !isLikelyArray(node.object as Rule.Node)) {
        return;
      }

      // 報告とフィックスの処理（TypeScript版と同じ）
      if (node.property.type === "Literal" && typeof node.property.value === "number") {
        const index = node.property.value;

        context.report({
          node,
          messageId: "preferArrayAt",
          data: {
            index: index.toString(),
          },
          fix(fixer) {
            const sourceCode = context.sourceCode;
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
        const index = -node.property.argument.value;

        context.report({
          node,
          messageId: "preferArrayAt",
          data: {
            index: index.toString(),
          },
          fix(fixer) {
            const sourceCode = context.sourceCode;
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
        context.report({
          node,
          messageId: "preferArrayAt",
          data: {
            index: "{{expression}}",
          },
          fix(fixer) {
            const sourceCode = context.sourceCode;
            const objectText = sourceCode.getText(node.object);
            const indexText = sourceCode.getText(node.property);

            return fixer.replaceText(node, `${objectText}.at(${indexText})`);
          },
        });
      }
    },
  };
}

export { rule };
