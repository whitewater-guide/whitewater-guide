import { loadGraphqlFile } from '../../apollo/loadGraphqlFile';

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
