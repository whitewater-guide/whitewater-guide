import type { SectionResolvers } from '../../../apollo/index';
import { timestampedResolvers } from '../../../apollo/index';
import createdBy from './createdBy';
import description from './description';
import favorite from './favorite';
import gauge from './gauge';
import media from './media';
import region from './region';
import river from './river';
import room from './room';
import shape from './shape';

export const sectionFieldResolvers: SectionResolvers = {
  altNames: (section) => section.alt_names,
  favorite,
  // description is empty string when there is no description ind db (even for premium)
  // description is null when premium is required and description in db is not empty
  description,
  seasonNumeric: (section) => section.season_numeric || [],
  difficultyXtra: (section) => section.difficulty_xtra,
  putIn: ({ id, put_in, name, river_name }) => ({
    id: `${id}_putIn`,
    name: `${river_name} - ${name}: Put-in`,
    description: null,
    kind: 'put-in',
    coordinates: put_in, // Will be parsed in Point resolver
  }),
  takeOut: ({ id, take_out, name, river_name }) => ({
    id: `${id}_takeOut`,
    name: `${river_name} - ${name}: Take-out`,
    description: null,
    kind: 'take-out',
    coordinates: take_out,
  }),
  flowsText: (section) => section.flows_text,
  shape,
  pois: (section) => section.pois || [],
  tags: (section) => section.tags || [],
  media,
  region,
  river,
  room,
  gauge,
  createdBy,
  helpNeeded: (s) => s.help_needed,
  ...timestampedResolvers,
};
