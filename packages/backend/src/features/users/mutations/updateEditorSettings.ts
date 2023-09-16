import type { MutationUpdateEditorSettingsArgs } from '@whitewater-guide/schema';
import { EditorSettingsSchema } from '@whitewater-guide/schema';
import type { ObjectSchema } from 'yup';
import { object } from 'yup';

import type { AuthenticatedMutation } from '../../../apollo/index';
import {
  isAuthenticatedResolver,
  isInputValidResolver,
} from '../../../apollo/index';
import { db } from '../../../db/index';

const Struct: ObjectSchema<MutationUpdateEditorSettingsArgs> = object({
  editorSettings: EditorSettingsSchema.clone(),
});

const updateEditorSettings: AuthenticatedMutation['updateEditorSettings'] =
  async (_, { editorSettings }, { user }) => {
    await db()
      .table('users')
      .update({ editor_settings: editorSettings })
      .where({ id: user.id });
    return db().table('users').where({ id: user.id }).first();
  };

export default isInputValidResolver(
  Struct,
  isAuthenticatedResolver(updateEditorSettings),
);
