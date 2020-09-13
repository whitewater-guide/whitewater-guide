import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';

import { Context, isInputValidResolver, TopLevelResolver } from '~/apollo';
import db from '~/db';

import { SectionRaw } from '../types';
import { differ } from './utils';

const getLogSaver = async (
  user: Context['user'],
  sourceId: string,
  destinationId: string,
) => {
  const sections: SectionRaw[] = await db()
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
        editor_id: user!.id,
        diff: differ.diff(src, {}),
      })
      .into('sections_edit_log');
  };
};

interface Vars {
  sourceId: string;
  destinationId: string;
}

const Struct = yup.object<Vars>({
  sourceId: yupTypes.uuid().required().nullable(false),
  destinationId: yupTypes.uuid().required().nullable(false),
});

const mergeSections: TopLevelResolver<Vars> = async (
  _,
  { sourceId, destinationId },
  { dataSources, user },
) => {
  await dataSources.sections.assertEditorPermissions(sourceId);
  await dataSources.sections.assertEditorPermissions(destinationId);
  const saveLog = await getLogSaver(user, sourceId, destinationId);
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
