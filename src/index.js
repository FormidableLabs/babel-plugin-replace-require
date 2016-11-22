import * as babylon from "babylon";

// Parse options values.
const _parseOpts = (path, opts) => Object.keys(opts)
  // Parse the matched replacement expression.
  // https://github.com/babel/babylon/issues/210
  .map((key) => {
    try {
      return [key, babylon.parse(`expr=${opts[key]}`).program.body.pop().expression.right];
    } catch (err) {
      throw path.buildCodeFrameError(err);
    }
  })
  // Objectify.
  .reduce((memo, pair) => {
    memo[pair[0]] = pair[1];
    return memo;
  }, {});

// Parse, cache, and get options
const _getOpts = function (ctxt, path, opts) {
  ctxt._opts = ctxt._opts || _parseOpts(path, opts);
  return ctxt._opts;
};

export default function ({ types: t }) {
  return {
    visitor: {
      // require("TOKEN/lodash")
      CallExpression(path, state) {
        const node = path.node;
        const args = node.arguments || [];
        const opts = _getOpts(this, path, state.opts);

        if (node.callee.name === "require" && args.length === 1 && t.isStringLiteral(args[0])) {
          const src = args[0].value;
          const [first, ...rest] = src.split("/");
          const mod = (rest || []).join("/");

          // Parse options and mutate with first match.
          const replace = opts[Object.keys(opts).find((k) => k === first)];
          if (replace) {
            // Rewrite the `require`, then the module argument with stripped module path.
            node.callee = replace;
            args[0].value = mod;
          }
        }
      }
    }
  };
}
