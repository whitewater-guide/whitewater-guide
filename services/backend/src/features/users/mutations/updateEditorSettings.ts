import { isAuthenticatedResolver, isInputValidResolver } from '@apollo';
import db from '@db';
import {
  EditorSettings,
  EditorSettingsStruct,
} from '@whitewater-guide/commons';
import { struct } from 'superstruct';

interface Vars {
  editorSettings: EditorSettings;
}

const Struct = struct.object({
  editorSettings: EditorSettingsStruct,
});

const updateEditorSettings = isAuthenticatedResolver(
  isInputValidResolver<Vars>(
    Struct,
    async (root, { editorSettings }, { user }) => {
      await db()
        .table('users')
        .update({ editor_settings: editorSettings })
        .where({ id: user!.id });
      return db()
        .table('users')
        .where({ id: user!.id })
        .first();
    },
  ),
);

export default updateEditorSettings;