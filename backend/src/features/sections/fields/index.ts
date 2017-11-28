import { Geometry, LineString, Point } from 'wkx';
import { FieldResolvers } from '../../../apollo';
import { timestampResolvers } from '../../../db';
import { Section } from '../../../ww-commons';
import { SectionRaw } from '../types';

const sectionFieldResolvers: FieldResolvers<SectionRaw, Section> = {
  seasonNumeric: section => section.season_numeric,
  difficultyXtra: section => section.difficulty_xtra,
  flowsText: section => section.flows_text,
  shape: ({ shape }) => {
    const lineString = Geometry.parse(shape) as LineString;
    return lineString.points.map(({ x, y, z }) => [x, y, z]);
  },
  pois: section => section.pois || [],
  tags: section => section.tags || [],
  ...timestampResolvers,
};

export default sectionFieldResolvers;
