import { createWriteStream, lstatSync } from 'fs';
import { readdirSync, readJSONSync, writeJsonSync } from 'fs-extra';
import { resolve } from 'path';
import rimraf from 'rimraf';
import tar from 'tar';

const dirs = readdirSync(__dirname);

dirs.forEach((dir) => {
  if (dir === 'node_modules') {
    return;
  }
  const stat = lstatSync(resolve(__dirname, dir));
  if (!stat.isDirectory()) {
    return;
  }
  console.info(`Converting ${dir}...`);
  const inputFile = resolve(__dirname, dir, 'in.json');
  const outputFile = resolve(__dirname, dir, 'data.json');
  const converFile = resolve(__dirname, dir, 'convert.ts');
  const targzFile = resolve(__dirname, dir, 'data.tar.gz');
  rimraf.sync(targzFile);

  // dynamic require is totally on purpose here
  // eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-dynamic-require, global-require
  const convert = require(converFile).default;
  const input = readJSONSync(inputFile);
  const output = input.map(convert);
  writeJsonSync(outputFile, output);
  tar
    .create({ gzip: true }, [outputFile])
    .pipe(createWriteStream(targzFile))
    .on('end', () => {
      console.info(`Converted ${dir}...`);
    });
});
