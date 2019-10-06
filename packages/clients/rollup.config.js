import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

const pkg = require('./package.json');
const deps = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const extensions = ['.ts', '.tsx', '.js', '.jsx'];

const commons = () => ({
  external: (id) =>
    deps.some((dep) => dep === id || id.indexOf(`${dep}/`) === 0),
  plugins: [
    resolve({
      extensions,
    }),
    commonjs(),
    babel({
      exclude: ['node_modules/**', '**/*.test.ts', '**/__mocks__/**/*'],
      extensions,
    }),
  ],
});

export default [
  {
    input: 'src/index.ts',
    output: [{ file: pkg.main, format: 'cjs', sourcemap: true }],
    ...commons(),
  },
  {
    input: 'src/web/index.ts',
    output: [{ file: 'dist/web/index.js', format: 'cjs', sourcemap: true }],
    ...commons(),
  },
  {
    input: 'src/test/index.ts',
    output: [{ file: 'dist/test/index.js', format: 'cjs', sourcemap: true }],
    ...commons(),
  },
];
