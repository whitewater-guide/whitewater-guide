import {
  EditorSettingsSchema,
  MutationUpdateEditorSettingsArgs,
} from '@whitewater-guide/schema';
import * as yup from 'yup';

import {
  AuthenticatedMutation,
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo';
import { db } from '~/db';

const Struct: yup.SchemaOf<MutationUpdateEditorSettingsArgs> = yup.object({
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
