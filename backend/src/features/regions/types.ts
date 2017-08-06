import { Geometry, Point, Polygon } from 'wkx';
import { NamedResource } from 'ww-commons/core';
import { RegionInput } from 'ww-commons/features/regions';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';

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
}

export function toRaw(input: RegionInput): Partial<RegionRaw> {
  const { seasonNumeric, bounds, ...rest } = input;
  let rawBounds = null;
  if (bounds) {
    const polygon: Polygon = new Polygon(bounds.map(p => new Point(...p)));
    // Close the ring
    polygon.exteriorRing.push(new Point(...bounds[0]));
    polygon.srid = 4326;
    rawBounds = polygon.toEwkt();
  }
  return {
    ...rest,
    season_numeric: seasonNumeric ? seasonNumeric : [],
    bounds: rawBounds,
  };
}
