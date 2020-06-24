import { isInputValidResolver } from '~/apollo';
import db from '~/db';
import { UserInput, UserInputSchema } from '@whitewater-guide/commons';
import { AuthenticationError } from 'apollo-server';
import pickBy from 'lodash/pickBy';
import * as yup from 'yup';

interface Vars {
  user: UserInput;
}

const Struct = yup.object({
  user: UserInputSchema,
});

const updateProfile = isInputValidResolver<Vars>(
  Struct,
  async (root, { user }, context) => {
    if (!context.user) {
      throw new AuthenticationError('must be authenticated');
    }
    const { email, ...cleanUser } = pickBy(user, (v) => v !== undefined);
    const query = db()
      .table('users')
      .update(cleanUser)
      .where({ id: context.user.id });
    if (email) {
      query.update('email', db().raw(`COALESCE(users.email, ?)`, email));
    }
    await query;
    return db()
      .table('users')
      .where({ id: context.user.id })
      .first();
  },
);

export default updateProfile;
