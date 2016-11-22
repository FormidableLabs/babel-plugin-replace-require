"use strict";
/*eslint max-len:["error",{"code":100,"ignoreTemplateLiterals":true}]*/

const path = require("path");

const trim = require("./string").trim;

module.exports.require = (modPath, req) => trim(
  `
  'use strict';

  ${req || "require"}('${modPath}');`
);

module.exports.requireAssign = (modPath, mod, req) => trim(
  `
  'use strict';

  var ${mod} = ${req || "require"}('${modPath}');`
);

module.exports.importDefault = (modPath, req) => {
  const mod = path.basename(modPath);
  return trim(
    `
    'use strict';

    var _${mod} = ${req || "require"}('${modPath}');

    var _${mod}2 = _interopRequireDefault(_${mod});

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }`
  );
};

module.exports.importMembers = (modPath, req) => trim(
  `
  'use strict';

  var _${path.basename(modPath)} = ${req || "require"}('${modPath}');`
);

module.exports.importWildcard = (modPath, alias, req) => {
  const mod = path.basename(modPath);
  return trim(
    `
    'use strict';

    var _${mod} = ${req || "require"}('${modPath}');

    var ${alias} = _interopRequireWildcard(_${mod});

    function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }`
  );
};
