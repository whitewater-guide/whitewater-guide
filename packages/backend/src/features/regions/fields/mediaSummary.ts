import { Context, ListQuery } from '@apollo';
import db from '@db';
import { SectionsFilter } from '@features/sections';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const mediaSummaryResolver: GraphQLFieldResolver<RegionRaw, Context, Vars> =
  async ({ id }) => {
    const result = await db().table('media')
      .innerJoin('sections_media', 'sections_media.media_id', 'media.id')
      .innerJoin('sections', 'sections_media.section_id', 'sections.id')
      .innerJoin('rivers', 'sections.river_id', 'rivers.id')
      .select('kind')
      .count('media.id as count')
      .sum('media.size as size')
      .groupBy('media.kind')
      .where('rivers.region_id', id);
    return result.reduce((acc: any, { kind, size, count }: any) => ({
      ...acc,
      [kind]: { size, count },
    }), {} as any);
  };

export default mediaSummaryResolver;
