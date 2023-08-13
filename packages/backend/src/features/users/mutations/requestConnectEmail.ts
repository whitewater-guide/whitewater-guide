import { ForbiddenError, UserInputError } from 'apollo-server-koa';
import isEmail from 'validator/lib/isEmail';

import { AuthenticatedMutation, isAuthenticatedResolver } from '~/apollo';
import { randomToken } from '~/auth';
import { db, Sql } from '~/db';
import { MailType, sendMail } from '~/mail';

const requestConnectEmail: AuthenticatedMutation['requestConnectEmail'] =
  async (_, { email }, context) => {
    if (!isEmail(email)) {
      throw new UserInputError('invalid input', {
        validationErrors: { email: 'string.email' },
      });
    }

    if (!context.user.verified) {
      throw new ForbiddenError('must be verified user');
    }

    const user: Sql.Users | null = await db()
      .table('accounts')
      .innerJoin('users', 'users.id', 'accounts.user_id')
      .where({
        'accounts.user_id': context.user.id,
      })
      .first('users.*');

    if (!user) {
      throw new ForbiddenError('must be social network user');
    }
    if (user.password) {
      throw new ForbiddenError('must not have password already set');
    }

    const token = await randomToken(email, 3);
    const tokens = user.tokens
      .filter((t) => t.claim !== 'connectEmail')
      .concat({
        claim: 'connectEmail',
        expires: token.expires,
        value: token.encrypted,
      });
    await db()
      .table('users')
      .update({ tokens: JSON.stringify(tokens) })
      .where({ id: user.id });

    await sendMail(MailType.CONNECT_EMAIL_REQUEST, email, {
      email: encodeURIComponent(email),
      user: {
        id: user.id,
        name: user.name || '',
      },
      token,
    });

    return true;
  };

export default isAuthenticatedResolver(requestConnectEmail);
