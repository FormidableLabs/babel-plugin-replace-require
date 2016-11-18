<h1 align="center">babel-plugin-replace-require</h1>

<p align="center">
  <a href="https://raw.githubusercontent.com/FormidableLabs/babel-plugin-replace-require/master/LICENSE.txt">
    <img src='https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square' />
  </a>
  <a href="https://badge.fury.io/js/babel-plugin-replace-require">
    <img src="https://badge.fury.io/js/babel-plugin-replace-require.svg" alt="npm version" height="18">
  </a>
  <a href='http://travis-ci.org/FormidableLabs/babel-plugin-replace-require'>
    <img src='https://secure.travis-ci.org/FormidableLabs/babel-plugin-replace-require.svg?branch=master' />
  </a>
</p>

<h4 align="center">
  Replace <code>require</code> output generated from <code>import</code> calls.
</h4>

***

There are often situations where you'd like to pass a different `require`
function into a `require("foo")` call like `specialOtherRequire("foo")`. This is
quite easy in CommonJS, yet challenging in ES-next `import`'s because the
outputted `require` is not directly under user control.

This plugin allows `import` statements to conditionally have the `require` call
rewritten in generated output.

## Installation

The plugin is available via [npm](https://www.npmjs.com/package/babel-plugin-replace-require):

```
$ npm install babel-plugin-replace-require
```

## Usage

**.babelrc**

```json
{
  "plugins": [
    ["replace-require", {
      "BETTER_REQUIRE": "global.myBetterRequire"
    }]
  ]
}
```

## Contributions

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)
