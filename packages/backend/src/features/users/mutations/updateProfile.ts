import { Context, isInputValidResolver } from '@apollo';
import db from '@db';
import { UserInput, UserInputStruct } from '@ww-commons';
import pickBy from 'lodash/pickBy';
import { struct } from 'superstruct';

interface Vars {
  user: UserInput;
}

const Struct = struct.object({
  user: UserInputStruct,
});

const updateProfile = isInputValidResolver(Struct).createResolver(
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
