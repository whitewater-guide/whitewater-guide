import { parse } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const dev = parse(
  readFileSync(resolve(__dirname, '../.env.development'), { encoding: 'utf8' }),
);
const devLocal = parse(
  readFileSync(resolve(__dirname, '../.env.development.local'), {
    encoding: 'utf8',
  }),
);

export default {
  ...dev,
  ...devLocal,
};
