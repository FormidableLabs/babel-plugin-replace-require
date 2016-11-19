const expect = require("chai").expect;

const babel = require("babel-core");
const pluginPath = require.resolve("../lib/index");

const transform = (code, opts) => {
  return babel.transform(code, {
    "presets": ["es2015"],
    "plugins": [
      [pluginPath, opts]
    ]
  }).code;
};

const expected = (mod) => `
'use strict';

var _${mod} = require('${mod}');

var _${mod}2 = _interopRequireDefault(_${mod});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }`
.trim();

describe("index", () => {
  describe("import", () => {
    it("doesn't change with empty options", () => {
      var code;
      code = "import _ from 'lodash'";
      expect(transform(code)).to.equal(expected("lodash"));



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
