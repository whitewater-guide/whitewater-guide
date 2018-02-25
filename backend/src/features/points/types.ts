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
