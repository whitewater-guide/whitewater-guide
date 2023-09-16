import type { Sql } from '../../db/index';

// [Sql.SectionsView, upsertedMediaIds, deletedMediaIds]
export type RawSectionUpsertResult =
  | undefined
  | [Sql.SectionsView, string[] | null, string[] | null];

/**
 * Section as returned by connector
 */
export interface ResolvableSection extends Sql.SectionsView {
  // Whether current user faved this section
  favorite?: boolean;
}
