import { isInputValidResolver } from '@apollo';
import db from '@db';
import { UserInput, UserInputStruct } from '@whitewater-guide/commons';
import { AuthenticationError } from 'apollo-server';
import pickBy from 'lodash/pickBy';
import { struct } from 'superstruct';

interface Vars {
  user: UserInput;
}

const Struct = struct.object({
  user: UserInputStruct,
});

const updateProfile = isInputValidResolver<Vars>(
  Struct,
  async (root, { user }, context) => {
    if (!context.user) {
      throw new AuthenticationError('must be authenticated');
    }
    const cleanUser = pickBy(user, (v) => v !== undefined);
    await db()
      .table('users')
      .update(cleanUser)
      .where({ id: context.user.id });
    return db()
      .table('users')
      .where({ id: context.user.id })
      .first();
  },
);

export default updateProfile;
