import { Sql } from '~/db';

/**
 * Region as returned by connector
 */
export interface ResolvableRegion extends Sql.RegionsView {
  // Whether current user can edit this region
  editable: true;
}
