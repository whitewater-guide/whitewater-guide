import {
  EditorSettings,
  EditorSettingsSchema,
} from '@whitewater-guide/commons';
import * as yup from 'yup';

import {
  AuthenticatedTopLevelResolver,
  isAuthenticatedResolver,
  isInputValidResolver,
} from '~/apollo';
import db from '~/db';

interface Vars {
  editorSettings: EditorSettings;
}

const Struct: yup.SchemaOf<Vars> = yup.object({
  editorSettings: EditorSettingsSchema,
});

const updateEditorSettings: AuthenticatedTopLevelResolver<Vars> = async (
  root,
  { editorSettings },
  { user },
) => {
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
