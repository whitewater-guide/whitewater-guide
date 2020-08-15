import { NEW_ID } from '../../apollo';
import { SectionInput } from './types';

export const NULL_SECTION_INPUT: SectionInput = {
  id: null,
  name: '',
  altNames: null,
  description: null,
  season: null,
  seasonNumeric: [],

  river: {
    id: NEW_ID,
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

  createdBy: null,
  importId: null,
};
