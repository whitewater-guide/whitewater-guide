import type { Sql } from '../../db/index';

/**
 * Region as returned by connector
 */
export interface ResolvableRegion extends Sql.RegionsView {
  // Whether current user can edit this region
  editable: true;
  // Whether current user faved this region
  favorite?: boolean;
}
