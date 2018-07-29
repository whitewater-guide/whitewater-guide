import { FieldResolvers } from '@apollo';
import { timestampResolvers } from '@db';
import { Section } from '@ww-commons';
import { SectionRaw } from '../types';
import description from './description';
import gauge from './gauge';
import region from './region';
import river from './river';
import shape from './shape';

export const sectionFieldResolvers: FieldResolvers<SectionRaw, Section> = {
  altNames: section => section.alt_names,
  // description is empty string when there is no description ind db (even for premium)
  // description is null when premium is required and description in db is not empty
  description,
  seasonNumeric: section => section.season_numeric,
  difficultyXtra: section => section.difficulty_xtra,
  putIn: ({ id, put_in }) => {
    return {
      id: `${id}_putIn`,
      name: 'Put-in',
      description: null,
      kind: 'put-in',
      coordinates: put_in, // Will be parsed in Point resolver
    };
  },
  takeOut: ({ id, take_out }) => {
    return {
      id: `${id}_takeOut`,
      name: 'Take-out',
      description: null,
      kind: 'take-out',
      coordinates: take_out,
    };
  },
  flowsText: section => section.flows_text,
  shape,
  pois: section => section.pois || [],
  tags: section => section.tags || [],
  region,
  river,
  gauge,
  ...timestampResolvers,
};
