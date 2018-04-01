import Joi from 'joi';
import { Context, isAuthenticatedResolver, isInputValidResolver } from '../../../apollo';
import db from '../../../db';
import { EditorSettings } from '../../../ww-commons';

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
    async (root, { editorSettings }: Vars, { user, req }: Context) => {
      await db().table('users')
        .update({ editor_settings: editorSettings })
        .where({ id: user!.id });
      const updatedUser = await db().table('users').where({ id: user!.id }).first();
      if (req) {
        return new Promise(resolve => req.login(updatedUser, () => resolve(updatedUser)));
      } else {
        return updatedUser;
      }
    },
  ),
);

export default updateEditorSettings;
