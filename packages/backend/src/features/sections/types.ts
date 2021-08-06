import { Sql } from '~/db';

// [Sql.SectionsView, upsertedMediaIds, deletedMediaIds]
export type RawSectionUpsertResult =
  | undefined
  | [Sql.SectionsView, string[] | null, string[] | null];
