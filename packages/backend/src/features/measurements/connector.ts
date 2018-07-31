import log from '@log';
import { NS_LAST_MEASUREMENTS, redis } from '@redis';
import DataLoader from 'dataloader';
import { chunk, fromPairs, mapValues } from 'lodash';
import { LastMeasurement, RedisLastMeasurements } from './types';

interface Key {
  script: string;
  code: string;
}

const DLOptions: DataLoader.Options<Key, LastMeasurement> = {
  cacheKeyFn: ({ script, code }: Key) => `${script}:${code}`,
};

export class MeasurementsConnector {
  readonly loader: DataLoader<Key, LastMeasurement>;

  constructor() {
    this.loader = new DataLoader<Key, LastMeasurement>(this.loadBatch, DLOptions);
  }

  getLastMeasurement(script: string, code: string) {
    return this.loader.load({ script, code });
  }

  private async loadBatch(keys: Key[]) {
    if (keys.length === 1) {
      const lm = await this.getLastMeasurements(keys[0].script, keys[0].code);
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
    scripts.forEach(script => promises.push(script, this.getLastMeasurements(script)));
    const flatRes = await Promise.all(promises);
    const deepMap = fromPairs(chunk(flatRes, 2)); // script --> code --> RedisMeasurement
    return keys.map(({ script, code }) => {
      try {
        return deepMap[script][code];
      } catch {
        return null;
      }
    });
  };

  private async getLastMeasurements(script: string, code?: string): Promise<RedisLastMeasurements | null> {
    try {
      if (code) {
        const lastMeasurementStr = await redis.hget(`${NS_LAST_MEASUREMENTS}:${script}`, code);
        return { [code]: JSON.parse(lastMeasurementStr) };
      } else {
        const allLastMsm: string[] = await redis.hgetall(`${NS_LAST_MEASUREMENTS}:${script}`);
        return mapValues(
          allLastMsm,
          (value: string) => JSON.parse(value),
        ) as any;
      }
    } catch (err) {
      log.error({ msg: `failed to get last measurements: ${err}`, script, code });
      return null;
    }
  }
}
