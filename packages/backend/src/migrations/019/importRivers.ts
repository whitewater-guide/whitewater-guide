import axios from 'axios';
import { pathExists, readJSON, writeJSON } from 'fs-extra';
import { resolve } from 'path';

import { RainchasersRiver, RiversRoot } from './types';

const STARTING_URL = 'http://api.rainchasers.com/v1/river';

const loadRivers = async (
  url = STARTING_URL,
  acc: RainchasersRiver[] = [],
): Promise<RainchasersRiver[]> => {
  const {
    data: {
      data,
      meta: {
        link: { next },
      },
    },
  } = await axios.get<RiversRoot>(url);
  const rivers: RainchasersRiver[] = [...acc, ...data];
  if (next) {
    return loadRivers(next, rivers);
  }
  return rivers;
};

export const importRivers = async (): Promise<RainchasersRiver[]> => {
  const riversJSON = resolve(__dirname, 'rivers.json');
  const jsonExists = await pathExists(riversJSON);
  if (jsonExists) {
    return readJSON(riversJSON);
  }
  const rivers = await loadRivers();
  if (process.env.NODE_ENV === 'development') {
    await writeJSON(riversJSON, rivers, { spaces: 2 });
  }
  return rivers;
};
