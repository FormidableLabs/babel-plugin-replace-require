const babel = require("babel-core");
const pluginPath = require.resolve("../lib/index");

const getBabelOps = (opts) => {
  return {
    "presets": ["es2015"],
    "plugins": [
      [pluginPath, opts]
    ]
  };
};

describe("index", () => {
  it("TODO REMOVE", () => {
    // eslint-disable-next-line
    const trans = babel.transform(`import _ from "FOO_TOKEN/lodash"`, getBabelOps({
      FOO_TOKEN: "foo('TODO_YO')"
    }));
    console.log(`\n\n${trans.code}\n\n`); // eslint-disable-line
  });

  describe("import", () => {
    it("should not change with empty options");
    it("should leave unmatched imports unchanged");
    it("should replace matched token require");
  });

  describe("require", () => {
    it("should not change with empty options");
    it("should not change require.resolve even with token");
    it("should leave unmatched requires unchanged");
    it("should replace matched token require");
    it("should replace matched token in nested require");
  });
});
