import { Context, ListQuery } from '~/apollo';
import db from '~/db';
import { SectionsFilter } from '~/features/sections';
import { RegionMediaSummary } from '@whitewater-guide/commons';
import { GraphQLFieldResolver } from 'graphql';
import { RegionRaw } from '../types';

interface Vars extends ListQuery {
  filter?: SectionsFilter;
}

const mediaSummaryResolver: GraphQLFieldResolver<
  RegionRaw,
  Context,
  Vars
> = async ({ id }) => {
  const mediaQueue = db()
    .table('media')
    .innerJoin('sections_media', 'sections_media.media_id', 'media.id')
    .innerJoin('sections', 'sections_media.section_id', 'sections.id')
    .innerJoin('rivers', 'sections.river_id', 'rivers.id')
    .select(db().raw('kind::text'))
    .count('media.id as count')
    .sum('media.size as size')
    .groupBy('media.kind')
    .where('rivers.region_id', id);
  const mapsQueue = db()
    .select([
      db().raw('? AS kind', ['maps']),
      db().raw('0 as count'),
      'maps_size as size',
    ])
    .from('regions')
    .where('id', id);
  const result = await mapsQueue.union(mediaQueue, true);
  const emptySummary: RegionMediaSummary = {
    photo: { count: 0, size: 0 },
    video: { count: 0, size: 0 },
    blog: { count: 0, size: 0 },
    maps: { count: 0, size: 0 },
  };
  return result.reduce(
    (acc: RegionMediaSummary, { kind, size, count }: any) => ({
      ...acc,
      [kind]: { size, count },
    }),
    emptySummary,
  );
};

export default mediaSummaryResolver;
