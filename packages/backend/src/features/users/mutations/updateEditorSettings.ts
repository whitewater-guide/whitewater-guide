import { Context, isAuthenticatedResolver, isInputValidResolver } from '@apollo';
import db from '@db';
import { EditorSettings } from '@ww-commons';
import Joi from 'joi';

interface Vars {
  editorSettings: EditorSettings;
}

const Schema = Joi.object().keys({
  editorSettings: Joi.object().keys({
    language: Joi.string().length(2),
  }),
});

const updateEditorSettings = isAuthenticatedResolver.createResolver(
  isInputValidResolver(Schema).createResolver(
    async (root, { editorSettings }: Vars, { user }: Context) => {
      await db().table('users')
        .update({ editor_settings: editorSettings })
        .where({ id: user!.id });
      return db().table('users').where({ id: user!.id }).first();
    },
  ),
);

export default updateEditorSettings;
