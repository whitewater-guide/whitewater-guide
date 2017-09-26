import { Geometry, Point, Polygon } from 'wkx';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { NamedResource, RegionInput } from '../../ww-commons/';
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

/**
 * What is given to insert/update statement
 */
export interface RegionRawInput {
  id: string | null;
  name: string;
  description: string | null;
  season: string | null;
  season_numeric: number[];
  bounds: string | null;
  hidden: boolean | null;
}

export function toRaw(input: RegionInput): RegionRawInput {
  const { seasonNumeric, bounds, pois, ...rest } = input;
  let rawBounds = null;
  if (bounds && bounds.length > 0) {
    const polygon: Polygon = new Polygon(bounds.map(p => new Point(...p)));
    // Close the ring
    polygon.exteriorRing.push(new Point(...bounds[0]));
    polygon.srid = 4326;
    rawBounds = polygon.toEwkt();
  }
  return {
    ...rest,
    season_numeric: seasonNumeric,
    bounds: rawBounds,
  };
}
