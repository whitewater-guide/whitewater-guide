import Bottleneck from 'bottleneck';
import { writeJSON } from 'fs-extra';
import { resolve } from 'path';

import { importRivers } from './importRivers';
import { loadLevel } from './loadLevel';
import { RainchasersRiver } from './types';

export const importRainchasers = async () => {
  const rivers = await importRivers();
  if (rivers[0].calibration !== undefined && rivers[0].source !== undefined) {
    // fully merged json exists
    return rivers;
  }
  const limiter = new Bottleneck({ maxConcurrent: 5, minTime: 1000 });
  const riversWithLevels: RainchasersRiver[] = await Promise.all(
    rivers.map((river) => limiter.schedule(loadLevel, river)),
  );
  if (process.env.NODE_ENV === 'development') {
    const riversJSON = resolve(__dirname, 'rivers.json');
    await writeJSON(riversJSON, riversWithLevels, { spaces: 2 });
  }
  return riversWithLevels;
};
