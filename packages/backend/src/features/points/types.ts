import { Coordinate3d } from '../../ww-commons';

interface PointGeoJSON {
  type: string;
  coordinates: Coordinate3d;
}
/**
 * Raw row from database `points` table
 */
export interface PointRaw {
  id: string;
  name: string | null;
  description: string | null;
  kind: string;
  coordinates: PointGeoJSON;
}
