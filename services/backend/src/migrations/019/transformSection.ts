import {
  GaugeBinding,
  SectionInput,
  toRomanDifficulty,
} from '@whitewater-guide/commons';
import isNaN from 'lodash/isNaN';
import toNumber from 'lodash/toNumber';
import { RainchasersRiver } from './types';

export const transformSection = (
  value: RainchasersRiver,
  riverId: string,
): Omit<SectionInput, 'helpNeeded'> => {
  let difficultyXtra: string | null = null;
  if (value.grade.max) {
    const maxNumeric = toNumber(value.grade.max);
    if (!isNaN(maxNumeric)) {
      difficultyXtra = toRomanDifficulty(maxNumeric);
    }
  }
  let description = value.desc;
  if (value.directions) {
    description = `${description}\n\n**Directions:**\n\n${value.directions}`;
  }
  if (value.source) {
    description = `${description}\n\n**Source:** [${value.source.name}](${value.source.url})`;
  }
  description = `${description}\n\nThis information was obtained from Rainchasers: [original link](${value.url})`;

  let flows: GaugeBinding | null = null;
  let levels: GaugeBinding | null = null;
  if (value.calibration && !Array.isArray(value.calibration)) {
    const binding: GaugeBinding = {};
    if (value.calibration.low) {
      binding.minimum = value.calibration.low;
    }
    if (value.calibration.medium) {
      binding.optimum = value.calibration.medium;
    }
    if (value.calibration.high) {
      binding.maximum = value.calibration.high;
    }
    if (value.calibration.huge) {
      binding.impossible = value.calibration.huge;
    }
    // I don't know which it binds, so it binds both
    flows = { ...binding };
    levels = { ...binding };
  }

  return {
    id: null,
    name: value.section,
    altNames: null,
    description,
    season: null,
    seasonNumeric: [],

    river: {
      id: riverId,
    },
    gauge: null,
    flows,
    levels,
    flowsText: null,

    shape: [
      [value.putin.lng, value.putin.lat, 0],
      [value.takeout.lng, value.takeout.lat, 0],
    ],
    distance: value.km,
    drop: null,
    duration: null,
    difficulty: value.grade.value,
    difficultyXtra,
    rating: null,
    tags: [],
    pois: [],
    media: [],

    hidden: true,
  };
};
