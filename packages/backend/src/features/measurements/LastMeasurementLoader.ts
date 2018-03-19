import * as DataLoader from 'dataloader';
import { chunk, flatMap, fromPairs, get } from 'lodash';
import { getLastMeasurements } from '../../redis';
import { RedisLastMeasurement } from '../../redis/types';

interface Key {
  script: string;
  code: string;
}

// this is what have in redis cache
type LastMeasurement = RedisLastMeasurement | null;

const DLOptions: DataLoader.Options<Key, LastMeasurement> = {
  cacheKeyFn: ({ script, code }: Key) => `${script}:${code}`,
};

export class LastMeasurementLoader {
  readonly loader: DataLoader<Key, LastMeasurement>;

  constructor() {
    this.loader = new DataLoader<Key, LastMeasurement>(this.batchLoad, DLOptions);
  }

  loadByGauge = (script: string, code: string) => {
    return this.loader.load({ script, code });
  };

  batchLoad: DataLoader.BatchLoadFn<Key, LastMeasurement> = async (keys) => {
    if (keys.length === 1) {
      const lm = await getLastMeasurements(keys[0].script, keys[0].code);
      if (lm) {
        const val = lm[keys[0].code];
        return [val || null];
      }
      return [null];
    }
    // Many keys
    const scripts = new Set<string>();
    keys.forEach(({ script }) => scripts.add(script));
    const promises: any[] = [];
    scripts.forEach(script => promises.push(script, getLastMeasurements(script)));
    const flatRes = await Promise.all(promises);
    const deepMap = fromPairs(chunk(flatRes, 2)); // script --> code --> RedisMeasurement
    return keys.map(({ script, code }) => {
      try {
        return deepMap[script][code];
      } catch {
        return null;
      }
    });
  }
}
