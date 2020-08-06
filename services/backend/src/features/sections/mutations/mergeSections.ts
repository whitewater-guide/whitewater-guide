import { yupTypes } from '@whitewater-guide/validation';
import * as yup from 'yup';
import { isInputValidResolver, TopLevelResolver } from '~/apollo';
import db from '~/db';

interface Vars {
  sourceId: string;
  destinationId: string;
}

const Struct = yup.object<Vars>({
  sourceId: yupTypes
    .uuid()
    .required()
    .nullable(false),
  destinationId: yupTypes
    .uuid()
    .required()
    .nullable(false),
});

const mergeSections: TopLevelResolver<Vars> = async (
  _,
  { sourceId, destinationId },
  { dataSources },
) => {
  await dataSources.sections.assertEditorPermissions(sourceId);
  await dataSources.sections.assertEditorPermissions(destinationId);
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

  return true;
};

export default isInputValidResolver(Struct, mergeSections);
