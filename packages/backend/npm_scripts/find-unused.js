const depcheck = require('depcheck');

depcheck(
  process.cwd(),
  {
    ignoreBinPackage: false, // ignore the packages with bin entry
    skipMissing: false, // skip calculation of missing dependencies
    ignoreDirs: [
      // folder with these names will be ignored
      'bin',
      'npm_scripts',
      'coverage',
    ],
    ignoreMatches: [
      // ignore dependencies that matches these globs
      'depcheck',
      '@types/*',
      '@babel/*',
      'tslib',
      'babel-*',
      'jest*',
      'patch-package',
      'postinstall-postinstall',
      'ts-jest',
      'tslint*',
      'type-zoo',
      'typescript',
      'pino-pretty',
      'madge',
      'leakage'
    ],
    parsers: {
      // the target parsers
      // '*.js': depcheck.parser.es6,
      // '*.jsx': depcheck.parser.jsx,
      '*.ts': depcheck.parser.typescript,
      // '*.tsx': depcheck.parser.typescript,
    },
    detectors: [
      // the target detectors
      depcheck.detector.requireCallExpression,
      depcheck.detector.importDeclaration,
    ],
    specials: [
      // the target special parsers
      // depcheck.special.babel,
      // depcheck.special.eslint,
      // depcheck.special.webpack,
    ],
  },
  ({ dependencies, devDependencies }) =>
    console.dir({ dependencies, devDependencies }),
);
