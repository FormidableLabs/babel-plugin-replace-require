import * as babylon from "babylon";

export default function ({ types: t }) {
  return {
    visitor: {
      // require("TOKEN/lodash")
      CallExpression(path, state) {
        const node = path.node;
        const args = node.arguments || [];
        const opts = state.opts;

        if (node.callee.name === "require" && args.length === 1 && t.isStringLiteral(args[0])) {
          const src = args[0].value;
          const [first, ...rest] = src.split("/");
          const mod = (rest || []).join("/");

          // Parse options and mutate with first match.
          const replace = opts[Object.keys(opts).find((k) => k === first)];
          if (replace) {
            // Rewrite the `require`, then the module argument.

            // Parse the matched replacement expression and replace callee.
            // https://github.com/babel/babylon/issues/210
            try {
              node.callee = babylon.parse(`expr=${replace}`).program.body.pop().expression.right;
            } catch (err) {
              throw path.buildCodeFrameError(err);
            }

            // Replace module argument with token stripped.
            args[0].value = mod;
          }
        }
      }
    }
  };
}
