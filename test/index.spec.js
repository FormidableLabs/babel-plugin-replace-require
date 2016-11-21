"use strict";

const expect = require("chai").expect;

const babel = require("babel-core");
const pluginPath = require.resolve("../lib/index");

const tmpl = require("./helpers/templates");

const transform = (code, opts) => {
  return babel.transform(code, {
    "presets": ["es2015"],
    "plugins": [
      [pluginPath, opts]
    ]
  }).code;
};

describe("index", () => {
  describe("import", () => {
    it("doesn't change with empty options", () => {
      let code;

      code = "import _ from 'lodash'";
      expect(transform(code)).to.equal(tmpl.importDefault("lodash"));

      code = "import { foo } from 'foo/bar/baz'";
      expect(transform(code)).to.equal(tmpl.importMembers("foo/bar/baz"));

      code = "import * as lodash from 'lodash'";
      expect(transform(code)).to.equal(tmpl.importWildcard("lodash", "lodash"));
    });

    it("leaves unmatched imports unchanged", () => {
      let code;

      code = "import _ from 'TOKEN/lodash'";
      expect(transform(code)).to.equal(tmpl.importDefault("TOKEN/lodash"));

      code = "import { foo } from 'TOKEN/foo/bar/baz'";
      expect(transform(code)).to.equal(tmpl.importMembers("TOKEN/foo/bar/baz"));

      code = "import * as lodash from 'TOKEN/lodash'";
      expect(transform(code)).to.equal(tmpl.importWildcard("TOKEN/lodash", "lodash"));
    });

    it("replaces matched token require", () => {
      const TOKEN = "token";
      const trans = (c) => transform(c, { TOKEN });
      let code;

      code = "import _ from 'TOKEN/lodash'";
      expect(trans(code)).to.equal(tmpl.importDefault("lodash", TOKEN));

      code = "import { foo } from 'TOKEN/foo/bar/baz'";
      expect(trans(code)).to.equal(tmpl.importMembers("foo/bar/baz", TOKEN));

      code = "import * as lodash from 'TOKEN/lodash'";
      expect(trans(code)).to.equal(tmpl.importWildcard("lodash", "lodash", TOKEN));
    });


    it("replaces advanced expression token require", () => {
      const TOKEN = "require('another-module/foo/bar/yo')";
      const trans = (c) => transform(c, { TOKEN });
      let code;

      code = "import _ from 'TOKEN/lodash'";
      expect(trans(code)).to.equal(tmpl.importDefault("lodash", TOKEN));

      code = "import { foo } from 'TOKEN/foo/bar/baz'";
      expect(trans(code)).to.equal(tmpl.importMembers("foo/bar/baz", TOKEN));

      code = "import * as lodash from 'TOKEN/lodash'";
      expect(trans(code)).to.equal(tmpl.importWildcard("lodash", "lodash", TOKEN));
    });
  });

  describe("require", () => {
    it("errors on invalid code expressions without token match", () => {
      let code;

      code = "require('lodash')";
      expect(() => transform(code, { T: "BAD BAD" })).to.throw(/Unexpected token/);

      code = "const _ = require('lodash')";
      expect(() => transform(code, { T: "BAD \\" })).to.throw(/Unicode escape/);
    });

    it("errors on invalid code expressions with token match", () => {
      let code;

      code = "require('T/lodash')";
      expect(() => transform(code, { T: "BAD BAD" })).to.throw(/Unexpected token/);

      code = "const _ = require('T/lodash')";
      expect(() => transform(code, { T: "BAD \\" })).to.throw(/Unicode escape/);
    });

    it("doesn't change with empty options", () => {
      let code;

      code = "require('lodash')";
      expect(transform(code)).to.equal(tmpl.require("lodash"));

      code = "const _ = require('lodash')";
      expect(transform(code)).to.equal(tmpl.requireAssign("lodash", "_"));
    });

    it("doesn't change require.resolve even with token", () => {
      let code;

      code = "require.resolve('lodash')";
      expect(transform(code)).to.equal(tmpl.require("lodash", "require.resolve"));

      code = "require.resolve('T/lodash')";
      expect(transform(code, { T: "foo" }))
        .to.equal(tmpl.require("T/lodash", "require.resolve"));

      code = "const _ = require.resolve('lodash')";
      expect(transform(code)).to.equal(tmpl.requireAssign("lodash", "_", "require.resolve"));

      code = "const _ = require.resolve('T/lodash')";
      expect(transform(code, { T: "foo" }))
        .to.equal(tmpl.requireAssign("T/lodash", "_", "require.resolve"));
    });

    it("leaves unmatched requires unchanged");
    it("replaces matched token require");
    it("replaces matched token in nested require");
  });
});
