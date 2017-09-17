import { Point as WKXPoint } from 'wkx';
import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';
import { NamedResource, PointInput } from '../../ww-commons/';

export const PointsSchema = loadGraphqlFile('points');

/**
 * Raw row from database `points` table
 */
export interface PointRaw extends NamedResource {
  description: string | null;
  kind: string;
  coordinates: string;
}

export function toRaw(input: PointInput): Partial<PointRaw> {
  const { coordinates, ...rest } = input;
  const wkxPoint = new WKXPoint(...coordinates);
  wkxPoint.srid = 4326;
  return {
    ...rest,
    id: rest.id || undefined,
    name: rest.name || undefined,
    coordinates: wkxPoint.toEwkt(),
  };
}
