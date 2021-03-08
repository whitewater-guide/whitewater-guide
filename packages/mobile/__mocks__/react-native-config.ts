import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const test = parse(
  readFileSync(resolve(__dirname, '../.env.test'), { encoding: 'utf8' }),
);

export default {
  ...test,
};
