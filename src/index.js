
export default function ({ types: t }) {
  return {
    visitor: {
      // import _ from "TOKEN/lodash"
      ImportDeclaration(path, state) {
        const src = path.node.source.value;
        const opts = state.opts;

        // TODO: LIKELY IGNORE SO WE _JUST_ REWRITE THE REQUIRE.

        console.log("TODO HERE import -> source", src, opts); // eslint-disable-line
      },

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
            node.callee.name = "TODO"; // really need ast rewrite from source.
            args[0].value = mod;
          }

          console.log("TODO HERE require -> source", src, replace, mod); // eslint-disable-line
        }
      }
    }
  };
}
