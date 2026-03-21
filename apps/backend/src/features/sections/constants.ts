import { NEW_RIVER_ID } from '@whitewater-guide/commons';
import type { SectionInput } from '@whitewater-guide/schema';

export const NULL_SECTION_INPUT: SectionInput = {
  id: null,
  name: '',
  altNames: null,
  description: null,
  season: null,
  seasonNumeric: [],

  river: {
    id: NEW_RIVER_ID,
    name: '',
  },
  gauge: null,
  region: null,
  levels: null,
  flows: null,
  flowsText: null,

  shape: [],
  distance: null,
  drop: null,
  duration: null,
  difficulty: 0,
  difficultyXtra: null,
  rating: null,
  tags: [],
  pois: [],
  media: [],

  hidden: false,
  helpNeeded: null,

  copyright: null,
  license: null,

  createdBy: null,
  importId: null,
};
