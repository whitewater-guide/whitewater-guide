import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedResource } from '../../ww-commons/';
import { PointRaw } from '../points';

export const RegionsSchema = loadGraphqlFile('regions');

/**
 * Raw row from database `source` table
 */
export interface RegionRaw extends NamedResource, RawTimestamped {
  description: string | null;
  season: string | null;
  season_numeric: number[];
  bounds: string | null;
  hidden: boolean | null;
  pois: PointRaw[] | null;
}
