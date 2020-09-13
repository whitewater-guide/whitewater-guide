// const modulePaths = require('./packager/modulePaths');
// const resolve = require('path').resolve;
// const fs = require('fs');
//
// const config = {
//   transformer: {
//     getTransformOptions: () => {
//       const moduleMap = {};
//       modulePaths.forEach((path) => {
//         if (fs.existsSync(path)) {
//           moduleMap[resolve(path)] = true;
//         }
//       });
//       return {
//         preloadedModules: moduleMap,
//         transform: { inlineRequires: { blacklist: moduleMap } },
//       };
//     },
//   },
// };
//
// module.exports = config;
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
