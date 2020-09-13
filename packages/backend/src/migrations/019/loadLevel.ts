import axios from 'axios';

import { LevelRoot, RainchasersRiver } from './types';

export const loadLevel = async (
  river: RainchasersRiver,
): Promise<RainchasersRiver> => {
  if (river.calibration !== undefined && river.source !== undefined) {
    return river;
  }
  const { uuid } = river;
  const levelUrl = `http://api.rainchasers.com/v1/river/${uuid}/level`;
  try {
    const { data } = await axios.get<LevelRoot>(levelUrl);
    const {
      data: { calibration, source },
    } = data;
    return { ...river, calibration, source };
  } catch (e) {
    return river;
  }
};
