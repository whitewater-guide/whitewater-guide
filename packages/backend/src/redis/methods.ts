import { mapValues } from 'lodash';
import log from '../log';
import { redis } from './client';
import { LastMeasurementsNs, LastOpNS } from './constants';
import { RedisLastMeasurements } from './types';

export const getLastMeasurements = async (script: string, code?: string): Promise<RedisLastMeasurements | null> => {
  try {
    if (code) {
      const lastMeasurementStr = await redis.hget(`${LastMeasurementsNs}:${script}`, code);
      console.log('Hit1');
      return { code: JSON.parse(lastMeasurementStr) };
    } else {
      const allLastMsm: string[] = await redis.hgetall(`${LastMeasurementsNs}:${script}`);
      console.log('Hit2');
      return mapValues(
        allLastMsm,
        (value: string) => JSON.parse(value),
      ) as any;
    }
  } catch (err) {
    log.error({ msg: `failed to get last measurements: ${err}`, script, code });
    return null;
  }
};

export const getLastStatus = async (script: string, code?: string) => {
  try {
    if (code) {
      const statusStr = await redis.hget(`${LastOpNS}:${script}`, code);
      return JSON.parse(statusStr);
    } else {
      const statusStr = await redis.get(`${LastOpNS}:${script}`);
      return JSON.parse(statusStr);
    }
  } catch (err) {
    log.error({ msg: `failed to get last harvest status: ${err}`, script, code });
    return null;
  }
};
