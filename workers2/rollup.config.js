import commonjs from 'rollup-plugin-commonjs';
import rollupJson from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';
import { minify } from 'uglify-es';

export default {
  input: 'src/galicia2.ts',
  output: {
    file: 'build/galicia2.js',
    format: 'es',
  },
  plugins: [
    typescript(),
    rollupJson(),
    resolve({
      module: false,
      jsnext: false,
      main: true,
      // extensions: [ '.js', '.json' ],
      modulesOnly: false,
    }),
    commonjs({
      include: 'node_modules/**',  // Default: undefined
      ignoreGlobal: false,  // Default: false
      sourceMap: false,  // Default: true
      // extensions: [ '.js', '.json' ],
      namedExports: {
        // left-hand side can be an absolute path, a path
        // relative to the current directory, or the name
        // of a module in node_modules
        // 'node_modules/command-line-args/lib/command-line-args.js': [ 'default' ]
        'command-line-args': [ 'default' ],
      },
      ignore: ['url', 'http', 'https', 'zlib', 'stream', 'buffer', 'string_decoder', 'util', 'net', 'assert', 'tty', 'fs', 'events', 'htmlparser2'],
    }),
    // uglify({}, minify),
  ],
}
