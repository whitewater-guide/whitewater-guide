import { RegionRaw } from '@features/regions';
import Knex from 'knex';

export type RegionRow = Pick<RegionRaw, 'id' | 'name' | 'bounds'>;

export const UNKNOWN_REGION: RegionRow = {
  id: 'UNKNOWN_REGION',
  name: 'UNKNOWN_REGION',
  bounds: { type: 'Polygon', coordinates: [] },
};

export const getRegionsForMatching = async (db: Knex): Promise<RegionRow[]> =>
  db
    .table('regions_view')
    .select('id', 'name', 'bounds')
    .where({ language: 'en' });
