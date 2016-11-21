import * as babylon from "babylon";

// Parse options values.
const _parseOpts = (opts) => Object.keys(opts)
  .map((key) =>
    [key, babylon.parse(`expr=${opts[key]}`).program.body.pop().expression.right])
  .reduce((memo, pair) => {
    memo[pair[0]] = pair[1];
    return memo;
  }, {});

// Parse, cache, and get options
const _getOpts = function (ctxt, opts) {
  ctxt._opts = ctxt._opts || _parseOpts(opts);
  return ctxt._opts;
};

export default function ({ types: t }) {
  return {
    visitor: {
      // require("TOKEN/lodash")
      CallExpression(path, state) {
        const node = path.node;
        const args = node.arguments || [];
        const opts = _getOpts(this, state.opts);

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
              node.callee = replace;
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
