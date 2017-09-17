import { Point as WKXPoint } from 'wkx';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { NamedResource, PointInput } from '../../ww-commons/';

export const PointsSchema = loadGraphqlFile('points');

/**
 * Raw row from database `points` table
 */
export interface PointRaw {
  id: string;
  name: string | null;
  description: string | null;
  kind: string;
  coordinates: string;
}

/**
 * What is give to inserts/updates
 */
export interface PointRawInput {
  id?: string;
  name: string | null;
  description: string | null;
  kind: string;
  coordinates: string;
}

export function toRaw(input: PointInput): PointRawInput {
  const { coordinates, ...rest } = input;
  const wkxPoint = new WKXPoint(...coordinates);
  wkxPoint.srid = 4326;
  return {
    ...rest,
    id: rest.id || undefined,
    coordinates: wkxPoint.toEwkt(),
  };
}
