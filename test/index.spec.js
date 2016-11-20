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

    it("leaves unmatched imports unchanged");
    it("replaces matched token require");
  });

  describe("require", () => {
    it("errors on invalid code expressions");
    it("doesn't change with empty options");
    it("doesn't change with empty options");
    it("doesn't change require.resolve even with token");
    it("leaves unmatched requires unchanged");
    it("replaces matched token require");
    it("replaces matched token in nested require");
  });
});
