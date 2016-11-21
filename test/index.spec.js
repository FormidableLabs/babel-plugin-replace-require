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
    it.skip("errors on invalid code expressions", () => {
      const TOKEN = "BAD \\";
      const trans = (c) => transform(c, { TOKEN });
      let code;

      code = "require('lodash')";
      expect(trans(code)).to.equal(tmpl.require("lodash", TOKEN));
    });

    it("doesn't change with empty options");
    it("doesn't change with empty options");
    it("doesn't change require.resolve even with token");
    it("leaves unmatched requires unchanged");
    it("replaces matched token require");
    it("replaces matched token in nested require");
  });
});
