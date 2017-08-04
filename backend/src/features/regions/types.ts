import { ArrayMaxSize, IsDefined, IsInt, IsUUID, Length, Max, Min } from 'class-validator';
import { Geometry, Point, Polygon } from 'wkx';
import { NamedResource } from '../../apollo';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { RawTimestamped } from '../../db';
import { Timestamped } from '../../db/types';

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

/**
 * This is graphql type
 */
export interface Region extends NamedResource, Timestamped {
  description: string | null;
  season: string | null;
  seasonNumeric: number[];
  bounds: Array<[number, number, number]> | null;
  hidden: boolean | null;
}

export class RegionInput {
  @IsUUID()
  id?: string;

  @IsDefined()
  @Length(3, 128)
  name: string;

  description?: string;

  season?: string;

  @IsDefined()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(23, { each: true })
  @ArrayMaxSize(24)
  seasonNumeric?: number[];

  // TODO: add validation
  bounds?: Array<[number, number, number]>;

  hidden?: boolean;
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
