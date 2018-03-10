import { Geometry, LineString } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Section } from '../../../ww-commons';
import { buildGaugeQuery } from '../../gauges';
import { buildRegionQuery } from '../../regions';
import { buildRiverQuery } from '../../rivers';
import { SectionRaw } from '../types';

export const sectionFieldResolvers: FieldResolvers<SectionRaw, Section> = {
  altNames: section => section.alt_names,
  seasonNumeric: section => section.season_numeric,
  difficultyXtra: section => section.difficulty_xtra,
  putIn: ({ id, language, put_in }) => {
    return {
      id: `${id}_putIn`,
      name: 'Put-in',
      description: null,
      language,
      kind: 'put-in',
      coordinates: put_in, // Will be parsed in Point resolver
    };
  },
  takeOut: ({ id, language, take_out }) => {
    return {
      id: `${id}_takeOut`,
      name: 'Take-out',
      description: null,
      language,
      kind: 'take-out',
      coordinates: take_out,
    };
  },
  flowsText: section => section.flows_text,
  shape: ({ shape }) => {
    const lineString = Geometry.parse(shape) as LineString;
    return lineString.points.map(({ x, y, z }) => [x, y, z]);
  },
  pois: section => section.pois || [],
  tags: section => section.tags || [],
  region: ({ region, region_id }, { language }, context, info) => {
    if (region) {
      return region;
    }
    return buildRegionQuery({ language, id: region_id, info, context }).first();
  },
  river: ({ river, river_id }, { language }, context, info) => {
    if (river) {
      return river;
    }
    return buildRiverQuery({ language, id: river_id, info, context }).first();
  },
  gauge: ({ gauge, gauge_id }, { language }, context, info) => {
    if (gauge) {
      return gauge;
    } else if (gauge_id) {
      return buildGaugeQuery({ language, id: gauge_id, info, context }).first();
    }
    return null;
  },
  ...timestampResolvers,
};
