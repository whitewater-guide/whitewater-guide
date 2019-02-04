import { readJson } from 'fs-extra';
import { resolve } from 'path';
import { RzRoot } from './types';

export const parseRiverzoneDump = async (): Promise<RzRoot> =>
  readJson(resolve(__dirname, 'riverzone.json'));
