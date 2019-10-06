const { resolve } = require('path');
const { version } = require(resolve(process.cwd(), './package.json'));

module.exports = function versionTransform() {
  return {
    visitor: {
      Identifier(path) {
        if (path.node.name === 'PJSON_VERSION') {
          path.replaceWithSourceString('"' + version + '"');
        }
      },
    },
  };
};
