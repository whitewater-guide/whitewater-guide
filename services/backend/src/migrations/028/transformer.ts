import { SectionInput } from '@whitewater-guide/commons';
import deburr from 'lodash/deburr';
import { KMLSection } from './types';

export default (
  value: KMLSection,
  riverId: string,
): Omit<SectionInput, 'helpNeeded'> => {
  return {
    id: null,
    name: value.name,
    altNames: value.name === deburr(value.name) ? [] : [deburr(value.name)],
    description: value.description,
    season: null,
    seasonNumeric: [],
    river: { id: riverId },
    gauge: null,
    levels: null,
    flows: null,
    flowsText: null,
    shape: value.coordinates,
    distance: null,
    drop: null,
    duration: null,
    difficulty: value.difficulty,
    difficultyXtra: value.difficultyXtra || null,
    rating: null,
    tags: [],
    pois: [],
    media: [],
    hidden: true,
  };
};
