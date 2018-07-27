import { Context, isInputValidResolver } from '@apollo';
import db from '@db';
import { UserInput, UserInputSchema } from '@ww-commons';
import Joi from 'joi';
import pickBy from 'lodash/pickBy';

interface Vars {
  user: UserInput;
}

const Schema = Joi.object().keys({
  user: UserInputSchema,
});

const updateProfile = isInputValidResolver(Schema).createResolver(
  async (root, { user }: Vars, context: Context) => {
    if (!context.user) {
      return null;
    }
    const cleanUser = pickBy(user, v => v !== undefined);
    await db().table('users').update(cleanUser).where({ id: context.user.id });
    return db().table('users').where({ id: context.user.id }).first();
  },
);

export default updateProfile;
