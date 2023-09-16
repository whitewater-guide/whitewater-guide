import type { AuthenticatedMutation } from '../../../apollo/index';
import {
  ForbiddenError,
  isAuthenticatedResolver,
  UserInputError,
} from '../../../apollo/index';
import { randomToken } from '../../../auth/index';
import type { Sql } from '../../../db/index';
import { db } from '../../../db/index';
import { MailType, sendMail } from '../../../mail/index';
import { isEmail } from '../../../utils/index';

const requestConnectEmail: AuthenticatedMutation['requestConnectEmail'] =
  async (_, { email }, context) => {
    if (!isEmail(email)) {
      throw new UserInputError('invalid input', {
        validationErrors: {
          requestConnectEmail: { email: 'yup:string.email' },
        },
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

    const byEmail: Sql.Users | undefined = await db()
      .select('*')
      .from('users')
      .where({ email })
      .first();

    if (byEmail && byEmail.id !== context.user.id) {
      throw new UserInputError('invalid input', {
        validationErrors: {
          requestConnectEmail: { email: 'yup:string.emailTaken' },
        },
      });
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
