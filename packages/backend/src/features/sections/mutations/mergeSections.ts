import { MutationMergeSectionsArgs } from '@whitewater-guide/schema';
import * as yup from 'yup';

import { ContextUser, isInputValidResolver, MutationResolvers } from '~/apollo';
import { db, Sql } from '~/db';

import { differ } from './utils';

const getLogSaver = async (
  user: ContextUser,
  sourceId: string,
  destinationId: string,
) => {
  const sections: Sql.SectionsView[] = await db()
    .select('*')
    .from('sections_view')
    .whereIn('id', [sourceId, destinationId]);
  const src = sections.find(({ id }) => id === sourceId);
  const dst = sections.find(({ id }) => id === destinationId);
  if (!src || !dst) {
    return () => Promise.resolve();
  }
  return async () => {
    await db()
      .insert({
        section_id: dst.id,
        section_name: dst.name,
        river_id: dst.river_id,
        river_name: dst.river_name,
        region_id: dst.region_id,
        region_name: dst.region_name,
        action: 'merged',
        editor_id: user.id,
        diff: differ.diff(src, {}),
      })
      .into('sections_edit_log');
  };
};

const Struct: yup.SchemaOf<MutationMergeSectionsArgs> = yup.object({
  sourceId: yup.string().uuid().required().nullable(false),
  destinationId: yup.string().uuid().required().nullable(false),
});

const mergeSections: MutationResolvers['mergeSections'] = async (
  _,
  { sourceId, destinationId },
  { dataSources, user },
) => {
  await dataSources.sections.assertEditorPermissions(sourceId);
  await dataSources.sections.assertEditorPermissions(destinationId);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
  const saveLog = await getLogSaver(user!, sourceId, destinationId);
  await db().raw(
    `
    WITH update_pois AS (
      UPDATE sections_points SET section_id = ? WHERE section_id = ?
      ),
      update_media AS (
        UPDATE sections_media SET section_id = ? WHERE section_id = ?
      ),
      update_descents AS (
        UPDATE descents SET section_id = ? WHERE section_id = ?
      )
      DELETE FROM sections WHERE id = ?
  `,
    [
      destinationId,
      sourceId,
      destinationId,
      sourceId,
      destinationId,
      sourceId,
      sourceId,
    ],
  );
  await saveLog();

  return true;
};

export default isInputValidResolver(Struct, mergeSections);
